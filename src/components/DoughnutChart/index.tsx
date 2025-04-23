import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

type DataPoint = {
  category: string | boolean;
  value: number;
};

const generateColorPalette = (numColors: number): string[] => {
  return Array.from({ length: numColors }, (_, i) =>
    d3.interpolateRainbow(i / numColors)
  );
};

const DoughnutChart: React.FC<{
  data: DataPoint[];
  width?: number;
  height?: number;
}> = ({ data, width = 400, height = 350 }) => {
  const ref = useRef<SVGSVGElement | null>(null);
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;
  const innerRadius = radius * 0.5;

  useEffect(() => {
    if (!data.length) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const colors = generateColorPalette(data.length);

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data.map((d) => String(d.category)))
      .range(colors);

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

    g.selectAll("path")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(String(d.data.category)))
      .attr("stroke", "#fff")
      .style("stroke-width", "2px")
      .style("opacity", 0.9)
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
        d3.select(this).style("opacity", 1);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).style("opacity", 0.9);
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

  const colors = generateColorPalette(sampleData.length);

  return (
    <div className="d-flex flex-1">
      <div className="flex-2 d-flex justify-center">
        <DoughnutChart data={sampleData} width={250} height={200} />
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
