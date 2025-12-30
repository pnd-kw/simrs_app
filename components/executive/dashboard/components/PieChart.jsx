"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  DoughnutController,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, DoughnutController);

const PieChartComponent = ({
  dataArray,
  labelBottom = "Total",
  ringColors = ["#005B82", "#003B5C", "#009FE3"],
}) => {
  const containerRef = useRef(null);
  const [size, setSize] = useState(200);

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500">No data available</div>
    );
  }

  const total = dataArray.reduce((sum, item) => sum + item.value, 0);
  const percentages = dataArray.map((item) => item.value / total);
  const angles = percentages.map((p) => p * 360);

  const maxIndex = dataArray.reduce(
    (max, item, i) => (item.value > dataArray[max].value ? i : max),
    0
  );

  const [activeIndex, setActiveIndex] = useState(maxIndex);

  const activeValue = dataArray[activeIndex].value;
  const activeLabel = dataArray[activeIndex].label;
  const activePercent = percentages[activeIndex];

  // === OUTER RING DATA (default white, only active has color) ===
  const outerData = {
    labels: dataArray.map((d) => d.label),
    datasets: [
      {
        data: dataArray.map((d) => d.value),
        backgroundColor: dataArray.map((_, i) =>
          i === activeIndex ? ringColors[i] : "#FFFFFF"
        ),
        borderWidth: 0,
        cutout: "96%",
        radius: "100%",
      },
    ],
  };

  const outerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    onHover: (_, elements) => {
      if (elements.length > 0) {
        const newIndex = elements[0].index;
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    },
  };

  // === INNER RING DATA ===
  const innerData = {
    labels: dataArray.map((d) => d.label),
    datasets: [
      {
        data: dataArray.map((d) => d.value),
        backgroundColor: ringColors,
        borderWidth: 0,
        cutout: "75%",
        radius: "85%",
      },
    ],
  };

  const innerOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (ctx) => {
            const label = dataArray[ctx.dataIndex].label;
            const value = dataArray[ctx.dataIndex].value;
            const percent = ((value / total) * 100).toFixed(2);
            return `${label}: ${value} (${percent}%)`;
          },
        },
      },
    },
    onHover: (_, elements) => {
      if (elements.length > 0) {
        const newIndex = elements[0].index;
        if (newIndex !== activeIndex) {
          setActiveIndex(newIndex);
        }
      }
    },
  };

  // Resize handling
  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSize(Math.min(rect.width, rect.height));
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Perhitungan posisi garis dan label
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.42;
  const labelDistance = 32;
  const labelOffset = 16;

  const angleStart =
    percentages.slice(0, activeIndex).reduce((a, b) => a + b, 0) * 360;
  const angleMid = angleStart + angles[activeIndex] / 2;
  const angleRad = ((angleMid - 90) * Math.PI) / 180;

  const labelX = centerX + (radius + labelDistance) * Math.cos(angleRad);
  const labelY = centerY + (radius + labelDistance) * Math.sin(angleRad);

  const isLeft = labelX < centerX;
  const horizontalLineX = labelX + (isLeft ? -labelOffset : labelOffset);
  const startX = centerX + radius * Math.cos(angleRad);
  const startY = centerY + radius * Math.sin(angleRad);

  const offset = 14;
  const extX = startX + offset * Math.cos(angleRad);
  const extY = startY + offset * Math.sin(angleRad);

  let cornerX = extX;
  let cornerY = extY;
  let endX = extX;
  let endY = extY;

  if (angleMid >= 0 && angleMid < 45) {
    cornerY += 8;
    endY = cornerY - 8;
  } else if (angleMid >= 45 && angleMid < 135) {
    cornerY -= 22;
    endY = cornerY + 22;
  } else if (angleMid >= 135 && angleMid < 225) {
    cornerY += 1;
    endY = cornerY + 1;
  } else if (angleMid >= 225 && angleMid < 315) {
    cornerX -= 12;
    endX = cornerX - 6;
  } else {
    cornerY -= 16;
    endY = cornerY + 16;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 min-w-[200px] gap-4">
      <div ref={containerRef} className="relative w-full aspect-square">
        {/* Outer Ring */}
        <div className="absolute inset-0 z-10">
          <Doughnut data={outerData} options={outerOptions} />
        </div>

        {/* Inner Ring */}
        <div className="absolute inset-0 z-20">
          <Doughnut data={innerData} options={innerOptions} />
        </div>

        {/* Garis & Label */}
        <svg
          className="absolute inset-0 z-30 overflow-visible"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ pointerEvents: "none" }}
        >
          {/* Garis dari chart ke label */}
          <line
            x1={endX}
            y1={endY}
            x2={labelX}
            y2={labelY}
            stroke={ringColors[activeIndex]}
            strokeWidth="1.2"
          />

          {/* Garis horizontal pendek */}
          <line
            x1={labelX}
            y1={labelY}
            x2={horizontalLineX}
            y2={labelY}
            stroke={ringColors[activeIndex]}
            strokeWidth="1.8"
          />

          {/* Titik di ujung horizontal */}
          <circle
            cx={horizontalLineX}
            cy={labelY}
            r="3"
            fill={ringColors[activeIndex]}
          />

          {/* Value */}
          <text
            x={horizontalLineX + (isLeft ? -8 : 8)}
            y={labelY - 2}
            fill={ringColors[activeIndex]}
            fontSize="12"
            fontWeight="bold"
            textAnchor={isLeft ? "end" : "start"}
            alignmentBaseline="baseline"
          >
            {activeValue}
          </text>

          {/* Persentase */}
          <text
            x={horizontalLineX + (isLeft ? -8 : 8)}
            y={labelY + 12}
            fill="#8F9E7B"
            fontSize="11"
            fontWeight="bold"
            textAnchor={isLeft ? "end" : "start"}
            alignmentBaseline="hanging"
          >
            ({(activePercent * 100).toFixed(1)}%)
          </text>
        </svg>

        {/* Label Tengah */}
        <div
          className="absolute top-1/2 left-1/2 z-40 font-bold text-sm text-center"
          style={{
            transform: "translate(-50%, -50%)",
            color: ringColors[activeIndex],
          }}
        >
          {activeLabel}
        </div>
      </div>
      {/* Label Bawah */}
      <div className="flex font-bold text-sm z-40 text-center">
        {labelBottom}
      </div>
    </div>
  );
};

export default PieChartComponent;
