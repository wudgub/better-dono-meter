import React from "react";

interface IProps {
  progress: number;
  progress_pct: number;
}

const Bar: React.FC<IProps> = ({progress, progress_pct}) => {
    return (
      <div className="bar-container">
        <div className="bar-complete" style={{width: `${progress_pct}%`}}>
          <div className="bar-liquid"></div>
        </div>
        <span className="progress">${progress}</span>
      </div>
    );
  };
  
  export default Bar;