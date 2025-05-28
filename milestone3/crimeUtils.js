// src/utils/crimeUtils.js

const CRIME_SEVERITY = {
  violent: [
    "HOMICIDE", "ASSAULT", "BATTERY", "KIDNAPPING",
    "ROBBERY", "CRIMINAL SEXUAL ASSAULT", "CRIM SEXUAL ASSAULT",
    "OFFENSE INVOLVING CHILDREN", "WEAPONS VIOLATION",
    "STALKING", "SEX OFFENSE"
  ],
  property: [
    "BURGLARY", "THEFT", "MOTOR VEHICLE THEFT", "CRIMINAL DAMAGE",
    "ARSON", "DECEPTIVE PRACTICE", "CRIMINAL TRESPASS"
  ],
  public_disorder: [
    "LIQUOR LAW VIOLATION", "PUBLIC PEACE VIOLATION", "GAMBLING",
    "OBSCENITY", "PUBLIC INDECENCY", "INTERFERENCE WITH PUBLIC OFFICER"
  ],
  non_criminal: [
    "NON-CRIMINAL", "NON - CRIMINAL", "NON-CRIMINAL (SUBJECT SPECIFIED)",
    "OTHER OFFENSE", "OTHER NARCOTIC VIOLATION", "RITUALISM",
    "DOMESTIC VIOLENCE", "PROSTITUTION", "INTIMIDATION", "HUMAN TRAFFICKING",
    "NARCOTICS", "CONCEALED CARRY LICENSE VIOLATION"
  ]
};

const CRIME_WEIGHTS = {
  violent: 5,
  property: 3,
  public_disorder: 2,
  non_criminal: 1,
};

// Load and build an index: tileKey => crime count
export function buildCrimeIndex(data) {
  const index = new Map();
  for (const tile of data) {
    const key = `${tile.lat.toFixed(5)}:${tile.lon.toFixed(5)}`;
    index.set(key, tile);
  }
  return index;
}

// Helper to compute tile key from lat/lon
export function getTileKey(lat, lon, latStep = 0.002, lonStep = 0.002) {
  const latTile = Math.floor(lat / latStep) * latStep;
  const lonTile = Math.floor(lon / lonStep) * lonStep;
  return `${latTile.toFixed(5)}:${lonTile.toFixed(5)}`;
}

// Compute risk score + breakdown from route geometry
export function computeRiskScoreForRoute(route, crimeIndex) {
  let totalWeightedScore = 0;
  let totalCrimes = 0;
  const breakdown = {}; // for UI

  const steps = route.legs.flatMap((leg) => leg.steps);
  const seenTiles = new Set();

  for (const step of steps) {
    const path = step.path || [];

    for (const point of path) {
      const key = getTileKey(point.lat(), point.lng());

      if (seenTiles.has(key)) continue; // avoid duplicate scoring
      seenTiles.add(key);

      const tile = crimeIndex.get(key);
      if (!tile || !tile.types) continue;

      for (const [type, count] of Object.entries(tile.types)) {
        const severity = Object.entries(CRIME_SEVERITY).find(([_, list]) =>
          list.includes(type)
        )?.[0];

        const weight = CRIME_WEIGHTS[severity] ?? 1;

        totalWeightedScore += count * weight;
        totalCrimes += count;

        breakdown[type] = (breakdown[type] || 0) + count;
      }
    }
  }

  // Normalize to a 0–100 scale using a sigmoid-like function
  const rawScore = totalWeightedScore;
  const normalizedScore = Math.round((100 * rawScore) / (rawScore + 300000));
  return {
    risk: normalizedScore,
    riskDetails: breakdown,
  };
}
