import React from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import LineChartComponent from "../../components/LineChart";
import ScatterPlotComponent from "../../components/ScatterChart";
import BarChartComponent from "../../components/BarChart";
import HistogramChartComponent from "../../components/HistogramChart";
import PieChartComponent from "../../components/PieChart";
import DoughnutChartComponent from "../../components/DoughnutChart";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

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


const DashboardCharts: React.FC<DashboardChartsProps> = ({ columnData }) => {
  const dataToUse = columnData;

  if (!dataToUse || !dataToUse.plotData || dataToUse.plotData.length === 0) {
    return <div>No data available</div>;
  }

  const renderChart = (plot: Plot) => {
    switch (plot.plot_type) {
      case "line":
        return <LineChartComponent tableData={plot.data} />;
      case "scatter":
        return <ScatterPlotComponent tableData={plot.data} />;
      case "bar":
        return <BarChartComponent tableData={plot.data} />;
      case "histogram":
        return <HistogramChartComponent tableData={plot.data} />;
      case "pie":
        return <PieChartComponent tableData={plot.data} />;
      case "doughnut":
        return <DoughnutChartComponent tableData={plot.data} />;
      default:
        return null;
    }
  };

  const layouts = {
    lg: dataToUse.plotData.map((plot, i) => ({
      i: plot.plot_name,
      x: (i % 2) * 6,
      y: Math.floor(i / 2) * 6,
      w: 6,
      h: 6,
    })),
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 2 }}
      rowHeight={80}
      margin={[16, 16]}
      isResizable
      isDraggable
    >
      {dataToUse.plotData.map((plot) => (
        <div key={plot.plot_name} className="bg-white rounded-xl border shadow">
          <div className="h-14 px-4 flex items-center font-semibold border-b">
            {plot.plot_name}
          </div>
          <div className="p-4 h-full flex items-center justify-center">
            {renderChart(plot)}
          </div>
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DashboardCharts;
