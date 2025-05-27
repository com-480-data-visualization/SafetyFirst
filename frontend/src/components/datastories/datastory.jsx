import React, { useState, useEffect, act} from "react";
import ModeSelector from "./charts/stacked_crime/ModeSelector";
import MainChart from "./charts/stacked_crime/MainChart";
import SubChart from "./charts/stacked_crime/SubCharts";
import InfoPanel from "./charts/stacked_crime/InfoPanel";
import crimeDataYears from "../../data/crime_category_over_years.json";
import crimeDataHours from "../../data/crime_category_over_hours.json";
import TopCrimeChart from "./charts/stacked_crime/topCrimesChart"
import infoTexts from "./charts/stacked_crime/infoTexts"; // Adjust the path based on location
import InstructionParagraph from "../presets";

export default function DataStoryIntroduction({ userType = "student" }) {
    const [mode, setMode] = useState("year"); // "year" or "hour"
    const [view, setView] = useState("main"); // "main" or "sub"
    // Initialize with the default text imported from the JSON file.
    const [infoText, setInfoText] = useState(infoTexts.default);

    const isStudent = userType === "student"
    // Set category of crime for the first chart
    const [activeCategory, setActiveCategory] = useState("theft");    
    const [activeCategoryIntro, setActiveCategoryIntro] = useState("theft");
    const [modeStory, setModeStory] = useState("text");

    const colors = {
        theft: "#e74c3c",
        assault: "#3498db",
        fraud: "#9b59b6"
    };

    // Choose dataset based on mode etc.
    const dataSet = mode === "year" ? crimeDataYears : crimeDataHours;

    const handleModeChange = (newMode) => { 
        setMode(newMode);
        setView("main");
        setActiveCategory(null);
        setInfoText(infoTexts.default);
    };

    const handleBack = () => {
        setView("main");
        setActiveCategory(null);
        setInfoText(infoTexts.default);
    };

    const CategoryButton = ({ category, label }) => (
        <span 
            onClick={() => setActiveCategoryIntro(category)}
            className={`inline-block px-4 py-2 rounded-full font-medium cursor-pointer transition text-white`}
            style={{
                backgroundColor: activeCategoryIntro === category ? colors[category] : "#e0f2fe",
                color: activeCategoryIntro === category ? "#ffffff" : "#1e3a8a"
            }}>
        {label}</span> 
    );


    const storyIntroTourist = (
        <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Welcome to Chicago!
          </h2>
      
          <p className="mb-6">
            You arrive at Union Station and feel a cool breeze from Lake Michigan as you pull your suitcase along the platform. After checking in at your downtown hotel, you’re ready to see the city.
          </p>
      
          <p className="mb-8">
            You walk to Millennium Park, where the famous Bean shines in the sunlight. Families laugh, musicians play, and you stop to take a photo. Suddenly, you notice someone’s hand slip into another tourist’s bag and take a wallet. Your heart races as you watch them disappear into the crowd.  
            <br /><br />
            A colorful flier at a nearby kiosk catches your eye: <em>“Tourist Safety in Chicago: Common Crimes & How to Stay Safe.”</em> You pick it up and discover an interactive guide with maps, crime types, and safety tips.  
            <br /><br />
            <strong>Welcome to our Chicago Crime Data Story: your quick guide to staying safe while you explore this amazing city.</strong>
          </p>
      
          <button
            onClick={() => setModeStory("plot")}
            className="block mx-auto bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Read the Flier
          </button>
        </div>
      )
      
      
      

    
    const barPlotTourist = (
        <>
            {/* LEFT: Text */}
            <h2 className="text-3xl font-bold text-primary mb-4">
            🧳 Street Crime in Chicago: A Tourist's Perspective
            </h2>
            <p className="mb-8">
                Chicago is a vibrant city full of history, architecture, food, and music — but like many large urban centers, it also faces challenges with street crime.
                While the city has made efforts to improve safety, tourists can still be vulnerable to certain types of crime, especially in crowded and popular areas.
            </p>
            <div className="flex flex-col lg:flex-row gap-10 items-start">
                {/* LEFT: List of common crimes */}
                <div className="w-full lg:w-1/3">
                    <ul className="list-none list-inside mb-4 space-y-1">
                        <li className="mb-4">
                        <CategoryButton category={"theft"} label="Theft & Pickpocketing" />
                        Especially common in high-foot-traffic areas like Michigan Avenue, Millennium Park, and CTA stations.</li>
                        <li className="mb-4"><CategoryButton category={"assault"} label="Robbery & Assault" />
                        Tourists have been targeted for their phones, cameras, and bags — especially when distracted or alone at night. Though less common, incidents of physical assault or mugging can also occur near popular attractions and in poorly lit areas.</li>
                        <li className="mb-4">
                        <CategoryButton category={"fraud"} label="Scams & Fraud" />
                        Fake ticket sellers, unofficial tour guides, and credit card scams can also target unsuspecting travelers.</li>
                    </ul>
                </div>
                {/* RIGHT: Chart */}
                <div className="w-full lg:w-2/3">
                    <TopCrimeChart activeCategory={activeCategoryIntro} />
                </div>
            </div>
        </>
    )

    const barPlotStudent = (
        <>
            <h2 class="text-3xl sm:text-4xl font-bold text-primary mb-4">
                🎓 Street Crime in Chicago: A new Student’s Reality
            </h2>
            <p class="text-lg mb-4">
                Chicago is an incredible place to begin your academic journey — packed with music, museums, food, and vibrant neighborhoods.
                But as with any large urban environment, it’s important to understand the risks that come with city living,
                especially when you're new and still getting your bearings.
            </p>
            <p class="text-lg mb-4">
                Many students navigate unfamiliar streets, use public transportation late at night, and live in off-campus housing — all of which come with specific safety concerns.
                Awareness is key to confidently and safely exploring your new home.
            </p>

            <h3 class="text-2xl font-semibold mt-8 mb-4">🚨 Common Crimes That Impact Students</h3>
            <ul class="list-disc list-inside space-y-3 text-lg">
                <li>
                <strong>Street Robberies & Muggings:</strong> Students walking alone, especially at night or near transit stops, are sometimes approached by individuals demanding phones, wallets, or backpacks — often under threat.
                </li>
                <li>
                <strong>Apartment Break-ins:</strong> Off-campus housing, especially in less-monitored areas, may be vulnerable to break-ins. Theft of electronics, bikes, and personal items is a recurring issue.
                </li>
                <li>
                <strong>Phone Snatching:</strong> Phones are frequently stolen directly from students' hands — especially when texting or browsing while walking or waiting at a bus stop.
                </li>
                <li>
                <strong>Bike Theft:</strong> Even with locks, bikes left unattended on the street or in unsecured dorm racks are common targets.
                </li>
                <li>
                <strong>Ride-Share Impersonation & Scams:</strong> Fake Uber/Lyft drivers or people posing as delivery personnel sometimes approach students, especially near nightlife or dorm entrances.
                </li>
                <li>
                <strong>Fraud & Identity Theft:</strong> Students may be targeted by phishing emails pretending to be from university services, scholarship offers, or fake landlords requesting deposits.
                </li>
            </ul>

            <h3 class="text-xl font-semibold mt-10 mb-2 text-green-700">🛡️ Stay Smart, Stay Safe</h3>
            <p class="text-lg">
                This tool helps you visualize real data on crimes around your school and across the city —
                empowering you to make informed choices about your routes, housing, and daily routines.
                Whether you're headed to class or grabbing late-night snacks, a little planning goes a long way.
            </p>
        </>
    );


    const awarenessIntro = ( 
        <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative">
            {/* Awareness Intro Section */}
            { isStudent ?  (
                {barPlotStudent} 
            ) : (
                modeStory === "text"
                  ? storyIntroTourist
                  : barPlotTourist
              )
            }
        </div>
    )

    const crimeCategories = (
        
        <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="analytics">
            {/* Transition from asking locals into the data section */}
            <h2 class="text-2xl font-bold mb-4">📰 Chicago Crime: Perception vs. Reality</h2>
            <p className="mb-4 italic">
                You stop at a busy café and strike up a conversation with a few locals. “We’ve been hearing about more thefts by the riverwalk,” one says. “And late-night muggings downtown,” another adds. Their concerns linger in your mind—so you decide to dig into the numbers yourself.
            </p>

            <p class="mb-4">
                <a href="https://apnews.com/article/c28f7291a1e9b8c310b586ba6514222c" target="_blank" rel="noopener noreferrer">Recent headlines</a> suggest a decline in violent crime across U.S. cities, including Chicago.
                    However, public perception doesn't always align with these statistics. Factors such as increased media coverage and social media discussions contribute to a heightened sense of insecurity among residents and visitors.
            </p>
            <InstructionParagraph>
                So, is Chicago truly becoming safer? Let's delve into the data to explore the trend of crimes over time. <br />                         Click on any segment of the chart to explore detailed information about specific crime categories in Chicago.
            </InstructionParagraph>

            <div className="flex max-w-screen-xl mx-auto">
                {/* LEFT: Instruction + Details */}
                <div className="w-full md:w-2/5 space-y-2">
                    {/* Instruction Text */}
                    <div className="text-gray-700">
                    <p>
                        Here's a quick overview of what each category includes:
                    </p>
                    </div>
                    {/* Details Component */}
                    <div className="text-sm space-y-2">
                    <p><strong>• Assault:</strong> Violent offenses such as battery, robbery, and weapons violations.</p>
                    <p><strong>• Minor:</strong> Public safety concerns like narcotics, burglary, and public peace violations.</p>
                    <p><strong>• Non-Street Crime:</strong> Private or domestic offenses including deceptive practices and trespassing.</p>
                    <p><strong>• Sex Offense:</strong> Crimes such as sexual assault, stalking, and kidnapping.</p>
                    <p><strong>• Theft:</strong> Property crimes including theft, criminal damage, and motor vehicle theft.</p>
                    </div>
                </div>

                {/* RIGHT: Controls + Chart */}
                <div className="w-full md:w-3/5">
                    <ModeSelector 
                        mode={mode}
                        view={view}
                        onModeChange={handleModeChange}
                        onBack={handleBack}
                    />
                    {view === "main" ? (
                    <MainChart 
                        dataSet={dataSet.main} 
                        xKey={mode === "year" ? "Year" : "hour"}
                        mode={mode}
                        onTraceClick={(category) => {
                        setActiveCategory(category);
                        setView("sub");
                        // Use the corresponding info text loaded from JSON
                        setInfoText(infoTexts[category]);
                        }}
                    />
                    ) : (
                    <SubChart 
                        activeCategory={activeCategory}
                        mainData={dataSet.main} 
                        subData={dataSet.subcategories[activeCategory]}
                        xKey={mode === "year" ? "Year" : "hour"}
                        mode={mode}
                        onTraceClick={(subcat) => {
                            setInfoText(`You clicked on subcategory ${subcat} under ${activeCategory}.`);
                        }}
                    />
                    )}
                </div>
            </div>
        </div>
    );
      

    return (
        <>
            {/* Awareness Intro Section */}
            <section id="intro" className="h-screen snap-start w-screen overflow-x-hidden overflow-y-scroll snap-y snap-mandatory scroll-smooth">
                {awarenessIntro}
            </section>
            {/* Crime Categories Plot */}
            <section id="crime-categories" className="h-screen snap-start w-screen overflow-x-hidden overflow-y-scroll snap-y snap-mandatory scroll-smooth">
                {crimeCategories}
            </section>
        </>
    );
}


/* 
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">
"bg-gray-50 font-sans text-slate-800 overflow-x-hidden h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
 */