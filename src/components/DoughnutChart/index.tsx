import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type DataPoint = {
  category: string | boolean;
  value: number;
};

const customPalette = [
  "#80cbc4",
  "#ef5350",
  "#ff8a65",
  "#ffd54f",
  "#fdd835",
  "#aed581",
  "#ba68c8",
  "#4fc3f7",
];

const fallbackPalette = d3.schemeSet2;

const combinedPalette = [
  ...customPalette,
  ...fallbackPalette.slice(customPalette.length),
];

const DoughnutChart: React.FC<{
  data: DataPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 500, height = 350 }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;
  const innerRadius = radius * 0.5;

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    // const colors = generateColorPalette(data.length);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => String(d.category)))
      .range(combinedPalette);

    const pie = d3.pie<DataPoint>().value((d) => d.value);
    const data_ready = pie(data);

    const arc = d3
      .arc<d3.PieArcDatum<DataPoint>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

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

    const segments = g
      .selectAll(".segment")
      .data(data_ready)
      .enter()
      .append("g")
      .attr("class", "segment");

    segments
      .append("path")
      .attr("class", "main-arc")
      .attr("d", function (d) {
        return arc(d as d3.PieArcDatum<DataPoint>);
      })
      .attr("fill", (d) => color(String(d.data.category)))
      .attr("stroke", "none")
      .style("stroke-width", "0px")
      .style("opacity", 0.9);

    segments
      .append("path")
      .attr("class", "highlight-arc")
      .attr("d", function (d) {
        const highlightArc = d3
          .arc<d3.PieArcDatum<DataPoint>>()
          .innerRadius(radius)
          .outerRadius(radius + 10);
        return highlightArc(d as d3.PieArcDatum<DataPoint>);
      })
      .attr("fill", (d) => {
        const baseColor = color(String(d.data.category));
        const fadedColor = d3.color(baseColor)?.copy();
        if (fadedColor) {
          fadedColor.opacity = 0.5;
        }
        return fadedColor?.toString() || baseColor;
      })
      .attr("stroke", "none")
      .style("opacity", 0);

    segments
      .on("mouseover", function (event, d) {
        const percent = (
          (d.data.value / d3.sum(data, (d) => d.value)) *
          100
        ).toFixed(1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.category}</strong><br/>Value: ${d.data.value} (${percent}%)`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");

        d3.select(this)
          .select(".highlight-arc")
          .transition()
          .duration(200)
          .style("opacity", 1);

        d3.select(this)
          .select(".main-arc")
          .transition()
          .duration(200)
          .attr("stroke", "none");
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);

        d3.select(this)
          .select(".highlight-arc")
          .transition()
          .duration(200)
          .style("opacity", 0);

        d3.select(this)
          .select(".main-arc")
          .transition()
          .duration(200)
          .attr("stroke", "#none");
      });
  }, [data, width, height]);

  return <svg ref={ref} />;
};

interface DoughnutChartComponentProps {
  tableData: {
    x: (string | boolean)[];
    y: (string | number | null | undefined)[];
  };
}

const DoughnutChartComponent: React.FC<DoughnutChartComponentProps> = ({
  tableData,
}) => {
  if (!tableData?.x?.length || !tableData?.y?.length) {
    return <p>No data available</p>;
  }

  const sampleData = tableData.x.map((label, index) => ({
    category: label,
    value: Number(tableData.y[index] ?? 0),
  }));

  const colors = combinedPalette;

  return (
    <div className="d-flex flex-1">
      <div className="flex-2 d-flex justify-center">
        <DoughnutChart data={sampleData} width={260} height={260} />
      </div>

      <div className="ml-5 flex-1  d-flex gap-8 flex-column align-center overflow-auto justify-center">
        {sampleData.map((item, index) => (
          <div key={index} className="d-flex items-center mb-2">
            <div
              className="w-15px h-15px mr-2 radius-360"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span>{String(item.category)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoughnutChartComponent;
