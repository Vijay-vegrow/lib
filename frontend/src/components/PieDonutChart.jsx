"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Label, Tooltip, ResponsiveContainer } from "recharts";

export default function PieDonutChart({
  data,
  title = "Pie Chart - Donut with Text",
  description = "",
  centerLabel = "Total",
  centerValue,
  footer = "",
  trending = "",
}) {
  const total = React.useMemo(
    () => centerValue ?? data.reduce((acc, curr) => acc + curr.value, 0),
    [data, centerValue]
  );

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.18)",
        borderRadius: 18,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2rem",
        margin: "1.5rem 0",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.25)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 20 }}>{title}</div>
        {description && (
          <div style={{ color: "#666", fontSize: 14 }}>{description}</div>
        )}
      </div>
      <div style={{ width: "100%", maxWidth: 300, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              content={({ active, payload }) =>
                active && payload && payload.length ? (
                  <div
                    style={{
                      background: "rgba(34,197,94,0.95)",
                      color: "#fff",
                      borderRadius: 10,
                      padding: "1rem 1.5rem",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                  >
                    <p style={{ fontWeight: 600, fontSize: 16, margin: 0 }}>
                      {payload[0].name}
                    </p>
                    <p style={{ color: "#fff", margin: "6px 0 0 0", fontSize: 14 }}>
                      {payload[0].value}
                    </p>
                  </div>
                ) : null
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              strokeWidth={5}
              isAnimationActive
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          style={{ fill: "#222", fontSize: 24, fontWeight: 700 }}
                        >
                          {total.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          style={{ fill: "#666", fontSize: 14 }}
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        {trending && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 500 }}>
            {trending} <TrendingUp style={{ width: 18, height: 18 }} />
          </div>
        )}
        {footer && (
          <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}