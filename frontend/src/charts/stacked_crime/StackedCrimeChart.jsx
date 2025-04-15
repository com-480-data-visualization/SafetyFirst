import React, { useState } from "react";
import ModeSelector from "./ModeSelector";
import MainChart from "./MainChart";
import SubChart from "./SubCharts";
import InfoPanel from "./InfoPanel";
import crimeDataYears from "../../data/crime_category_over_years.json";
import crimeDataHours from "../../data/crime_category_over_hours.json";

export default function StackedCrimeChart() {
    const [mode, setMode] = useState("year"); // "year" or "hour"
    const [view, setView] = useState("main"); // "main" or "sub"
    const [activeCategory, setActiveCategory] = useState(null);
    const [infoText, setInfoText] = useState("Click a segment of the chart to learn more about that crime category.");
    // ...other state variables
    
    // Choose dataset based on mode etc.
    const dataSet = mode === "year" ? crimeDataYears : crimeDataHours;

    const handleModeChange = (newMode) => { 
        setMode(newMode);
        setView("main");
        setActiveCategory(null);
        // Possibly bump revision here
    };

    const handleBack = () => {
        setView("main");
        setActiveCategory(null);
        setInfoText("Click a segment of the chart to learn more about that crime category.");
    };

    // Depending on view, render MainChart or SubChart.
    return (
        <div className="bg-black text-white py-16 px-4 sm:px-8 md:px-16 lg:px-32 relative">
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
                                setInfoText(`Subcategory breakdown for ${category}. Click Back to return.`);
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
