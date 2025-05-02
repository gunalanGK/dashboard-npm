import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  category: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}


const customPalette = [
  "#80cbc4", "#ef5350", "#ff8a65", "#ffd54f", "#fdd835", "#aed581",
  "#ba68c8", 
  "#4fc3f7",
];

const fallbackPalette = d3.schemeSet2;

const combinedPalette = [
  ...customPalette,
  ...fallbackPalette.slice(customPalette.length)
];

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 500,
  height = 300,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const total = d3.sum(data, (d) => d.value);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.category))
      .range([0, innerWidth])
      .padding(0.2);

    const yMax = d3.max(data, (d) => d.value) ?? 0;
    const yScale = d3
      .scaleLinear()
      .domain([0, Math.ceil(yMax)])
      .nice()
      .range([innerHeight, 0]);

    const colors = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => d.category))
      .range(combinedPalette);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
      
      chart.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .tickValues(yScale.ticks().filter(tick => Number.isInteger(tick))) 
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#e5e7eb");
    
    const yAxisG = chart
      .append("g")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(Math.ceil(yMax))
          .tickFormat(d3.format("d"))
      );

    yAxisG.selectAll("text").style("font-size", "12px");
    yAxisG.selectAll("path.domain").attr("stroke", "#e5e7eb");
    yAxisG.selectAll("line").attr("stroke", "#e5e7eb");

    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .style("font-size", "14px")
      .text("Count");

    chart
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").attr("stroke", "#e5e7eb");
      })
      .selectAll("text")
      .attr("transform", "rotate(0)")
      .style("text-anchor", "middle")
      .style("font-size", "12px");

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "#1f2937")
      .style("color", "#fff")
      .style("padding", "6px 10px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 2px 10px rgba(0,0,0,0.2)")
      .style("opacity", 0)
      .style("pointer-events", "none");

    chart
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.category)!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", (d) => colors(d.category))
      .on("mouseover", function (event, d) {
        const percent = ((d.value / total) * 100).toFixed(1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.category}</strong><br/>Value: ${d.value} (${percent}%)`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
        d3.select(this).style("opacity", 0.8);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).style("opacity", 1);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

interface BarChartComponentProps {
  tableData: { x: string[]; y: number[] };
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({ tableData }) => {
  const sampleData = tableData.x.map((category, index) => ({
    category,
    value: tableData.y[index],
  }));

  return <BarChart data={sampleData} />;
};

export default BarChartComponent;
