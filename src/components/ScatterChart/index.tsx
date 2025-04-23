import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface ScatterPlotProps {
  data: { x: string | number; y: number }[];
  width?: number;
  height?: number;
}

const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, width = 500, height = 300 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const isDate = data[0]?.x && !isNaN(Date.parse(data[0].x.toString()));


    const xScale = isDate
      ? d3
          .scaleTime()
          .domain(d3.extent(data, (d) => new Date(d.x.toString())) as [Date, Date])
          .range([0, innerWidth])
      : d3
          .scaleLinear()
          .domain([0, d3.max(data, (d) => +d.x) || 0])
          .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y) || 0])
      .range([innerHeight, 0]);
    

    chart
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(isDate ? new Date(d.x.toString()) : +d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 5)
      .attr("fill", "steelblue");
    

    const xAxis = isDate
      ? d3.axisBottom(xScale as d3.ScaleTime<number, number>).ticks(5)
      : d3.axisBottom(xScale);
    

    if (isDate) {
      xAxis.tickFormat((d) => {
        return d3.timeFormat("%Y-%m-%d")(d as Date);
      });
    }
    
    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);


    chart.append("g").call(d3.axisLeft(yScale));
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

interface ScatterPlotComponentProps {
  tableData: { x: (string | number)[]; y: number[] };
}

const ScatterPlotComponent: React.FC<ScatterPlotComponentProps> = ({ tableData }) => {
  if (!tableData || !tableData.x || !tableData.y || tableData.x.length === 0) {
    console.error("Invalid or missing data for ScatterPlotComponent");
    return null;
  }

  const formattedData = tableData.x.map((xValue, index) => ({
    x: xValue,
    y: tableData.y[index] || 0,
  }));

  return <ScatterPlot data={formattedData} />;
};

export default ScatterPlotComponent;