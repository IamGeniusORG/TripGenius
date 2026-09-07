"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function InteractivePackingList({ items, tripId }: { items: string[], tripId: string }) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const saved = localStorage.getItem(`packing-${tripId}`);
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, [tripId]);

  const toggleItem = (index: number) => {
    const newChecked = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newChecked);
    localStorage.setItem(`packing-${tripId}`, JSON.stringify(newChecked));
  };

  if (!isLoaded) return null; // Hydration protection

  const allChecked = items.length > 0 && items.every((_, i) => checkedItems[i]);

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          {Object.values(checkedItems).filter(Boolean).length} / {items.length} Packed
        </span>
        {allChecked && <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">Ready to go!</span>}
      </div>
      <ul className="space-y-2">
        {items.map((item, index) => {
          const isChecked = !!checkedItems[index];
          return (
            <li 
              key={index} 
              onClick={() => toggleItem(index)}
              className={`flex items-start text-sm p-3 rounded-xl border transition-all cursor-pointer ${
                isChecked 
                  ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-zinc-400 dark:text-zinc-500 line-through' 
                  : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 shadow-sm'
              }`}
            >
              <div className={`mt-0.5 shrink-0 w-4 h-4 rounded flex items-center justify-center mr-3 border transition-colors ${
                isChecked 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-600'
              }`}>
                {isChecked && <Check className="w-3 h-3" />}
              </div>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}