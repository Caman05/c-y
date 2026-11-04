import React from 'react';
import { Sparkles, Music, ExternalLink, Users } from 'lucide-react';
import { SiteStats } from '../types';

interface TopStatusCardsProps {
  totalCharacters: number;
  totalClicks: number;
  currentSongTitle: string;
  isDark: boolean;
}

export const TopStatusCards: React.FC<TopStatusCardsProps> = ({
  totalCharacters,
  totalClicks,
  currentSongTitle,
  isDark
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
      {/* Card 1: Status */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#122238] border-[#1e3452] shadow-[0_8px_25px_rgba(0,0,0,0.3)]'
            : 'bg-white border-[#dcecf8] shadow-[0_8px_25px_rgba(180,212,238,0.35)]'
        }`}
      >
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Trạng thái web</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-black text-slate-800 dark:text-sky-100 flex items-center gap-2">
          <span>Khám Phá</span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800 dark:bg-sky-100"></span>
        </div>
      </div>

      {/* Card 2: Total Characters */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#122238] border-[#1e3452] shadow-[0_8px_25px_rgba(0,0,0,0.3)]'
            : 'bg-white border-[#dcecf8] shadow-[0_8px_25px_rgba(180,212,238,0.35)]'
        }`}
      >
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Tổng nhân vật</span>
          <Users className="w-3.5 h-3.5 text-[#3874cb] opacity-60" />
        </div>
        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-black text-slate-800 dark:text-sky-100">
          {totalCharacters} <span className="text-sm font-semibold text-slate-400">hồ sơ</span>
        </div>
      </div>

      {/* Card 3: Interaction / Clicks */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#122238] border-[#1e3452] shadow-[0_8px_25px_rgba(0,0,0,0.3)]'
            : 'bg-white border-[#dcecf8] shadow-[0_8px_25px_rgba(180,212,238,0.35)]'
        }`}
      >
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Lượt mở trò chuyện</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-500 opacity-60" />
        </div>
        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-xl sm:text-2xl font-black text-slate-800 dark:text-sky-100">
          {totalClicks > 0 ? `${totalClicks} lượt` : 'Sôi nổi ✨'}
        </div>
      </div>

      {/* Card 4: Ambient Music */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-[#122238] border-[#1e3452] shadow-[0_8px_25px_rgba(0,0,0,0.3)]'
            : 'bg-white border-[#dcecf8] shadow-[0_8px_25px_rgba(180,212,238,0.35)]'
        }`}
      >
        <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Giai điệu biển</span>
          <Music className="w-3.5 h-3.5 text-[#3874cb] opacity-70 animate-pulse" />
        </div>
        <div className="font-['Plus_Jakarta_Sans',sans-serif] text-base sm:text-lg font-bold text-slate-800 dark:text-sky-100 truncate">
          {currentSongTitle || 'Ocean Lofi 🫧'}
        </div>
      </div>
    </div>
  );
};
