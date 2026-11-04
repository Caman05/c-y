import React from 'react';
import { Sparkles, Heart, Shield, Globe, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  isDark: boolean;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, isDark }) => {
  return (
    <footer className="relative mt-20 pt-12 pb-24 sm:pb-16 border-t border-sky-100 dark:border-cyan-900/40 bg-gradient-to-b from-transparent via-sky-50/50 to-sky-100/60 dark:via-slate-950/40 dark:to-slate-950 overflow-hidden">
      {/* Decorative Wave Background SVG */}
      <div className="absolute top-0 left-0 right-0 h-6 opacity-40 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-12 text-cyan-500/20 fill-current"
        >
          <path d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,30 L1200,120 L0,120 Z"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-6">
        {/* Brand Vibe */}
        <div className="flex items-center gap-2">
          <span className="text-2xl animate-sway-slow">🌊</span>
          <span className="font-extrabold text-lg sm:text-xl text-cyan-950 dark:text-cyan-100">
            Biển Mộng Mơ • Ocean Characters
          </span>
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
        </div>

        <p className="max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Nơi lưu giữ những mảnh ký ức ngọt ngào từ đáy đại dương bao la. Cùng lắng nghe thanh âm của sóng biển và trò chuyện cùng các sinh linh thần kỳ.
        </p>

        {/* Social Media Links as explicitly requested */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Kết Nối & Mạng Xã Hội
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-sky-200 dark:border-cyan-800 hover:scale-105 transition-transform shadow-sm flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> Facebook
            </a>

            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-indigo-500 dark:text-indigo-400 border border-sky-200 dark:border-cyan-800 hover:scale-105 transition-transform shadow-sm flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Discord Hải Cung
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-rose-500 dark:text-rose-400 border border-sky-200 dark:border-cyan-800 hover:scale-105 transition-transform shadow-sm flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> TikTok
            </a>

            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-sky-200 dark:border-cyan-800 hover:scale-105 transition-transform shadow-sm flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5" /> Twitter / X
            </a>
          </div>
        </div>

        {/* Secret Admin Shortcut Tip & Trigger */}
        <div className="pt-4 border-t border-sky-200/40 dark:border-cyan-900/30 w-full max-w-lg flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-1">
            <span>Dành cho Admin:</span>
            <button
              onClick={onOpenAdmin}
              className="underline hover:text-cyan-500 transition font-semibold flex items-center gap-0.5"
            >
              <Shield className="w-3 h-3 inline" /> Bảng Quản Trị
            </button>
            <span className="hidden sm:inline">(Phím tắt: Ctrl + Shift + A)</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Thiết kế với tình yêu biển cả</span>
            <Heart className="w-3 h-3 text-rose-400 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
