import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Eye, Dices } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character } from '../types';
import { DEFAULT_OCEAN_AVATARS } from '../utils/helpers';

interface RandomCharacterModalProps {
  characters: Character[];
  onClose: () => void;
  onSelectCharacter: (char: Character) => void;
  isDark: boolean;
}

export const RandomCharacterModal: React.FC<RandomCharacterModalProps> = ({
  characters,
  onClose,
  onSelectCharacter,
  isDark
}) => {
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollCharacter = () => {
    if (characters.length === 0) return;
    setIsRolling(true);

    let rolls = 0;
    const maxRolls = 12;
    const interval = setInterval(() => {
      const randIdx = Math.floor(Math.random() * characters.length);
      setSelectedChar(characters[randIdx]);
      rolls++;

      if (rolls >= maxRolls) {
        clearInterval(interval);
        setIsRolling(false);
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#06b6d4', '#f59e0b', '#ec4899']
        });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 z-10 text-center ${
          isDark
            ? 'bg-slate-900 border border-cyan-800/80 text-cyan-100 shadow-cyan-950/80'
            : 'bg-white border border-sky-200 text-slate-800 shadow-sky-200/60'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-cyan-500/10 text-slate-400 hover:text-slate-600 dark:hover:text-cyan-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <Dices className="w-6 h-6 text-cyan-500 animate-bounce" />
          <h2 className="text-2xl font-black tracking-tight text-cyan-900 dark:text-cyan-200">
            Nhân Vật Hôm Nay
          </h2>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs mx-auto">
          Để dòng hải lưu định mệnh chọn cho bạn người bạn đồng hành trò chuyện hôm nay!
        </p>

        {/* Showcase Character Box */}
        {selectedChar ? (
          <div
            className={`p-4 rounded-3xl border transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/80 border-cyan-700/60'
                : 'bg-sky-50/80 border-sky-200'
            }`}
          >
            <div className="relative w-36 h-36 mx-auto rounded-2xl overflow-hidden shadow-md border-2 border-cyan-400/50 mb-3">
              <img
                src={selectedChar.avatar || DEFAULT_OCEAN_AVATARS[0]}
                alt={selectedChar.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_OCEAN_AVATARS[0];
                }}
              />
            </div>

            <h3 className="text-lg font-bold text-cyan-900 dark:text-cyan-100">
              {selectedChar.name}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
              {selectedChar.shortDescription}
            </p>

            <div className="flex flex-wrap justify-center gap-1 mt-2">
              {selectedChar.tags && selectedChar.tags.slice(0, 3).map((t, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300"
                >
                  #{t}
                </span>
              ))}
            </div>

            {/* Action to view detail */}
            <div className="mt-4 flex gap-2 justify-center">
              <button
                onClick={() => {
                  onSelectCharacter(selectedChar);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" /> Xem Toàn Bộ Profile
              </button>
            </div>
          </div>
        ) : (
          /* Empty shell placeholder */
          <div className="py-12 px-6 rounded-3xl border-2 border-dashed border-cyan-300 dark:border-cyan-800 bg-sky-50/50 dark:bg-slate-800/40 my-2">
            <div className="text-5xl mb-3 animate-sway-slow">🐚</div>
            <p className="text-xs sm:text-sm text-cyan-800 dark:text-cyan-300 font-semibold">
              Vỏ ốc ma thuật đang đợi bạn gõ nhẹ...
            </p>
          </div>
        )}

        {/* Action Button: Roll / Reroll */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={rollCharacter}
            disabled={isRolling || characters.length === 0}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-teal-400 to-cyan-500 hover:brightness-105 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
            {selectedChar ? 'Quay Lại Nhân Vật Khác' : 'Khám Phá Định Mệnh Biển Cả ✨'}
          </button>
        </div>
      </div>
    </div>
  );
};
