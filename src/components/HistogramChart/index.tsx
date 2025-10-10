import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  category: string;
  value: number;
}

interface HistogramChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  barWidth?: number;
}

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

const calculateNiceMax = (maxValue: number): number => {
  if (maxValue <= 0) return 10;

  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalized = maxValue / magnitude;

  let niceMax;
  if (normalized <= 1) niceMax = 1;
  else if (normalized <= 2) niceMax = 2;
  else if (normalized <= 2.5) niceMax = 2.5;
  else if (normalized <= 5) niceMax = 5;
  else niceMax = 10;

  return niceMax * magnitude;
};

const calculateTickCount = (maxValue: number): number => {
  if (maxValue <= 10) return Math.min(maxValue, 5);
  if (maxValue <= 50) return 5;
  if (maxValue <= 100) return 10;
  if (maxValue <= 500) return 10;
  return 10;
};

const HistogramChart: React.FC<HistogramChartProps> = ({
  data,
  width = 500,
  height = 300,
  barWidth = 60,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };

  useEffect(() => {
    if (!data || data.length === 0) return;

    const barSpacing =0;
    const totalWidth = data.length * (barWidth + barSpacing);
    const chartWidth = Math.max(width, totalWidth + margin.left + margin.right);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.attr("width", chartWidth);

    const total = d3.sum(data, (d) => d.value);
    const innerWidth = chartWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(data?.map((d) => d.category))
      .range([0, totalWidth])
      .padding(barSpacing / (barWidth + barSpacing));

    const yMax = d3.max(data, (d) => d.value) ?? 0;
    const yDomainMax = calculateNiceMax(yMax * 1.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, yDomainMax])
      .range([innerHeight, 0]);

    const colors = d3
      .scaleOrdinal<string, string>()
      .domain(data?.map((d) => d.category))
      .range(combinedPalette);

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const scrollableContent = chart
      .append("g")
      .attr("class", "scrollable-content");

    const tickCount = calculateTickCount(yDomainMax);
    const tickStep = yDomainMax / tickCount;
    const gridTicks = Array.from(
      { length: tickCount + 1 },
      (_, i) => i * tickStep
    );

    scrollableContent
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yScale)
          .tickValues(gridTicks)
          .tickSize(-totalWidth)
          .tickFormat(() => "")
      )
      .call((g) => {
        g.select(".domain").remove();
        g.selectAll("line").attr("stroke", "#e5e7eb").attr("opacity", 0.7);
      });

    scrollableContent
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => xScale(d.category)!)
      .attr("y", (d) => yScale(d.value))
      .attr("width", barWidth)
      .attr("height", (d) => innerHeight - yScale(d.value))
      .attr("fill", (d) => colors(d.category))
      .attr("rx", 2)
      .attr("ry", 2);

    const xAxis = scrollableContent
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .call((g) => {
        g.selectAll(".tick line").remove();
        g.select(".domain").attr("stroke", "#e5e7eb");
      });

    const stickyYAxis = chart.append("g").attr("class", "sticky-y-axis");

    const formatValue = (d: number) => {
      if (d >= 1000000) return `${(d / 1000000).toFixed(1)}M`;
      if (d >= 1000) return `${(d / 1000).toFixed(1)}K`;
      return d.toFixed(0);
    };

    const yAxisG = stickyYAxis.append("g").call(
      d3
        .axisLeft(yScale)
        .tickValues(gridTicks)
        .tickFormat((d) => formatValue(d as number))
    );

    yAxisG.selectAll("text").style("font-size", "12px");
    yAxisG.selectAll("path.domain").attr("stroke", "#e5e7eb");
    yAxisG.selectAll("line").attr("stroke", "#e5e7eb");

    stickyYAxis
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -margin.left + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#6b7280")
      .style("font-size", "14px")
      .text("Count");

    stickyYAxis
      .insert("rect", ":first-child")
      .attr("x", -margin.left)
      .attr("y", -margin.top)
      .attr("width", margin.left)
      .attr("height", height)
      .attr("fill", "white")
      .attr("stroke", "none");

    const maxLength = 8;
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("background-color", "#1f2937")
      .style("color", "#fff")
      .style("padding", "8px 12px")
      .style("border-radius", "6px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 2px 10px rgba(0,0,0,0.2)")
      .style("opacity", 0)
      .style("pointer-events", "none")
      .style("z-index", "1000");

    xAxis
      .selectAll("text")
      .each(function (d: unknown) {
        const category = String(d);
        const truncated =
          category.length > maxLength
            ? category.slice(0, maxLength) + "…"
            : category;
        d3.select(this)
          .text(truncated)
          .attr("data-full", category)
          .style("cursor", truncated.endsWith("…") ? "pointer" : "default");
      })
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .on("mouseover", function (event: any, d: unknown) {
        const fullLabel = d3.select(this).attr("data-full")!;
        if (d3.select(this).text().endsWith("…")) {
          tooltip
            .style("opacity", 1)
            .html(`<strong>${fullLabel}</strong>`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 40 + "px");
        }
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    scrollableContent
      .selectAll(".bar")
      .on("mouseover", function (event: any, d: unknown) {
        const dataPoint = d as DataPoint;
        const percent = ((dataPoint.value / total) * 100).toFixed(1);
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${dataPoint.category}</strong><br/>
             Value: <strong>${dataPoint.value}</strong><br/>
             Percentage: <strong>${percent}%</strong>`
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
        d3.select(this).style("opacity", 0.85);
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).style("opacity", 1);
      });

    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const scrollLeft = container.scrollLeft;
        stickyYAxis.attr("transform", `translate(${scrollLeft}, 0)`);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      tooltip.remove();
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [data, width, height, barWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: "auto",
        overflowY: "hidden",
        position: "relative",
      }}
    >
      <svg ref={svgRef} height={height} />
    </div>
  );
};

interface HistogramChartComponentProps {
  tableData: { x: string[]; y: number[] };
}

const HistogramChartComponent: React.FC<HistogramChartComponentProps> = ({ tableData }) => {
  const sampleData =
    tableData?.x?.map((category, index) => ({
      category,
      value: tableData.y[index],
    })) || [];

  return <HistogramChart data={sampleData} barWidth={60} width={500} height={300} />;
};

export default HistogramChartComponent;
