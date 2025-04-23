import React from "react";
interface ScatterPlotComponentProps {
    tableData: {
        x: (string | number)[];
        y: number[];
    };
}
declare const ScatterPlotComponent: React.FC<ScatterPlotComponentProps>;
export default ScatterPlotComponent;
