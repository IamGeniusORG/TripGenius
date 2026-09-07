"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: { category: string, estimatedCost: number }[] }) {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const total = data.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="w-full h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="estimatedCost"
            nameKey="category"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `${Number(value).toLocaleString()}`}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Estimated Total</span>
        <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100">${total.toLocaleString()}</div>
      </div>
    </div>
  );
}