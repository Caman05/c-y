import React, { useState } from 'react';
import { Search, Filter, X, Sparkles, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  availableTags: string[];
  sortBy: 'newest' | 'clicks' | 'favorites' | 'name';
  setSortBy: (sort: 'newest' | 'clicks' | 'favorites' | 'name') => void;
  filterType: 'all' | 'new' | 'private' | 'public';
  setFilterType: (filter: 'all' | 'new' | 'private' | 'public') => void;
  totalCount: number;
  filteredCount: number;
  isDark: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  availableTags,
  sortBy,
  setSortBy,
  filterType,
  setFilterType,
  totalCount,
  filteredCount,
  isDark
}) => {
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);

  return (
    <div className="space-y-3 mb-6">
      {/* Horizontal Tag Filter Pills directly matching the reference screenshot! */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Main visible pill row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* "Tất cả" (matching 全部) */}
          <button
            onClick={() => {
              setSelectedTag(null);
              setFilterType('all');
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              selectedTag === null && filterType === 'all'
                ? 'bg-[#3f7ccb] text-white shadow-[#3f7ccb]/20 scale-105'
                : 'bg-white dark:bg-[#122238] text-slate-600 dark:text-slate-300 border border-[#d6e7f7] dark:border-[#1e3556] hover:bg-sky-50 dark:hover:bg-slate-800'
            }`}
          >
            Tất cả
          </button>

          {/* Quick filter pills */}
          <button
            onClick={() => {
              setSelectedTag(null);
              setFilterType('new');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-1 ${
              filterType === 'new'
                ? 'bg-[#0d9488] text-white shadow-teal-500/20 scale-105'
                : 'bg-white dark:bg-[#122238] text-slate-600 dark:text-slate-300 border border-[#d6e7f7] dark:border-[#1e3556] hover:bg-teal-50/50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" /> Mới ra
          </button>

          {/* Key tags like Biển Sâu, Mỹ Nhân Ngư, Kỳ Ảo, Yandere matching illustration categories */}
          {availableTags.slice(0, 5).map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setSelectedTag(isSelected ? null : tag);
                  setFilterType('all');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isSelected
                    ? 'bg-[#3f7ccb] text-white shadow-[#3f7ccb]/20 scale-105'
                    : 'bg-white dark:bg-[#122238] text-slate-600 dark:text-slate-300 border border-[#d6e7f7] dark:border-[#1e3556] hover:bg-sky-50 dark:hover:bg-slate-800'
                }`}
              >
                {tag}
              </button>
            );
          })}

          {/* More tags toggle */}
          {availableTags.length > 5 && (
            <button
              onClick={() => setIsTagFilterOpen(!isTagFilterOpen)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#3f7ccb] bg-sky-50 dark:bg-slate-800/80 border border-sky-200/60 flex items-center gap-1"
            >
              <span>+{availableTags.length - 5} thẻ khác</span>
              {isTagFilterOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Right Sort & Search Box */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm nhân vật..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 rounded-xl text-xs bg-white dark:bg-[#122238] text-slate-800 dark:text-sky-100 placeholder:text-slate-400 border border-[#d6e7f7] dark:border-[#1e3556] focus:outline-none focus:border-[#3f7ccb]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl text-xs bg-white dark:bg-[#122238] text-slate-700 dark:text-slate-300 border border-[#d6e7f7] dark:border-[#1e3556] focus:outline-none focus:border-[#3f7ccb] cursor-pointer"
          >
            <option value="newest">Mới nhất</option>
            <option value="clicks">🔥 Hot nhất</option>
            <option value="favorites">💖 Thích nhất</option>
            <option value="name">Tên A-Z</option>
          </select>
        </div>
      </div>

      {/* Expanded tags container if toggle is active */}
      {isTagFilterOpen && (
        <div className="p-3 rounded-2xl bg-white/90 dark:bg-[#122238]/90 border border-[#d6e7f7] dark:border-[#1e3556] shadow-sm flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? null : tag)}
                className={`text-xs px-3 py-1 rounded-xl font-medium transition ${
                  isSelected
                    ? 'bg-[#3f7ccb] text-white'
                    : 'bg-[#f0f6fc] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-100'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
