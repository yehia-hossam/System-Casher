"use client";
const categories = ["الكل", "أسماك", "شوربات", "طواجن", "مقبلات", "مشروبات"];

export default function CategoryBar() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((cat, i) => (
        <button 
          key={i} 
          className={`px-8 py-3 rounded-2xl font-bold whitespace-nowrap transition-all duration-300 ${i === 0 ? 'bg-[#0e4b5e] text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-500 hover:shadow-md border border-transparent hover:border-slate-100'}`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}