import * as React from "react";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  x: string | number;
  y: number;
}

interface LineChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 1000,
  height = 300,
  xLabel = "",
  yLabel = "",
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (!data || data.length === 0) return;

    const isXDate = data[0]?.x && !isNaN(Date.parse(String(data[0].x)));
    const sortedData = isXDate
      ? [...data].sort(
          (a, b) =>
            new Date(a.x as string).getTime() -
            new Date(b.x as string).getTime()
        )
      : data;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = isXDate
      ? d3
          .scaleTime()
          .domain(
            d3.extent(sortedData, (d) => new Date(d.x as string)) as [
              Date,
              Date
            ]
          )
          .range([0, innerWidth])
      : d3
          .scaleLinear()
          .domain([
            d3.min(sortedData, (d) => +d.x) || 0,
            d3.max(sortedData, (d) => +d.x) || 0,
          ])
          .range([0, innerWidth]);

    const maxY = d3.max(sortedData, (d) => d.y) || 0;
    const yMaxWithPadding = maxY * 1.1;

    const yScale = d3
      .scaleLinear()
      .domain([0, yMaxWithPadding])
      .nice()
      .range([innerHeight, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .selectAll("line")
      .attr("stroke", "#e0e0e0")
      .attr("stroke-dasharray", "2,2");

    g.select(".grid path").attr("stroke", "none");

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        isXDate
          ? d3
              .axisBottom(xScale as d3.ScaleTime<number, number>)
              .ticks(6)
              .tickSize(0)
              .tickFormat(
                (domainValue: Date | d3.NumberValue, _index: number) =>
                  d3.timeFormat("%b")(new Date(domainValue as Date))
              )
          : d3.axisBottom(xScale).ticks(6).tickSize(0)
      )
      .selectAll("text")
      .attr("text-anchor", "middle")
      .attr("dx", "0em")
      .attr("dy", "1em")
      .attr("font-size", "12px");

    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5).tickSize(0))
      .selectAll("text")
      .attr("font-size", "12px");

    if (yLabel) {
      g.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .style("font-size", "14px")
        .text(yLabel);
    }

    g.selectAll(".x-axis path, .x-axis line, .y-axis path, .y-axis line").attr(
      "stroke",
      "#e5e7eb"
    );

    const area = d3
      .area<DataPoint>()
      .x((d) => (isXDate ? xScale(new Date(d.x as string)) : xScale(+d.x)))
      .y0(innerHeight)
      .y1((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    const line = d3
      .line<DataPoint>()
      .x((d) => (isXDate ? xScale(new Date(d.x as string)) : xScale(+d.x)))
      .y((d) => yScale(d.y))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(sortedData)
      .attr("fill", " #FFE5B4")
      .attr("opacity", "0.5")
      .attr("d", area);

    g.append("path")
      .datum(sortedData)
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 2)
      .attr("d", line);

    g.selectAll(".data-point")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", (d) =>
        isXDate ? xScale(new Date(d.x as string)) : xScale(+d.x)
      )
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 4)
      .attr("fill", "#f59e0b")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background-color", "rgba(0, 0, 0, 0.7)")
      .style("color", "white")
      .style("padding", "6px 10px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("font-size", "12px")
      .style("opacity", 0);

    g.selectAll<SVGCircleElement, DataPoint>(".data-point")
      .on("mouseover", function (event: MouseEvent, d: DataPoint) {
        d3.select(this).attr("r", 6).attr("fill", "#f59e0b");

        tooltip
          .style("opacity", 1)
          .html(
            `Date: ${
              isXDate
                ? d3.timeFormat("%b %d, %Y")(new Date(d.x as string))
                : d.x
            }<br/>Count: ${d.y}`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 4).attr("fill", "#f59e0b");
        tooltip.style("opacity", 0);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, width, height, xLabel, yLabel]);

  return <svg ref={svgRef} width={width} height={height} />;
};

interface TableDataProps {
  tableData: {
    x: (string | number)[];
    y: (string | number)[];
    xLabel?: string;
    yLabel?: string;
  };
}

const LineChartComponent: React.FC<TableDataProps> = ({ tableData }) => {
  if (
    !tableData ||
    !tableData.x ||
    !tableData.y ||
    tableData.x.length === 0 ||
    tableData.y.length === 0
  ) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded">
        Invalid or missing data for chart
      </div>
    );
  }

  const formattedData: DataPoint[] = tableData.x.map((xValue, index) => ({
    x: xValue,
    y: Number(tableData.y[index]) || 0,
  }));

  return (
    <div className="w-full p-4 border rounded shadow-md bg-white">
      <LineChart
        data={formattedData}
        xLabel={tableData.xLabel || ""}
        yLabel={tableData.yLabel || "Currency"}
      />
    </div>
  );
};

export default LineChartComponent;
