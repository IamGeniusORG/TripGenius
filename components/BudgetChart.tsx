"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function BudgetChart({ data }: { data: any[] }) {
  if (!data || !Array.isArray(data) || data.length === 0) return null;

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#06b6d4'];
  
  // Robust parsing: Extract numbers and find currency symbol
  const parsedData = data.map((item, index) => {
    const rawValue = item.estimatedCost || item.cost || item.amount || item.price || item.value || 0;
    
    let numericValue = typeof rawValue === "number" ? rawValue : 0;
    if (typeof rawValue === "string") {
      const stripped = rawValue.replace(/[^0-9.]/g, '');
      numericValue = parseFloat(stripped) || 0;
    }
    
    return {
      category: item.category || item.name || "Other",
      estimatedCost: numericValue,
      currency: item.currency || "$",
      color: COLORS[index % COLORS.length]
    };
  }).filter(item => item.estimatedCost > 0);

  const total = parsedData.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  if (total === 0) return null;

  const currencySymbol = parsedData[0]?.currency || "$";
  const formattedTotal = total.toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sleek Total Display */}
      <div className="text-center mb-6 w-full pb-6 border-b border-neutral-100 dark:border-white/5">
        <span className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-[0.2em] mb-2 block">
          Estimated Total
        </span>
        <div className="text-4xl sm:text-5xl font-black text-emerald-500 dark:text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          {currencySymbol}{formattedTotal}
        </div>
      </div>
      
      {/* Chart Section */}
      <div className="w-full h-56 relative mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={parsedData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="estimatedCost"
              nameKey="category"
            >
              {parsedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="rgba(0,0,0,0.1)" 
                  strokeWidth={1} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: any) => `${currencySymbol}${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              contentStyle={{ 
                borderRadius: '16px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1)', 
                backgroundColor: 'rgba(255,255,255,0.95)',
                color: '#171717',
                fontWeight: '600'
              }}
              itemStyle={{ color: '#171717' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Clean Legend */}
      <div className="w-full max-w-sm space-y-3 px-2">
        {parsedData.map((entry, index) => (
          <div key={index} className="flex justify-between items-center group">
            <div className="flex items-center space-x-3 overflow-hidden">
              <span 
                className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-semibold text-sm text-neutral-700 dark:text-neutral-200 truncate pr-4 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                {entry.category}
              </span>
            </div>
            <div className="font-medium text-sm text-neutral-500 dark:text-neutral-400 shrink-0 tabular-nums">
              {currencySymbol}{entry.estimatedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}