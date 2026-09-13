"use client";

import { CheckCircle2 } from "lucide-react";

export default function InteractivePackingList({ items, tripId }: { items: any[], tripId?: string }) {
  if (!items || items.length === 0) return null;

  // Handle both legacy string[] and new categorized { category, items }[]
  let isCategorized = false;
  if (typeof items[0] === 'object' && items[0].category) {
    isCategorized = true;
  }

  const renderItem = (item: string, idx: number) => (
    <li 
      key={idx} 
      className="flex items-start text-sm p-3.5 mb-2 rounded-2xl border transition-all duration-300 bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200"
    >
      <CheckCircle2 className="w-4 h-4 mr-3 mt-0.5 text-blue-500/70 shrink-0" />
      <span 
        className="leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white">$1</strong>') }} 
      />
    </li>
  );

  return (
    <div className="w-full">
      {/* Render Lists */}
      <div className="space-y-6">
        {isCategorized ? (
          items.map((cat, i) => (
            <div key={i} className="space-y-3">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-tight ml-1">{cat.category}</h4>
              <ul className="space-y-0">
                {cat.items?.map((item: string, idx: number) => renderItem(item, idx))}
              </ul>
            </div>
          ))
        ) : (
          <ul className="space-y-0">
            {items.map((item: string, idx: number) => renderItem(item, idx))}
          </ul>
        )}
      </div>
    </div>
  );
}