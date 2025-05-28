const fs = require("fs");

const data = JSON.parse(fs.readFileSync("crime_tiles_summary.json", "utf8"));

const allTypes = new Set();

data.forEach(tile => {
  if (tile.types) {
    Object.keys(tile.types).forEach(type => allTypes.add(type));
  }
});

console.log("🧠 Unique Crime Types:");
console.log([...allTypes].sort());
