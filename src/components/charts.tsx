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
  backgroundColor: "#FFFFFF",
  border: "1px solid #E3DED4",
  borderRadius: "6px",
  fontSize: "11.5px",
  color: "#1C2A21",
  fontFamily: "var(--font-jbmono), monospace",
};

export function EnrollmentTrend({ data }: { data: { month: string; enrolled: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2D5A3D" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#2D5A3D" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(28,42,33,0.08)" vertical={false} />
        <XAxis dataKey="month" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="target" stroke="#B98A2F" strokeDasharray="5 4" strokeWidth={1.5} fill="none" name="Target (cumulative)" />
        <Area type="monotone" dataKey="enrolled" stroke="#2D5A3D" strokeWidth={2.5} fill="url(#enrollGrad)" name="Enrolled (cumulative)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SiteBars({ data }: { data: { site: string; enrolled: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="rgba(28,42,33,0.08)" horizontal={false} />
        <XAxis type="number" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="site" width={110} stroke="#4A5A4F" fontSize={11} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="target" fill="rgba(185,138,47,0.3)" radius={[0, 4, 4, 0]} name="Target" barSize={7} />
        <Bar dataKey="enrolled" fill="#2D5A3D" radius={[0, 4, 4, 0]} name="Enrolled" barSize={7} />
      </BarChart>
    </ResponsiveContainer>
  );
}

const PIE_COLORS = ["#2D5A3D", "#B98A2F", "#3E6B8C", "#6B5A8C"];

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
        <CartesianGrid stroke="rgba(28,42,33,0.08)" vertical={false} />
        <XAxis dataKey="week" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="nonSerious" stackId="a" fill="#3E6B8C" name="Non-serious" radius={[0, 0, 0, 0]} barSize={26} />
        <Bar dataKey="serious" stackId="a" fill="#A44A2A" name="Serious" radius={[4, 4, 0, 0]} barSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}
