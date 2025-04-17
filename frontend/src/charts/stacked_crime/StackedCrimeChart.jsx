import React, { useState, useEffect} from "react";
import ModeSelector from "./ModeSelector";
import MainChart from "./MainChart";
import SubChart from "./SubCharts";
import InfoPanel from "./InfoPanel";
import crimeDataYears from "../../data/crime_category_over_years.json";
import crimeDataHours from "../../data/crime_category_over_hours.json";
import infoTexts from "./infoTexts.json";


export default function StackedCrimeChart({ userType = "student" }) {
    const [mode, setMode] = useState("year"); // "year" or "hour"
    const [view, setView] = useState("main"); // "main" or "sub"
    const [activeCategory, setActiveCategory] = useState(null);
    // Initialize with the default text imported from the JSON file.
    const [infoText, setInfoText] = useState(infoTexts.default);

    const isStudent = userType === "student"

    const awarenessIntro = !isStudent && (
        <section className="p-6 bg-white rounded-lg shadow-md mb-12 animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">
            🌆 Understanding Street Crime in Chicago: A Tourist's Perspective
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
    
        <h3 className="text-2xl font-semibold mt-6 mb-2">📍 Tourist Hotspots with Crime Incidents</h3>
        <p className="mb-4">
            Tourist-heavy areas such as Grant Park, Buckingham Fountain, Navy Pier, and the Loop have seen a number of reported incidents.
            These places are not inherently unsafe, but their popularity makes them prime spots for opportunistic crime.
        </p>
    
        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600">
            For example, in <strong>November 2014</strong>, a tourist was robbed at gunpoint while taking photos at <strong>Buckingham Fountain</strong> — 
            losing a $5,000 camera and other valuables. Incidents like this highlight the need for awareness and preparedness.
        </blockquote>
        </section>
    );
      

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
        <div className="bg-gray-50 text-slate-800 py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative" id="analytics">
        {awarenessIntro}
        <div className="rounded-lg overflow-hidden border border-gray-300 shadow-subtle card mx-auto" style={{ maxWidth: "1200px" }}>
            <div className="flex" style={{ height: "600px" }}>
                <div className="flex-1 relative">
                <ModeSelector 
                    mode={mode}
                    view={view}
                    onModeChange={handleModeChange}
                    onBack={handleBack}
                />
                <div className="absolute bottom-0 left-0 right-0 top-10">
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