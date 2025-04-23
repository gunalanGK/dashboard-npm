import React from "react";
interface PieChartComponentProps {
    tableData: {
        x: string[];
        y: number[];
    };
}
declare const PieChartComponent: React.FC<PieChartComponentProps>;
export default PieChartComponent;
