import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type DataPoint = {
  xaxis: number;
  yaxis: number;
};

const HistogramChart: React.FC<{
  data: DataPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 500, height = 350 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const xValues = data.map((d) => d.xaxis);
    const yValues = data.map((d) => d.yaxis);

    if (yValues.length === 0) {
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .text("No valid data to display");
      return;
    }

    const xScale = d3
      .scaleBand()
      .domain(xValues.map(String))
      .range([margin.left, width - margin.right])
      .padding(0);

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...yValues) || 1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const chart = svg.append("g");

    chart
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).tickSize(0)) 
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    chart.append("g").attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(yScale));

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(String(d.xaxis))!)
      .attr("width", xScale.bandwidth())
      .attr("y", (d) => yScale(d.yaxis))
      .attr("height", (d) => height - margin.bottom - yScale(d.yaxis)) 
      .attr("fill", "steelblue")
      .append("title")
      .text((d) => `X: ${d.xaxis}, Y: ${d.yaxis}`);
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

interface HistogramChartComponentProps {
  tableData: { x: string[]; y: number[] };
}

const HistogramChartComponent: React.FC<HistogramChartComponentProps> = ({ tableData }) => {
  const sampleData = tableData.x.map((x, index) => ({
    xaxis: parseFloat(x),
    yaxis: tableData.y[index],
  }));

  return <HistogramChart data={sampleData} />;
};

export default HistogramChartComponent;
