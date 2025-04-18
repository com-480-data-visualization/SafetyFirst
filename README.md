# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Antonio Mari | 377119 |
| Marco Scialanga | 369469 |
| Ahmed Abdelmalek | 344471 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

**Working prototype link**: TODO: ADD link

## Milestone 1 (21st March, 5pm)

**10% of the final grade**


### 🔍 Problem Statement

In large cities like Chicago, unfamiliarity with neighborhoods can pose serious safety risks—especially for exchange students and tourists. Navigation apps like Google Maps don't consider crime data when suggesting routes, potentially guiding users through high-risk areas.

**Goal:**  
Develop a visualization-driven tool that predicts and visualizes safety risks across the city of Chicago, helping users make safer travel decisions. The system will assign "safety scores" to navigation routes and highlight crime hot spots along the way.

**Key Features:**
- Select a time, start, and destination to receive route suggestions scored by safety.
- Interactive maps and charts offer detailed safety insights about each route.

---

### 📊 Dataset

**Source:** [Crimes - 2001 to Present (Chicago Data Portal)](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2/about_data)

- Over 8 million crime records including type, time, location, and arrest data.
- The 2025 subset includes 38,516 crime reports (up to March).
- Cleaned by:
  - Filtering out incomplete records (e.g., missing coordinates).
  - Excluding non-street crimes like financial fraud.
  - Categorizing crimes into relevant groups (e.g., Assault, Theft, etc.).

**Visualization Tool:**  
We will use the **Leaflet JS library** with OpenStreetMap integration to deliver dynamic, high-quality, interactive crime heatmaps and safety overlays.

---

### 📈 Exploratory Data Analysis

- **Trends:** Crime rates have declined since early 2000s, with notable dips during COVID-19.
- **Frequent Offenses:** Theft, battery, burglary, and robbery dominate.
- **Crime Categories:** Grouped into Assault, Theft, Sex Offense, Minor, and Non-Street Crime.
- **Location Classification:**
  - Street, Public Transport, Airport, Stores, Non-relevant
- **Heatmaps:** Show time- and location-specific crime hotspots, supporting safe route planning.

---

### 📚 Related Work

- Existing visualizations on the [Chicago Data Portal](https://data.cityofchicago.org/) and Kaggle focus on crime heatmaps and basic temporal analysis.
- Prior works do not guide users through the **safest** paths in real-time.
- Our project transforms static crime data into **actionable route suggestions**, offering a practical and interactive safety assistant.

---

### 💡 Motivation

Many EPFL students consider studying abroad. With crime datasets like Chicago’s readily available and a clear need for localized safety guidance, this project serves as both a valuable resource and an engaging data visualization challenge.

---


## Milestone 2 (18th April, 5pm)

**10% of the final grade**

### 🧭 Website Features

#### 🎯 Homepage
- Users identify as either **students** or **tourists** to receive tailored data stories.
- Option to directly access the **SafeRoute** pathfinding tool.

#### 📊 Data Stories

**1. Crime Statistics**
- Dual-column layout with interactive **stacked plots** and descriptive text.
- Toggle between **yearly trends** and **time-of-day patterns**.
- Clickable categories to explore subcategories and corresponding stats.

**2. Newspaper Showcases**
- Real-world crime articles relevant to the user profile (student or tourist).
- Includes location highlights, incident summaries, and possibly images.

**3. Interactive Crime Map**
- Select areas and time ranges to view crime **density heatmaps**.
- Explore crime frequencies by type and location (e.g., streets, bus stops).
- Filter map by specific crime types (e.g., pickpocketing).

---

#### 🗺️ SafeRoute Tool

- Users input start, destination, and mode of travel (walk, car, bike).
- Retrieves routes from **Google Maps**.
- Calculates and displays a **"risk score"** based on crime history.
- Suggests alternative routes that minimize exposure to crime hotspots.

---

### 🛠️ Tools & Technologies

- **Frontend:** React.js 19, TailwindCSS, Framer Motion  
- **Visualizations:** Plotly.js, Recharts  
- **Mapping:** Google Maps API, React-Leaflet, Three.js (for potential 3D views)

---

### 💡 Extra Feature Ideas

1. **Animated Newspaper Articles:** Add immersive transitions to boost engagement.  
2. **Contextual Risk Summaries:** Show alerts and hot-spot descriptions on SafeRoute.  
3. **LLM Integration:** Use AI to generate summaries of crime zones and pull relevant news.

---

### 📚 Course Resources Used

- **Maps** – visualizing geographic data effectively  
- **Interactions** – ensuring user-friendly and responsive UIs  
- **Design & Do's and Don'ts** – guiding visual clarity and usability  
- **Storytelling** – engaging users through narrative-driven exploration

---


## Milestone 3 (30th May, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

