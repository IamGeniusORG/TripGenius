"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: { category: string, estimatedCost: number }[] }) {
  if (!data || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const total = data.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div className="text-center mb-2">
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Estimated Total</span>
        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">${total.toLocaleString()}</div>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={5}
              dataKey="estimatedCost"
              nameKey="category"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `$${Number(value).toLocaleString()}`}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ fontSize: '13px', paddingTop: '20px', lineHeight: '24px' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}