import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type DataPoint = {
  category: string;
  value: number;
};

const PieChart: React.FC<{
  data: DataPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 400, height = 350 }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie<DataPoint>().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3
      .arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(0)
      .outerRadius(radius);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    g.selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.category))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("opacity", 0.9)
      .on("mouseover", function () {
        d3.select(this).style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.9);
      });

    // Labels
    g.selectAll("text")
      .data(data_ready)
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", "#fff")
      .text((d) => d.data.category);
  }, [data, width, height]);

  return <svg ref={svgRef} />;
};

interface PieChartComponentProps {
  tableData: { x: string[]; y: number[] };
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({ tableData }) => {
  if (!tableData?.x?.length || !tableData?.y?.length) {
    return <p>No data available</p>;
  }

  const sampleData = tableData.x.map((label, index) => ({
    category: label,
    value: tableData.y[index],
  }));

  return <PieChart data={sampleData} />;
};

export default PieChartComponent;
