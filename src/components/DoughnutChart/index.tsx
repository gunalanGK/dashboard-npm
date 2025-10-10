import React, { useRef, useEffect, useState } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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

    const color = d3
      .scaleOrdinal<string, string>()
      .domain(data?.map((d) => String(d.category)))
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
      .attr("d", arc as any)
      .attr("fill", (d) => color(String(d.data.category)))
      .style("opacity", 0.9);

    segments
      .append("path")
      .attr("class", "highlight-arc")
      .attr("d", (d) =>
        d3
          .arc<d3.PieArcDatum<DataPoint>>()
          .innerRadius(radius)
          .outerRadius(radius + 10)(d)
      )
      .attr("fill", (d) => {
        const baseColor = color(String(d.data.category));
        const fadedColor = d3.color(baseColor)?.copy();
        if (fadedColor) fadedColor.opacity = 0.5;
        return fadedColor?.toString() || baseColor;
      })
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
          .style("opacity", 1);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this)
          .select(".highlight-arc")
          .transition()
          .style("opacity", 0);
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

  const sampleData = tableData?.x?.map((label, index) => ({
    category: label,
    value: Number(tableData.y[index] ?? 0),
  }));

  const itemsPerPage = 5;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = page * itemsPerPage;
  const paginatedData = sampleData.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="d-flex flex-1">
      <div className="flex-2 d-flex justify-center">
        <DoughnutChart data={sampleData} width={260} height={260} />
      </div>

      <div className="ml-5 flex-1 d-flex flex-column gap-2 align-start justify-center">
        <div
          style={{
            width: "93px",
            height: "165px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "20px",
            overflow: "visible",
            position: "relative",
          }}
        >
          {paginatedData.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                position: "relative",
              }}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor:
                    combinedPalette[
                      (startIndex + index) % combinedPalette.length
                    ],
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 400,
                  color: "#111827",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "65px",
                  display: "inline-block",
                  cursor: "default",
                }}
              >
                {item.category}
              </span>

              <div
                style={{
                  position: "absolute",
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  boxShadow: "0px 2px 10px rgba(0,0,0,0.2)",
                  opacity: hoverIndex === index ? 1 : 0,
                  pointerEvents: "none",
                  top: "-35px",
                  left: "20px",
                  transition: "opacity 0.2s",
                  whiteSpace: "nowrap",
                  zIndex: 1000,
                }}
              >
                {item.category}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "8px",
              gap: "4px",
            }}
          >
            <button
              onClick={handlePrev}
              disabled={page === 0}
              style={{
                border: "none",
                background: "transparent",
                cursor: page === 0 ? "not-allowed" : "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: page === 0 ? "#A6AAAF" : "#0060AA",
                fontSize: "18px",
              }}
            >
              <ArrowDropUpIcon style={{ fontSize: "18px" }} />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "12px",
                minWidth: "30px",
                justifyContent: "center",
              }}
            >
              {page + 1}/{totalPages}
            </div>

            <button
              onClick={handleNext}
              disabled={page === totalPages - 1}
              style={{
                border: "none",
                background: "transparent",
                cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                color: page === totalPages - 1 ? "#A6AAAF" : "#0060AA",
                fontSize: "18px",
              }}
            >
              <ArrowDropDownIcon style={{ fontSize: "18px" }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoughnutChartComponent;
