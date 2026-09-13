"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function BudgetChart({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];
  
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

  const currencySymbol = parsedData[0]?.currency || "$";

  return (
    <div className="w-full flex flex-col items-center mt-6 mb-4">
      {/* Total Display with more breathing room */}
      <div className="text-center mb-8">
        <span className="text-xs text-neutral-500 font-bold uppercase tracking-widest mb-1 block">Estimated Total</span>
        <div className="text-4xl font-black text-emerald-500 dark:text-emerald-400 drop-shadow-sm">
          {currencySymbol}{total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </div>
      </div>
      
      {/* Chart Container - taller to prevent cramped legends */}
      <div className="w-full h-80 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={parsedData}
              cx="50%"
              cy="45%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="estimatedCost"
              nameKey="category"
            >
              {parsedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `${currencySymbol}${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255,255,255,0.95)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              wrapperStyle={{ fontSize: '13px', paddingTop: '30px', paddingBottom: '10px', lineHeight: '28px' }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}