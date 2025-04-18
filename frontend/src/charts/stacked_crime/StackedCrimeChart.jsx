import React, { useState, useEffect} from "react";
import ModeSelector from "./ModeSelector";
import MainChart from "./MainChart";
import SubChart from "./SubCharts";
import InfoPanel from "./InfoPanel";
import crimeDataYears from "../../data/crime_category_over_years.json";
import crimeDataHours from "../../data/crime_category_over_hours.json";
import TopCrimeChart from "./topCrimesChart"
import infoTexts from "./infoTexts"; // Adjust the path based on location


export default function StackedCrimeChart({ userType = "student" }) {
    const [mode, setMode] = useState("year"); // "year" or "hour"
    const [view, setView] = useState("main"); // "main" or "sub"
    const [activeCategory, setActiveCategory] = useState(null);
    // Initialize with the default text imported from the JSON file.
    const [infoText, setInfoText] = useState(infoTexts.default);

    const isStudent = userType === "student"

    const awarenessIntro = ( 
        <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative">
        { !isStudent ?  (
            <>
        <h2 className="text-3xl font-bold text-primary mb-4">
            Street Crime in Chicago: A Tourist's Perspective
        </h2>
        <p className="mb-4">
            Chicago is a vibrant city full of history, architecture, food, and music — but like many large urban centers, it also faces challenges with street crime.
            While the city has made efforts to improve safety, tourists can still be vulnerable to certain types of crime, especially in crowded and popular areas.
        </p>
    
        <h3 className="text-2xl font-semibold mt-6 mb-2">🕵️‍♂️ Most Common Crimes Affecting Tourists</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
            <li><strong>Theft & Pickpocketing:</strong> Especially common in high-foot-traffic areas like Michigan Avenue, Millennium Park, and CTA stations.</li>
            <li><strong>Robbery:</strong> Tourists have been targeted for their phones, cameras, and bags — particularly when distracted or alone at night.</li>
            <li><strong>Assaults & Muggings:</strong> Though less frequent, incidents of physical assault or mugging do occur near popular attractions and in poorly lit areas.</li>
            <li><strong>Scams & Fraud:</strong> Fake ticket sellers, unofficial tour guides, and credit card scams can also target unsuspecting travelers.</li>
        </ul>
        <TopCrimeChart />
        <h2 class="text-2xl font-bold mb-4">📰 Chicago Crime: Perception vs. Reality</h2>
        <p class="mb-4">
            Recent headlines suggest a decline in violent crime across U.S. cities, including Chicago. Reports indicate that homicide rates and other violent crimes decreased in many U.S. cities compared to 2023.
            <a href="https://apnews.com/article/c28f7291a1e9b8c310b586ba6514222c" target="_blank" rel="noopener noreferrer">[Source]</a>
            However, public perception doesn't always align with these statistics. Factors such as increased media coverage and social media discussions contribute to a heightened sense of insecurity among residents and visitors.
        </p>
        <p class="mb-4">
            While certain crime categories have seen reductions, others, like sexual assaults and aggravated assaults, have experienced increases in several major cities.
            <a href="https://apnews.com/article/c28f7291a1e9b8c310b586ba6514222c" target="_blank" rel="noopener noreferrer">[Source]</a>
            This complexity underscores the importance of examining detailed data to understand the full picture of crime trends in Chicago.
        </p>
        <p class="mb-4 font-semibold">
            So, is Chicago truly becoming safer? Let's delve into the data to explore the distribution of various crime categories over time.
        </p>
        </>): (
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
        )}
    </div>)
      

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

    return (
    <section> 
        {awarenessIntro}
        <div className="bg-gray-50 text-slate-800 py-8 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="analytics">
            <div className="rounded-lg overflow-hidden border border-gray-300 shadow-subtle card mx-auto" style={{ maxWidth: "1200px" }}>
                <div className="flex" style={{ height: "550px" }}>
                    <div className="flex-1 relative">
                    <ModeSelector 
                        mode={mode}
                        view={view}
                        onModeChange={handleModeChange}
                        onBack={handleBack}
                    />
                    <div className="absolute bottom-0 left-0 right-0 ">
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
                    <InfoPanel hoverInfo={null} infoText={infoText} />
                </div>
            </div>
        </div>
    </section>
    );
}

/* 
    <div className="bg-gray-50 text-slate-800 py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="analytics">
        <div className="overflow-hidden mx-auto mb-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Understanding Safety Trends in Chicago</h2>
            <p className="mb-4 text-slate-600">
                Our interactive visualization provides a comprehensive overview of safety trends across the city. By analyzing these statistics, we can gain a broad understanding of how different incident categories evolve over time, which is essential for creating effective policies and community safety strategies.
            </p>
            <p className="mb-4 text-slate-600">
                With this tool, stakeholders can observe aggregated data as well as detailed breakdowns by subcategories. Such granular insights allow decision-makers to pinpoint critical issues and assess areas that require targeted interventions.
            </p>
            <p className="text-slate-600">
                A broad understanding of these statistics not only aids in evaluating past trends but also supports future planning and resource allocation in public safety. Explore the data to uncover patterns, identify peak times, and help enhance community well-being.
            </p>
        </div>
*/