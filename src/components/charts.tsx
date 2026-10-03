"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "#17171a",
  border: "1px solid #2d2d33",
  borderRadius: "5px",
  fontSize: "11.5px",
  color: "#d4d4d8",
  fontFamily: "var(--font-jbmono), monospace",
};

export function EnrollmentTrend({ data }: { data: { month: string; enrolled: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="target" stroke="#f59e0b" strokeDasharray="5 4" strokeWidth={1.5} fill="none" name="Target (cumulative)" />
        <Area type="monotone" dataKey="enrolled" stroke="#10b981" strokeWidth={2.5} fill="url(#enrollGrad)" name="Enrolled (cumulative)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SiteBars({ data }: { data: { site: string; enrolled: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.08)" horizontal={false} />
        <XAxis type="number" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="site" width={110} stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="target" fill="rgba(245,158,11,0.25)" radius={[0, 4, 4, 0]} name="Target" barSize={7} />
        <Bar dataKey="enrolled" fill="#10b981" radius={[0, 4, 4, 0]} name="Enrolled" barSize={7} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["#10b981", "#f59e0b", "#38bdf8", "#8b5cf6"];

export function PrakritiDonut({ data }: { data: { prakriti: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie data={data} dataKey="count" nameKey="prakriti" innerRadius={56} outerRadius={82} paddingAngle={3} strokeWidth={0}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AeBars({ data }: { data: { week: string; nonSerious: number; serious: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
        <XAxis dataKey="week" stroke="#475569" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="nonSerious" stackId="a" fill="#38bdf8" name="Non-serious" radius={[0, 0, 0, 0]} barSize={26} />
        <Bar dataKey="serious" stackId="a" fill="#ef4444" name="Serious" radius={[4, 4, 0, 0]} barSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
