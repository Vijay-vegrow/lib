import React, { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


export default function BorrowingTrendsAreaChart({ data }) {
  const [timeRange, setTimeRange] = useState("90d");

  // Filter data by time range
  const filteredData = useMemo(() => {
    const referenceDate = new Date(data[data.length - 1]?.date || Date.now());
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    if (timeRange === "7d") daysToSubtract = 7;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return data.filter((item) => new Date(item.date) >= startDate);
  }, [data, timeRange]);

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
      <div style={{ display: "flex", width: "100%", alignItems: "center", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 20 }}>Borrowing Trends</div>
          <div style={{ color: "#666", fontSize: 14 }}>Showing total borrowings</div>
        </div>
        <select
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          style={{
            borderRadius: 8,
            padding: "6px 12px",
            border: "1px solid #ccc",
            background: "#fff",
            fontWeight: 500,
            fontSize: 14,
          }}
        >
          <option value="90d">Last 3 months</option>
          <option value="30d">Last 30 days</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillBorrow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={value => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis />
          <Tooltip
            content={({ active, payload, label }) =>
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
                    {label}
                  </p>
                  <p style={{ color: "#fff", margin: "6px 0 0 0", fontSize: 14 }}>
                    Borrows: <span style={{ marginLeft: 8 }}>{payload[0].value}</span>
                  </p>
                </div>
              ) : null
            }
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#22c55e"
            fill="url(#fillBorrow)"
            strokeWidth={3}
            dot={{ r: 4, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
            activeDot={{ r: 7 }}
            animationDuration={900}
            name="Borrows"
          />
          <Legend />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}