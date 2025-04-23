import React from "react";
interface DoughnutChartComponentProps {
    tableData: {
        x: (string | boolean)[];
        y: (string | number | null | undefined)[];
    };
}
declare const DoughnutChartComponent: React.FC<DoughnutChartComponentProps>;
export default DoughnutChartComponent;
