"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];
  
  // Robust parsing: AI might return "cost", "amount", "price", "estimatedCost", and might be a string with "$".
  const parsedData = data.map(item => {
    const rawValue = item.estimatedCost || item.cost || item.amount || item.price || item.value || 0;
    
    // If it's a string like "$1,000", parse it into a number
    let numericValue = typeof rawValue === "number" ? rawValue : 0;
    if (typeof rawValue === "string") {
      const stripped = rawValue.replace(/[^0-9.]/g, '');
      numericValue = parseFloat(stripped) || 0;
    }
    
    return {
      category: item.category || item.name || "Other",
      estimatedCost: numericValue
    };
  }).filter(item => item.estimatedCost > 0);

  const total = parsedData.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  if (total === 0) return null;

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div className="text-center mb-2">
        <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Estimated Total</span>
        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
      </div>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={parsedData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={5}
              dataKey="estimatedCost"
              nameKey="category"
            >
              {parsedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
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