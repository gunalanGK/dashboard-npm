import React from "react";
interface PieChartComponentProps {
    tableData: {
        x: (string | boolean)[];
        y: (string | number | null | undefined)[];
    };
}
declare const PieChartComponent: React.FC<PieChartComponentProps>;
export default PieChartComponent;
