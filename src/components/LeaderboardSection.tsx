import React from 'react';
import { Flame, Heart, Trophy, Sparkles, ExternalLink } from 'lucide-react';
import { Character } from '../types';
import { DEFAULT_OCEAN_AVATARS } from '../utils/helpers';

interface LeaderboardSectionProps {
  characters: Character[];
  onSelectCharacter: (char: Character) => void;
  isDark: boolean;
}

export const LeaderboardSection: React.FC<LeaderboardSectionProps> = ({
  characters,
  onSelectCharacter,
  isDark
}) => {
  // Top 3 by click count
  const topClicks = [...characters]
    .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
    .slice(0, 3);

  // Top 3 by favorite count
  const topFavorites = [...characters]
    .sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0))
    .slice(0, 3);

  const getMedalColor = (idx: number) => {
    if (idx === 0) return 'from-amber-400 to-yellow-500 text-amber-950 border-amber-300';
    if (idx === 1) return 'from-slate-200 to-slate-400 text-slate-900 border-slate-300';
    return 'from-amber-600 to-orange-700 text-amber-100 border-orange-400';
  };

  const getRankEmoji = (idx: number) => {
    if (idx === 0) return '👑';
    if (idx === 1) return '🥈';
    return '🥉';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
      {/* Top 3 Hot by Clicks */}
      <div
        className={`p-5 sm:p-6 rounded-3xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border border-amber-500/30 shadow-lg shadow-amber-950/20'
            : 'bg-white/90 border border-amber-200/70 shadow-md shadow-amber-100/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-2xl bg-amber-500/10 text-amber-500">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-cyan-950 dark:text-cyan-100 flex items-center gap-1.5">
              Top 3 Nhân Vật Hot Nhất
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dựa trên số lượt du khách nhấp vào đường link trò chuyện
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topClicks.map((char, idx) => (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-slate-800/60 hover:bg-slate-800 border border-cyan-800/40'
                  : 'bg-amber-50/50 hover:bg-amber-100/60 border border-amber-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Medal Rank */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm bg-gradient-to-tr border ${getMedalColor(
                    idx
                  )}`}
                >
                  {idx + 1}
                </div>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-cyan-400/40">
                  <img
                    src={char.avatar || DEFAULT_OCEAN_AVATARS[0]}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_OCEAN_AVATARS[0];
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-cyan-950 dark:text-cyan-100 line-clamp-1">
                    {char.name} {getRankEmoji(idx)}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">
                      {char.tags && char.tags.length > 0 ? `#${char.tags[0]}` : '#BiểnXanh'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <ExternalLink className="w-3 h-3" /> {char.clickCount || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 3 Most Favorited */}
      <div
        className={`p-5 sm:p-6 rounded-3xl transition-all ${
          isDark
            ? 'bg-slate-900/80 border border-rose-500/30 shadow-lg shadow-rose-950/20'
            : 'bg-white/90 border border-rose-200/70 shadow-md shadow-rose-100/50'
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-2xl bg-rose-500/10 text-rose-500">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-cyan-950 dark:text-cyan-100 flex items-center gap-1.5">
              Top 3 Yêu Thích Nhất
              <Heart className="w-4 h-4 text-rose-500 fill-current" />
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Được người dùng thả tim và lưu giữ nhiều nhất trong bộ sưu tập
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {topFavorites.map((char, idx) => (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char)}
              className={`p-3 rounded-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.02] ${
                isDark
                  ? 'bg-slate-800/60 hover:bg-slate-800 border border-cyan-800/40'
                  : 'bg-rose-50/50 hover:bg-rose-100/60 border border-rose-200/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Medal Rank */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm bg-gradient-to-tr border ${getMedalColor(
                    idx
                  )}`}
                >
                  {idx + 1}
                </div>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-sm border border-rose-400/40">
                  <img
                    src={char.avatar || DEFAULT_OCEAN_AVATARS[0]}
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_OCEAN_AVATARS[0];
                    }}
                  />
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-cyan-950 dark:text-cyan-100 line-clamp-1">
                    {char.name} {getRankEmoji(idx)}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="truncate max-w-[140px] sm:max-w-[200px]">
                      {char.tags && char.tags.length > 0 ? `#${char.tags[0]}` : '#BiểnXanh'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                  <Heart className="w-3 h-3 fill-current" /> {char.favoriteCount || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
