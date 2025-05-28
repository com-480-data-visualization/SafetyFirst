const infoText = {
  default: (
  <>
    <p class="mb-4">
      Here's a quick overview of what each category includes:
    </p>
    <ul class="list-disc list-inside space-y-2">
      <li>
        <strong>Assault:</strong> Violent offenses such as battery, robbery, and weapons violations.
      </li>
      <li>
        <strong>Minor:</strong> Public safety concerns like narcotics, burglary, and public peace violations.
      </li>
      <li>
        <strong>Non-Street Crime:</strong> Private or domestic offenses including deceptive practices and trespassing.
      </li>
      <li>
        <strong>Sex Offense:</strong> Crimes such as sexual assault, stalking, and kidnapping.
      </li>
      <li>
        <strong>Theft:</strong> Property crimes including theft, criminal damage, and motor vehicle theft.
      </li>
    </ul>
  </>
  ),
  ASSAULT: (
    <>
      <h3 class="text-xl font-semibold mb-2">Assault</h3>
      <p>
        This category includes violent offenses such as <strong>aggravated battery</strong>, <strong>robbery</strong>, and <strong>homicide</strong>.
        It also encompasses incidents involving <strong>weapons violations</strong> and <strong>intimidation</strong>.
      </p>
      <p class="mt-2 text-gray-600">
        These are typically crimes that pose a direct physical threat to individuals in public or residential spaces.
      </p>
    </>
  ),
  MINOR: (
    <>
      <h3 class="text-xl font-semibold mb-2">Minor Crimes</h3>
      <p>
        Covers less violent but significant public safety concerns like <strong>narcotics offenses</strong>, <strong>prostitution</strong>, <strong>burglary</strong>, and <strong>arson</strong>.
      </p>
      <p class="mt-2 text-gray-600">
        These crimes often occur in both residential and commercial areas and may affect community stability.
      </p>
    </>
  ),
  "NON STREET CRIME": (
  <>
    <h3 class="text-xl font-semibold mb-2">Non-Street Crime</h3>
    <p>
      Includes more private or domestic incidents like <strong>trespassing</strong>, <strong>deceptive practices</strong>, and <strong>domestic battery</strong>.
      Also includes <strong>child-related offenses</strong> and home invasions.
    </p>
    <p class="mt-2 text-gray-600">
      These are often less visible but have long-term consequences on community well-being.
    </p>
  </>
  ),
  "SEX OFFENSE": (
    <>
  <h3 class="text-xl font-semibold mb-2">Sex Offenses</h3>
  <p>
    Involves serious crimes such as <strong>criminal sexual assault</strong>, <strong>kidnapping</strong>, and <strong>stalking</strong>.
  </p>
  <p class="mt-2 text-gray-600">
    These offenses often happen in both public and private settings and disproportionately impact vulnerable individuals.
  </p></>
  ),
  THEFT: (
  <>
  <h3 class="text-xl font-semibold mb-2">Theft</h3>
  <p>
    Encompasses a wide range of property crimes including <strong>general theft</strong>, <strong>criminal damage</strong>, and <strong>motor vehicle theft</strong>.
  </p>
  <p class="mt-2 text-gray-600">
    These are among the most common offenses affecting both residents and tourists, often occurring in crowded or unattended locations.
  </p>
  </>
  )
};

function getInfoText(category) {
  return infoText[category] || infoText.default;
}


export default getInfoText;

