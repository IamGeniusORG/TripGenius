"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];
  
  // Robust parsing: Extract numbers and find currency symbol
  const parsedData = data.map(item => {
    const rawValue = item.estimatedCost || item.cost || item.amount || item.price || item.value || 0;
    
    let numericValue = typeof rawValue === "number" ? rawValue : 0;
    if (typeof rawValue === "string") {
      const stripped = rawValue.replace(/[^0-9.]/g, '');
      numericValue = parseFloat(stripped) || 0;
    }
    
    return {
      category: item.category || item.name || "Other",
      estimatedCost: numericValue,
      currency: item.currency || "$"
    };
  }).filter(item => item.estimatedCost > 0);

  const total = parsedData.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  if (total === 0) return null;

  // Determine primary currency from the first valid item
  const currencySymbol = parsedData[0]?.currency || "$";

  return (
    <div className="w-full flex flex-col items-center mt-2">
      <div className="text-center mb-2">
        <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Estimated Total</span>
        <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
          {currencySymbol}{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
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
              formatter={(value: any) => `${currencySymbol}${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1)' }}
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