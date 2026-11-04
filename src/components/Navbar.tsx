import React from 'react';
import { 
  Sparkles, Heart, Sun, Moon, Shield, Dices, 
  Users, MessageSquare, Trophy, MousePointer2 
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'all' | 'favorites' | 'forum' | 'leaderboard';
  setCurrentTab: (tab: 'all' | 'favorites' | 'forum' | 'leaderboard') => void;
  favoritesCount: number;
  onOpenRandom: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
  isDark: boolean;
  toggleDark: () => void;
  isCustomCursor: boolean;
  toggleCustomCursor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  favoritesCount,
  onOpenRandom,
  onOpenAdmin,
  isAdmin,
  isDark,
  toggleDark,
  isCustomCursor,
  toggleCustomCursor
}) => {
  return (
    <header className="sticky top-0 z-30 transition-colors duration-300 backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-b border-sky-100 dark:border-cyan-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('all')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <span className="text-xl sm:text-2xl animate-sway-slow">🐬</span>
            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-300 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-cyan-950 dark:text-cyan-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Biển Mộng Mơ
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border border-cyan-300/40">
                Ocean OC
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block">
              Hải trình khám phá nhân vật mộng mơ
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-sky-100/60 dark:bg-slate-900/80 border border-sky-200/50 dark:border-cyan-800/40 text-xs font-bold">
          <button
            onClick={() => setCurrentTab('all')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
              currentTab === 'all'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Tất Cả Hồ Sơ
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
              currentTab === 'favorites'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-current' : ''}`} />
            Yêu Thích
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white text-rose-500 font-extrabold ml-0.5">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
              currentTab === 'leaderboard'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-amber-500'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Bảng Xếp Hạng
          </button>

          <button
            onClick={() => setCurrentTab('forum')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition ${
              currentTab === 'forum'
                ? 'bg-cyan-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Diễn Đàn
          </button>
        </nav>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Random Character / Gacha Button */}
          <button
            onClick={onOpenRandom}
            className="px-3 sm:px-3.5 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-white font-bold text-xs shadow-md shadow-amber-400/20 transition active:scale-95 flex items-center gap-1.5"
            title="Quay nhân vật hôm nay"
          >
            <Dices className="w-4 h-4" />
            <span className="hidden sm:inline">Hôm Nay</span>
          </button>

          {/* Toggle Custom Cute Ocean Cursor */}
          <button
            onClick={toggleCustomCursor}
            className={`p-2 rounded-2xl transition ${
              isCustomCursor
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-400/30'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-cyan-300'
            }`}
            title={isCustomCursor ? 'Tắt con trỏ sao biển' : 'Bật con trỏ sao biển đáng yêu'}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            className="p-2 sm:p-2.5 rounded-2xl bg-sky-100/80 dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 hover:scale-105 transition active:scale-90"
            title={isDark ? 'Chuyển sang chế độ Sáng (Ban ngày biển)' : 'Chuyển sang chế độ Tối (Đêm biển sâu)'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-sky-600" />}
          </button>

          {/* Admin Control Button */}
          <button
            onClick={onOpenAdmin}
            className={`p-2 sm:p-2.5 rounded-2xl transition ${
              isAdmin
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-300'
            }`}
            title="Bảng Quản Trị Admin (Ctrl+Shift+A)"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation bar */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 border-t border-sky-100 dark:border-cyan-900/40 text-xs font-bold">
        <button
          onClick={() => setCurrentTab('all')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 ${
            currentTab === 'all' ? 'bg-cyan-500 text-white' : 'text-slate-500'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> Hồ Sơ
        </button>

        <button
          onClick={() => setCurrentTab('favorites')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 ${
            currentTab === 'favorites' ? 'bg-rose-500 text-white' : 'text-slate-500'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> Yêu Thích ({favoritesCount})
        </button>

        <button
          onClick={() => setCurrentTab('leaderboard')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 ${
            currentTab === 'leaderboard' ? 'bg-amber-500 text-white' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> Top Hot
        </button>

        <button
          onClick={() => setCurrentTab('forum')}
          className={`px-3 py-1.5 rounded-xl flex items-center gap-1 ${
            currentTab === 'forum' ? 'bg-cyan-500 text-white' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Diễn Đàn
        </button>
      </div>
    </header>
  );
};
