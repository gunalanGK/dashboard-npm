import * as React from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  xLabel?: string;
  yLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, xLabel = "", yLabel = "" }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 500;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const isXDate = data[0]?.x && !isNaN(Date.parse(String(data[0].x)));

    const xScale = isXDate
      ? d3
          .scaleTime()
          .domain(d3.extent(data, (d) => new Date(d.x as string)) as [Date, Date])
          .range([margin.left, width - margin.right])
      : d3
          .scaleLinear()
          .domain([d3.min(data, (d) => +d.x) || 0, d3.max(data, (d) => +d.x) || 0])
          .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 0])
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<DataPoint>()
      .x((d) => (isXDate ? xScale(new Date(d.x as string)) : xScale(+d.x)))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(isXDate ? d3.axisBottom(xScale as d3.ScaleTime<number, number>).ticks(5) : d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));

    if (xLabel) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height - 5)
        .attr("text-anchor", "middle")
        .text(xLabel);
    }

    if (yLabel) {
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text(yLabel);
    }
  }, [data, xLabel, yLabel]);

  return <svg ref={svgRef} width={500} height={300}></svg>;
};

interface TableDataProps {
  tableData: {
    x: (string | number)[];
    y: number[];
    xLabel?: string; 
    yLabel?: string;
  };
}

export const LineChartComponent: React.FC<TableDataProps> = ({ tableData }) => {

  if (!tableData || !tableData.x || !tableData.y || tableData.x.length === 0 || tableData.y.length === 0) {
    console.error("Invalid or missing data for LineChartComponent");
    return null;
  }

  const formattedData: DataPoint[] = tableData.x.map((xValue, index) => ({
    x: xValue,
    y: tableData.y[index] || 0,
  }));

  return (
    <LineChart 
      data={formattedData} 
      xLabel={tableData.xLabel || ""} 
      yLabel={tableData.yLabel || ""} 
    />
  );
};

export default LineChartComponent;