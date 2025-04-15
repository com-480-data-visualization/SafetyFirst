// InfoPanel.jsx
import React from "react";

const InfoPanel = ({ hoverInfo, infoText }) => {
  return (
    <div className="w-2/5 bg-gray-900 p-4 overflow-y-auto">
      {hoverInfo && (
        <div className="mb-4 p-2 bg-gray-800 rounded">
          <strong>Hover Info: </strong>{hoverInfo}
        </div>
      )}
      <div className="text-sm leading-relaxed">
        {infoText}
      </div>
    </div>
  );
};

export default InfoPanel;
