"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export default function InteractivePackingList({ items, tripId }: { items: any[], tripId: string }) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
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

  const toggleItem = (itemKey: string) => {
    const newChecked = { ...checkedItems, [itemKey]: !checkedItems[itemKey] };
    setCheckedItems(newChecked);
    localStorage.setItem(`packing-${tripId}`, JSON.stringify(newChecked));
  };

  if (!isLoaded || !items || items.length === 0) return null;

  // Normalize data to handle both legacy string[] and new categorized { category, items }[]
  let isCategorized = false;
  if (typeof items[0] === 'object' && items[0].category) {
    isCategorized = true;
  }

  // Calculate total progress
  let totalItemsCount = 0;
  let packedItemsCount = 0;

  if (isCategorized) {
    items.forEach(cat => {
      if (Array.isArray(cat.items)) {
        cat.items.forEach((item: string) => {
          totalItemsCount++;
          if (checkedItems[item]) packedItemsCount++;
        });
      }
    });
  } else {
    totalItemsCount = items.length;
    items.forEach((item: string) => {
      if (checkedItems[item]) packedItemsCount++;
    });
  }

  const allChecked = totalItemsCount > 0 && packedItemsCount === totalItemsCount;
  const progressPercent = totalItemsCount > 0 ? (packedItemsCount / totalItemsCount) * 100 : 0;

  const renderItem = (item: string) => {
    const isChecked = !!checkedItems[item];
    return (
      <li 
        key={item} 
        onClick={() => toggleItem(item)}
        className={`group flex items-start text-sm p-3.5 mb-2 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isChecked 
            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/50 text-neutral-400 dark:text-neutral-500' 
            : 'bg-white dark:bg-neutral-900/50 border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-200 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/50 hover:-translate-y-0.5'
        }`}
      >
        <div className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center mr-3.5 border transition-all duration-300 ${
          isChecked 
            ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-sm shadow-emerald-500/30' 
            : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 group-hover:border-blue-400 dark:group-hover:border-blue-500'
        }`}>
          {isChecked && <Check className="w-3.5 h-3.5" />}
        </div>
        <span 
          className={`leading-relaxed transition-all duration-300 ${isChecked ? 'line-through opacity-70' : ''}`} 
          dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white">$1</strong>') }} 
        />
      </li>
    );
  };

  return (
    <div className="w-full">
      {/* Progress Header */}
      <div className="flex flex-col mb-6 space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {packedItemsCount} / {totalItemsCount} Packed
          </span>
          {allChecked && <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full shadow-sm animate-pulse">Ready to go!</span>}
        </div>
        {/* Progress Bar */}
        <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
           <div 
             className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-1000 ease-out rounded-full"
             style={{ width: `${progressPercent}%` }}
           />
        </div>
      </div>

      {/* Render Lists */}
      <div className="space-y-6">
        {isCategorized ? (
          items.map((cat, i) => (
            <div key={i} className="space-y-3">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">{cat.category}</h4>
              <ul className="space-y-0">
                {cat.items?.map((item: string) => renderItem(item))}
              </ul>
            </div>
          ))
        ) : (
          <ul className="space-y-0">
            {items.map((item: string) => renderItem(item))}
          </ul>
        )}
      </div>
    </div>
  );
}