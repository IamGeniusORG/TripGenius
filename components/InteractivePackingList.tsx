"use client";

export default function InteractivePackingList({ items }: { items: any[], tripId?: string }) {
  if (!items || items.length === 0) return null;

  let isCategorized = false;
  if (typeof items[0] === 'object' && items[0].category) {
    isCategorized = true;
  }

  const renderItem = (item: string, idx: number) => (
    <li 
      key={idx} 
      className="flex items-start text-sm py-1.5 text-neutral-600 dark:text-neutral-300 leading-relaxed"
    >
      <span className="text-blue-400 mr-2.5 font-bold shrink-0 text-lg leading-none">•</span>
      <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white">$1</strong>') }} />
    </li>
  );

  return (
    <div className="w-full">
      <div className="space-y-6 mt-2">
        {isCategorized ? (
          items.map((cat, i) => (
            <div key={i} className="space-y-2">
              <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 tracking-tight">{cat.category}</h4>
              <ul className="space-y-1">
                {cat.items?.map((item: string, idx: number) => renderItem(item, idx))}
              </ul>
            </div>
          ))
        ) : (
          <ul className="space-y-1">
            {items.map((item: string, idx: number) => renderItem(item, idx))}
          </ul>
        )}
      </div>
    </div>
  );
}