import React, { useState } from 'react';
import { 
  Users, Heart, Trophy, MessageSquare, Dices, 
  Copy, Check, Shield, Sun, Moon, MousePointer2, ExternalLink 
} from 'lucide-react';

interface SidebarProps {
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

export const Sidebar: React.FC<SidebarProps> = ({
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
  const [copiedContact, setCopiedContact] = useState(false);

  const handleCopyContact = () => {
    navigator.clipboard.writeText('ocean.sanctuary.art@gmail.com');
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 flex flex-col justify-between py-6 px-4 sm:px-5 border-r border-[#d8eaf8] dark:border-[#192b45] bg-[#ebf4fb]/80 dark:bg-[#0b1523]/80 backdrop-blur-md min-h-screen">
      {/* Top Brand Section */}
      <div className="space-y-5">
        {/* Logo Title */}
        <div className="text-center sm:text-left">
          <div
            onClick={() => setCurrentTab('all')}
            className="cursor-pointer inline-flex items-center gap-1 group"
          >
            <h1 className="font-['Caveat',cursive] text-4xl sm:text-5xl font-bold tracking-tight text-slate-800 dark:text-sky-100 group-hover:text-[#3874cb] transition-colors">
              OceanArt<span className="text-[#3874cb] text-3xl">✦</span>
            </h1>
          </div>

          {/* Sub pill badge matching "DIGITAL ILLUSTRATOR" */}
          <div className="mt-1">
            <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#508bd6] dark:text-sky-300 border border-[#b8d6f4] dark:border-[#203a5c] bg-white/70 dark:bg-[#122238]/70">
              HỒ SƠ NHÂN VẬT • BIỂN MỘNG MƠ
            </span>
          </div>

          {/* 3 Cute Blue Glass Hearts matching reference screenshot */}
          <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-3 text-lg select-none">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🩵</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>💙</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🩵</span>
          </div>

          {/* Status pill with green dot matching screenshot "● 约稿关闭" */}
          <div className="mt-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#132238] border border-[#d2e6f7] dark:border-[#223b5d] text-slate-600 dark:text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Đang mở cửa khám phá •</span>
            </div>
          </div>
        </div>

        {/* Navigation Menu in rounded container */}
        <nav className="p-1.5 rounded-2xl bg-white/80 dark:bg-[#122238]/80 border border-[#d6e7f7] dark:border-[#1e3556] shadow-sm space-y-1 text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('all')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              currentTab === 'all'
                ? 'bg-white dark:bg-[#1b2f4c] text-[#3874cb] dark:text-sky-300 font-bold shadow-[0_2px_8px_rgba(56,116,203,0.12)] border border-[#cbe0f8] dark:border-[#2c4c78]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#3874cb] hover:bg-sky-50/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${currentTab === 'all' ? 'bg-[#3874cb]' : 'bg-transparent'}`}></span>
              Tất Cả Hồ Sơ
            </span>
            <Users className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              currentTab === 'favorites'
                ? 'bg-white dark:bg-[#1b2f4c] text-rose-500 font-bold shadow-[0_2px_8px_rgba(244,63,94,0.12)] border border-rose-200 dark:border-rose-900/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${currentTab === 'favorites' ? 'bg-rose-500' : 'bg-transparent'}`}></span>
              Mục Yêu Thích
            </span>
            {favoritesCount > 0 ? (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {favoritesCount}
              </span>
            ) : (
              <Heart className="w-3.5 h-3.5 opacity-60" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              currentTab === 'leaderboard'
                ? 'bg-white dark:bg-[#1b2f4c] text-amber-500 font-bold shadow-[0_2px_8px_rgba(245,158,11,0.12)] border border-amber-200 dark:border-amber-900/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-50/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${currentTab === 'leaderboard' ? 'bg-amber-500' : 'bg-transparent'}`}></span>
              Bảng Xếp Hạng
            </span>
            <Trophy className="w-3.5 h-3.5 opacity-60" />
          </button>

          <button
            onClick={() => setCurrentTab('forum')}
            className={`w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
              currentTab === 'forum'
                ? 'bg-white dark:bg-[#1b2f4c] text-[#3874cb] dark:text-sky-300 font-bold shadow-[0_2px_8px_rgba(56,116,203,0.12)] border border-[#cbe0f8] dark:border-[#2c4c78]'
                : 'text-slate-600 dark:text-slate-400 hover:text-[#3874cb] hover:bg-sky-50/50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${currentTab === 'forum' ? 'bg-[#3874cb]' : 'bg-transparent'}`}></span>
              Diễn Đàn Đại Dương
            </span>
            <MessageSquare className="w-3.5 h-3.5 opacity-60" />
          </button>

          {/* Gacha random button in menu */}
          <button
            onClick={onOpenRandom}
            className="w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-amber-500 hover:bg-amber-50/40 dark:hover:bg-slate-800/50 transition-all"
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-transparent"></span>
              Nhân Vật Hôm Nay 🎲
            </span>
            <Dices className="w-3.5 h-3.5 text-amber-500" />
          </button>
        </nav>
      </div>

      {/* Middle / Quick Controls (Theme, Cursor, Admin) */}
      <div className="my-5 p-2 rounded-2xl bg-white/70 dark:bg-[#122238]/70 border border-[#d6e7f7] dark:border-[#1e3556] flex items-center justify-around text-xs">
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-sky-100/60 dark:hover:bg-slate-800 transition"
          title={isDark ? 'Chuyển sang chế độ Sáng' : 'Chuyển sang chế độ Tối'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#3874cb]" />}
        </button>

        {/* Cursor toggle */}
        <button
          onClick={toggleCustomCursor}
          className={`p-2 rounded-xl transition ${
            isCustomCursor
              ? 'text-[#3874cb] bg-sky-100/60 dark:bg-slate-800 font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
          title={isCustomCursor ? 'Tắt con trỏ sao biển' : 'Bật con trỏ sao biển'}
        >
          <MousePointer2 className="w-4 h-4" />
        </button>

        {/* Admin control */}
        <button
          onClick={onOpenAdmin}
          className={`p-2 rounded-xl transition ${
            isAdmin
              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 font-bold'
              : 'text-slate-500 hover:text-[#3874cb] hover:bg-sky-50 dark:hover:bg-slate-800'
          }`}
          title="Bảng Quản Trị Admin (Ctrl + Shift + A)"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Section: DIRECT CONTACT & PLATFORMS matching reference screenshot */}
      <div className="space-y-4 pt-2 border-t border-[#d8eaf8] dark:border-[#192b45]">
        {/* Direct Contact Pill */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
            DIRECT CONTACT
          </span>
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white dark:bg-[#122238] border border-[#d2e6f7] dark:border-[#203959] text-xs shadow-sm">
            <span className="truncate max-w-[140px] text-[11px] text-slate-600 dark:text-slate-300 font-mono">
              ocean.art@gmail.com
            </span>
            <button
              onClick={handleCopyContact}
              className="text-[10px] font-bold text-[#3874cb] hover:underline flex items-center gap-0.5 ml-1 shrink-0"
            >
              {copiedContact ? <Check className="w-3 h-3 text-emerald-500" /> : 'Copy'}
            </button>
          </div>
        </div>

        {/* Platforms (4 rounded square tiles matching reference screenshot) */}
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
            PLATFORMS
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#122238] border border-[#d2e6f7] dark:border-[#203959] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-[#3874cb] hover:text-[#3874cb] transition-colors shadow-sm"
              title="Twitter / X"
            >
              𝕏
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#122238] border border-[#d2e6f7] dark:border-[#203959] flex items-center justify-center text-xs font-bold text-indigo-500 hover:border-indigo-400 transition-colors shadow-sm"
              title="Discord"
            >
              D
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#122238] border border-[#d2e6f7] dark:border-[#203959] flex items-center justify-center text-xs font-bold text-blue-600 hover:border-blue-400 transition-colors shadow-sm"
              title="Facebook"
            >
              f
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-xl bg-white dark:bg-[#122238] border border-[#d2e6f7] dark:border-[#203959] flex items-center justify-center text-xs font-bold text-rose-500 hover:border-rose-400 transition-colors shadow-sm"
              title="TikTok"
            >
              小
            </a>
          </div>
        </div>

        {/* Cute subtle doodles matching "+ 🐰 ✦" in screenshot */}
        <div className="flex items-center justify-center gap-3 text-slate-400 text-xs py-1 select-none">
          <span>✦</span>
          <span>🫧</span>
          <span>🐬</span>
          <span>✦</span>
        </div>

        {/* Copyright */}
        <div className="text-center text-[10px] text-slate-400">
          © 2026 OceanArt • All rights reserved ✦
        </div>
      </div>
    </aside>
  );
};
