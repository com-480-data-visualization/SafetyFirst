import React, { useState, useEffect} from "react";
import ModeSelector from "./ModeSelector";
import MainChart from "./MainChart";
import SubChart from "./SubCharts";
import InfoPanel from "./InfoPanel";
import crimeDataYears from "../../data/crime_category_over_years.json";
import crimeDataHours from "../../data/crime_category_over_hours.json";
import infoTexts from "./infoTexts.json";


export default function StackedCrimeChart() {
    const [mode, setMode] = useState("year"); // "year" or "hour"
    const [view, setView] = useState("main"); // "main" or "sub"
    const [activeCategory, setActiveCategory] = useState(null);
    // Initialize with the default text imported from the JSON file.
    const [infoText, setInfoText] = useState(infoTexts.default);

      

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
    <div className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative">
        <div className="overflow-hidden mx-auto mb-8">
            <h1 className="text-3xl font-bold mb-4">Understanding Crime Trends in Chicago</h1>
            <p className="mb-4">
                Our interactive visualization provides a comprehensive overview of crime trends across the city. By analyzing these statistics, we can gain a broad understanding of how different crime categories evolve over time, which is essential for creating effective policies and community safety strategies.
            </p>
            <p className="mb-4">
                With this tool, stakeholders can observe aggregated crime data as well as detailed breakdowns by subcategories. Such granular insights allow decision-makers to pinpoint critical issues and assess areas that require targeted interventions.
            </p>
            <p>
                A broad understanding of these statistics not only aids in evaluating past trends but also supports future planning and resource allocation in public safety. Explore the data to uncover patterns, identify peak times, and help enhance community well-being.
            </p>
        </div>
        <div className="rounded-xl overflow-hidden border-4 border-red-500 shadow-lg mx-auto" style={{ maxWidth: "1200px" }}>
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
