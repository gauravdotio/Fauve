"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data: { label: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-72 w-full border border-border bg-surface p-5">
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-ink-faint">Revenue — last 14 days</p>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#883c29" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#883c29" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6e1d6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#a29a89" }} axisLine={{ stroke: "#e6e1d6" }} tickLine={false} interval={1} />
          <YAxis tick={{ fontSize: 11, fill: "#a29a89" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={48} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
            contentStyle={{ border: "1px solid #e6e1d6", borderRadius: 0, fontSize: 12 }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#883c29" strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
