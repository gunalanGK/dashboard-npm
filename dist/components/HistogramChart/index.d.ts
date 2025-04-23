import React from "react";
interface HistogramChartComponentProps {
    tableData: {
        x: string[];
        y: number[];
    };
}
declare const HistogramChartComponent: React.FC<HistogramChartComponentProps>;
export default HistogramChartComponent;
