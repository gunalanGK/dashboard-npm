import React from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
interface ChartData {
    x: string[];
    y: number[];
    xLabel?: string;
    yLabel?: string;
}
interface Plot {
    plot_type: "line" | "scatter" | "bar" | "histogram" | "pie" | "doughnut";
    plot_name: string;
    data: ChartData;
}
interface ColumnData {
    plotData: Plot[];
}
interface DashboardChartsProps {
    columnData?: ColumnData;
}
declare const DashboardCharts: React.FC<DashboardChartsProps>;
export default DashboardCharts;
