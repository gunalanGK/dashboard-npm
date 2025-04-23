import React from "react";
import LineChartComponent from "../../components/LineChart";
import ScatterPlotComponent from "../../components/ScatterChart";
import BarChartComponent from "../../components/BarChart";
import HistogramChartComponent from "../../components/HistogramChart";
import PieChartComponent from "../../components/PieChart";
import DoughnutChartComponent from "../../components/DoughnutChart";


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


const defaultColumnData: ColumnData = {
  plotData: [
    {
      plot_type: "scatter",
      plot_name: "Recycling Volume Trend",
      data: {
        x: ["2024-02-01", "2024-02-02", "2024-02-03", "2024-02-04", "2024-02-05", "2024-02-06", "2024-02-07", "2024-02-08", "2024-02-09", "2024-02-10"],
        y: [2.8, 0.6, 2.4, 3.2, 2.8, 4.3, 5.6, 6.4, 7.7, 8.1]
      }
    },
    {
      plot_type: "bar",
      plot_name: "Waste Type Frequency",
      data: {
        x: ["Glass", "Metal", "Organic", "Paper", "Plastic"],
        y: [2, 3, 2, 1, 2]
      }
    },
    {
      plot_type: "line",
      plot_name: "Recycling Cost Trend",
      data: {
        x: ["2024-02-01", "2024-02-02", "2024-02-03", "2024-02-04", "2024-02-05", "2024-02-06", "2024-02-07", "2024-02-08", "2024-02-09", "2024-02-10"],
        y: [3.2, 9.6, 9.6, 12.8, 16, 22.4, 22.4, 25.6, 25.8, 32]
      }
    },
    {
      plot_type: "histogram",
      plot_name: "Waste Weight Distribution",
      data: {
        x: ["10.5", "12.0", "13.5", "1.5", "15.0", "3.0", "4.5", "6.0", "7.5", "9.0"],
        y: [1, 2, 3, 1, 2, 3, 4, 3, 2, 4]
      }
    },
    {
      plot_type: "pie",
      plot_name: "Waste Type Proportion",
      data: {
        x: ["Glass", "Metal", "Organic", "Paper", "Plastic"],
        y: [2, 3, 1, 4, 5]
      }
    },
    {
      plot_type: "doughnut",
      plot_name: "Waste Type Market Share",
      data: {
        x: ["Glass", "Metal", "Organic", "Paper", "Plastic"],
        y: [2, 3, 1, 4, 5]
      }
    }
  ]
};

const DashboardCharts: React.FC<DashboardChartsProps> = ({ columnData }) => {

  const dataToUse = columnData || defaultColumnData;


  console.log("Data to use:", dataToUse);


  if (!dataToUse || !dataToUse.plotData || dataToUse.plotData.length === 0) {
    console.log("No plot data available");
    return <div>No data available</div>;
  }

  const renderChart = (plot: Plot) => {
    switch (plot.plot_type) {
      case "line":
        return <LineChartComponent key={plot.plot_name} tableData={plot.data} />;
      case "scatter":
        return <ScatterPlotComponent key={plot.plot_name} tableData={plot.data} />;
      case "bar":
        return <BarChartComponent key={plot.plot_name} tableData={plot.data} />;
      case "histogram":
        return <HistogramChartComponent key={plot.plot_name} tableData={plot.data} />;
      case "pie":
        return <PieChartComponent key={plot.plot_name} tableData={plot.data} />;
      case "doughnut":
        return <DoughnutChartComponent key={plot.plot_name} tableData={plot.data} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      {dataToUse.plotData.filter((plot: Plot) => plot.data.x.length).map((plot: Plot) => (
        <div
          key={plot.plot_name}
          className="w-526px h-417px radius-8 bg-white border-solid-horizontal-line d-flex align-center justify-center d-flex flex-column"
        >
          <div className="h-56px d-flex pl-40 align-center w-100">{plot.plot_name}</div>
          <div className="d-flex align-center justify-center flex-1">
            {renderChart(plot)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCharts;
