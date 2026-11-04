import React, { useState } from 'react';
import { Bell, Sparkles, X, ChevronRight } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementBannerProps {
  announcements: Announcement[];
  isDark: boolean;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  announcements,
  isDark
}) => {
  const activeList = announcements.filter(a => a.active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  if (activeList.length === 0 || isDismissed) return null;

  const current = activeList[currentIndex] || activeList[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeList.length);
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 pb-1">
      <div
        className={`relative overflow-hidden rounded-2xl p-3 sm:px-5 flex items-center justify-between gap-3 text-xs sm:text-sm border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-sky-950/80 via-cyan-950/90 to-indigo-950/80 border-cyan-500/30 text-cyan-100 shadow-md shadow-cyan-950/40'
            : 'bg-gradient-to-r from-sky-100/90 via-cyan-50 to-indigo-50 border-sky-200 text-cyan-950 shadow-sm'
        } backdrop-blur-md`}
      >
        <div className="flex items-center gap-2.5 flex-1 overflow-hidden">
          <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-500 shrink-0">
            <Bell className="w-4 h-4 animate-bounce" />
          </span>

          <div className="truncate">
            <span className="font-bold mr-2 text-cyan-600 dark:text-cyan-300">
              [{current.title}]
            </span>
            <span className="opacity-90">{current.content}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {activeList.length > 1 && (
            <button
              onClick={handleNext}
              className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5 px-2 py-0.5 rounded-lg hover:bg-cyan-500/10"
              title="Thông báo kế tiếp"
            >
              Tiếp theo ({currentIndex + 1}/{activeList.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-cyan-200 transition"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
