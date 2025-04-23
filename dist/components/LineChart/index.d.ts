import * as React from "react";
interface TableDataProps {
    tableData: {
        x: (string | number)[];
        y: number[];
        xLabel?: string;
        yLabel?: string;
    };
}
export declare const LineChartComponent: React.FC<TableDataProps>;
export default LineChartComponent;
