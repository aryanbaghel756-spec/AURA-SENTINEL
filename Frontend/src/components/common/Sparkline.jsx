import React, { useId } from "react";

export default function Sparkline({
  data = [],
  width = 160,
  height = 42,
  color = "#00f0ff",
  max = 100,
  min = 0,
}) {
  const gradientId = useId();

  if (!data || data.length < 2) {
    return (
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "10px",
          color: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        TELEMETRY ACQUIRING...
      </div>
    );
  }

  const padding = 4;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * usableWidth;
    const clamped = Math.max(min, Math.min(max, val));
    const y = height - padding - ((clamped - min) / (max - min)) * usableHeight;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylineStr = points.join(" ");
  const areaPoints = `${padding},${height} ${polylineStr} ${width - padding},${height}`;

  return (
    <svg
      width={width}
      height={height}
      className="soc-sparkline"
      style={{ overflow: "visible" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={polylineStr}
      />
      {points.length > 0 && (
        <circle
          cx={points[points.length - 1].split(",")[0]}
          cy={points[points.length - 1].split(",")[1]}
          r="3"
          fill="#ffffff"
          stroke={color}
          strokeWidth="2"
        />
      )}
    </svg>
  );
}
