import * as React from "react";
interface TableDataProps {
    tableData: {
        x: (string | number)[];
        y: (string | number)[];
        xLabel?: string;
        yLabel?: string;
    };
}
declare const LineChartComponent: React.FC<TableDataProps>;
export default LineChartComponent;
