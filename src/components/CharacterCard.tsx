import React from 'react';
import { Heart, Lock, Flame, Sparkles, ExternalLink, MessageCircle } from 'lucide-react';
import { Character } from '../types';
import { isNewlyCreated, DEFAULT_OCEAN_AVATARS } from '../utils/helpers';

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelect: (char: Character) => void;
  isDark: boolean;
  isHot?: boolean;
  hotRank?: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onToggleFavorite,
  onSelect,
  isDark,
  isHot,
  hotRank
}) => {
  const isNew = isNewlyCreated(character.createdAt);
  const feedbackCount = character.feedbacks ? character.feedbacks.length : 0;
  const avatarUrl = character.avatar || DEFAULT_OCEAN_AVATARS[0];

  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative rounded-2xl p-3 pb-4 cursor-pointer card-hover-effect flex flex-col border ${
        isDark
          ? 'bg-[#122238] border-[#1e3452] text-slate-100 shadow-[0_8px_25px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#dcecf8] text-slate-800 shadow-[0_10px_28px_-4px_rgba(180,212,238,0.4)]'
      }`}
    >
      {/* Illustration Image Container with framing */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-sky-50 dark:bg-slate-900 border border-sky-100/60 dark:border-slate-800">
        <img
          src={avatarUrl}
          alt={character.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_OCEAN_AVATARS[0];
          }}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {isNew && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f7f0] text-[#0d9488] border border-[#a7f3d0] shadow-sm backdrop-blur-md">
              <Sparkles className="w-2.5 h-2.5" /> Mới ra
            </span>
          )}

          {isHot && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] shadow-sm backdrop-blur-md">
              <Flame className="w-2.5 h-2.5 fill-current" />
              {hotRank ? `#${hotRank} Hot` : 'Hot'}
            </span>
          )}

          {character.isPrivate && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#eef2ff] text-[#4f46e5] border border-[#c7d2fe] shadow-sm backdrop-blur-md">
              <Lock className="w-2.5 h-2.5" /> Khóa pass
            </span>
          )}
        </div>

        {/* Heart Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(e, character.id)}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-sm active:scale-90 z-10 ${
            isFavorite
              ? 'bg-rose-500 text-white scale-105 shadow-rose-400/40'
              : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
          }`}
          title={isFavorite ? 'Bỏ thích' : 'Yêu thích'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom subtle stats pill overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium drop-shadow">
          <span className="bg-slate-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
            <ExternalLink className="w-2.5 h-2.5 text-cyan-300" /> {character.clickCount || 0}
          </span>
          <span className="bg-slate-900/50 px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
            <MessageCircle className="w-2.5 h-2.5 text-sky-300" /> {feedbackCount}
          </span>
        </div>
      </div>

      {/* Card Typography & Details matching illustration portfolio */}
      <div className="pt-3 text-center flex-1 flex flex-col justify-between">
        <div>
          {/* Cursive / Artistic title */}
          <h3 className="font-['Caveat',cursive] text-2xl font-bold tracking-wide text-slate-800 dark:text-sky-100 group-hover:text-[#3874cb] transition-colors truncate">
            {character.name}
          </h3>

          {/* Subtitle / Short description */}
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-medium">
            {character.shortDescription || 'Linh hồn biển cả mộng mơ'}
          </p>

          {/* Tags list (shown directly on outside card as requested) */}
          <div className="mt-2.5 flex flex-wrap justify-center gap-1">
            {character.tags && character.tags.length > 0 ? (
              character.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition ${
                    isDark
                      ? 'bg-[#182c47] text-sky-200 border border-[#233f66]'
                      : 'bg-[#f0f6fc] text-[#3874cb] border border-[#d6e7f7]'
                  }`}
                >
                  #{tag}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400">#BiểnCả</span>
            )}
            {character.tags && character.tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-slate-400 font-medium">
                +{character.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bottom subtle link prompt */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="text-[#3874cb] dark:text-sky-300 font-semibold group-hover:underline">
            Xem hồ sơ &rarr;
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400 inline" /> {character.favoriteCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
};
