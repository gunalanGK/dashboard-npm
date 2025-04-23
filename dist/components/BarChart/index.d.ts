import React from "react";
interface BarChartComponentProps {
    tableData: {
        x: string[];
        y: number[];
    };
}
declare const BarChartComponent: React.FC<BarChartComponentProps>;
export default BarChartComponent;
