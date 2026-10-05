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

const customTooltipStyle = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #C9C2B2",
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "12px",
  boxShadow: "0 4px 12px rgba(28, 42, 33, 0.08)",
  color: "#1C2A21",
  fontFamily: "var(--font-dmsans), sans-serif",
};

export function EnrollmentTrend({ data }: { data: { month: string; enrolled: number; target: number }[] }) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[11px] text-[#4A5A4F]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#2D5A3D]" /> Enrolled Participants
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#B98A2F]" /> Target Trajectory
          </span>
        </div>
        <span className="font-mono2 text-[10.5px] text-[#7A887D]">Monthly Cumulative</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 12, right: 12, left: -14, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5A3D" stopOpacity={0.35} />
              <stop offset="60%" stopColor="#2D5A3D" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#2D5A3D" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B98A2F" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#B98A2F" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(28,42,33,0.06)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={{ stroke: "#E3DED4" }} />
          <YAxis stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={customTooltipStyle}
            formatter={(value: unknown, name: unknown) => [`${String(value)} participants`, String(name)]}
          />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#B98A2F"
            strokeDasharray="4 4"
            strokeWidth={1.8}
            fill="url(#targetGrad)"
            name="Target"
          />
          <Area
            type="monotone"
            dataKey="enrolled"
            stroke="#2D5A3D"
            strokeWidth={2.8}
            fill="url(#enrollGrad)"
            name="Enrolled"
            activeDot={{ r: 5, fill: "#2D5A3D", stroke: "#FFFFFF", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SiteBars({ data }: { data: { site: string; enrolled: number; target: number }[] }) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-[11px] text-[#4A5A4F]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#2D5A3D]" /> Active Recruitment
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#E3DED4]" /> Target Quota
          </span>
        </div>
        <span className="font-mono2 text-[10.5px] text-[#7A887D]">Across 8 Certified Sites</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(28,42,33,0.06)" horizontal={false} />
          <XAxis type="number" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="site"
            width={120}
            stroke="#4A5A4F"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={customTooltipStyle} />
          <Bar dataKey="target" fill="#E3DED4" radius={[0, 4, 4, 0]} name="Target" barSize={9} />
          <Bar dataKey="enrolled" fill="#2D5A3D" radius={[0, 4, 4, 0]} name="Enrolled" barSize={9} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_COLORS = ["#2D5A3D", "#B98A2F", "#3E6B8C", "#6B5A8C"];

export function PrakritiDonut({ data }: { data: { prakriti: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="prakriti"
          innerRadius={56}
          outerRadius={82}
          paddingAngle={3}
          strokeWidth={2}
          stroke="#FAF9F6"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={customTooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AeBars({ data }: { data: { week: string; nonSerious: number; serious: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
        <CartesianGrid stroke="rgba(28,42,33,0.06)" vertical={false} />
        <XAxis dataKey="week" stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis stroke="#7A887D" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={customTooltipStyle} />
        <Bar dataKey="nonSerious" stackId="a" fill="#3E6B8C" name="Non-serious" radius={[0, 0, 0, 0]} barSize={24} />
        <Bar dataKey="serious" stackId="a" fill="#A44A2A" name="Serious (SAE)" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
