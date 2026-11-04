import React, { useState } from 'react';
import { 
  X, Heart, ExternalLink, Lock, Unlock, MessageSquare, Send, Sparkles, 
  HelpCircle, Copy, Check, Trash2, Calendar, Share2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Character, Feedback } from '../types';
import { formatTimeAgo, DEFAULT_OCEAN_AVATARS } from '../utils/helpers';

interface CharacterDetailModalProps {
  character: Character;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onAddFeedback: (characterId: string, authorName: string, content: string) => Promise<void>;
  onDeleteFeedback?: (characterId: string, feedbackId: string) => Promise<void>;
  onCharacterClick: (characterId: string) => Promise<void>;
  isAdmin: boolean;
  isDark: boolean;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddFeedback,
  onDeleteFeedback,
  onCharacterClick,
  isAdmin,
  isDark
}) => {
  // Password unlocking state
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!character.isPrivate || isAdmin);
  const [unlockError, setUnlockError] = useState('');
  const [unlockedLink, setUnlockedLink] = useState(character.isPrivate && !isAdmin ? '' : character.linkUrl);

  // Feedback form state
  const [feedbackAuthor, setFeedbackAuthor] = useState('');
  const [feedbackContent, setFeedbackContent] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if link is empty / missing
  const hasNoLink = !character.linkUrl || character.linkUrl.trim() === '';

  // Password Unlock Submission
  const handleUnlockPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');

    try {
      const res = await fetch(`/api/characters/${character.id}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsUnlocked(true);
        setUnlockedLink(data.linkUrl);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#38bdf8', '#fbbf24', '#f43f5e']
        });
      } else {
        setUnlockError(data.message || 'Mật khẩu chưa chính xác, hãy xem gợi ý nhé!');
      }
    } catch (err) {
      setUnlockError('Có lỗi xảy ra khi kiểm tra mật khẩu.');
    }
  };

  // Click on character link button
  const handleOpenLink = async () => {
    if (hasNoLink) return;
    const targetLink = unlockedLink || character.linkUrl;
    if (!targetLink) return;

    // Increment click
    await onCharacterClick(character.id);

    // Open link in new tab safely
    window.open(targetLink, '_blank', 'noopener,noreferrer');
  };

  // Submit Feedback
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackContent.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await onAddFeedback(character.id, feedbackAuthor, feedbackContent);
      setFeedbackContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const avatarUrl = character.avatar || DEFAULT_OCEAN_AVATARS[0];
  const buttonLabel = character.linkButtonLabel || 'Gặp gỡ nhân vật 🌊';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all z-10 ${
          isDark
            ? 'bg-slate-900 text-cyan-50 border border-cyan-800/60 shadow-cyan-950/60'
            : 'bg-white text-slate-800 border border-sky-200 shadow-2xl'
        }`}
      >
        {/* Header with Close & Favorite */}
        <div className="relative flex items-center justify-between p-4 sm:p-6 border-b border-sky-100 dark:border-cyan-900/40 bg-gradient-to-r from-sky-400/10 via-cyan-400/5 to-transparent">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-cyan-950 dark:text-cyan-100">
              Hồ Sơ Nhân Vật
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full hover:bg-cyan-500/15 text-cyan-600 dark:text-cyan-300 transition"
              title="Sao chép liên kết hồ sơ"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
            </button>

            <button
              onClick={(e) => onToggleFavorite(e, character.id)}
              className={`p-2 rounded-full transition active:scale-90 ${
                isFavorite
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500'
              }`}
              title={isFavorite ? 'Bỏ yêu thích' : 'Yêu thích nhân vật này'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
              title="Đóng hồ sơ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 sm:px-8 overflow-y-auto space-y-6 flex-1">
          {/* Top Hero Section: Avatar & Info */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Big Avatar */}
            <div className="w-full md:w-56 lg:w-64 shrink-0 rounded-2xl overflow-hidden shadow-lg border-2 border-cyan-400/30 group">
              <img
                src={avatarUrl}
                alt={character.name}
                className="w-full h-64 md:h-72 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_OCEAN_AVATARS[0];
                }}
              />
            </div>

            {/* Title, tags, short summary */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-['Caveat',cursive] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide text-slate-800 dark:text-sky-100">
                  {character.name}
                </h1>
                {character.isPrivate && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#eef2ff] text-[#4f46e5] border border-[#c7d2fe]">
                    <Lock className="w-3.5 h-3.5" /> Riêng tư
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{character.shortDescription}"
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {character.tags && character.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full font-medium bg-cyan-50 dark:bg-cyan-950/70 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Meta stats */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" /> Ngày tạo: {formatTimeAgo(character.createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-500" /> {character.clickCount || 0} lượt trò chuyện
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" /> {character.favoriteCount || 0} lượt yêu thích
                </span>
              </div>

              {/* Action Button: Link or Password Challenge */}
              <div className="pt-3">
                {hasNoLink ? (
                  /* Disabled state when character has no link configured */
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 text-amber-800 dark:text-amber-300 flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500" /> Chưa cập nhật link dẫn nhân vật
                    </span>
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-300 dark:bg-slate-700 text-slate-500 text-xs font-semibold cursor-not-allowed opacity-75"
                    >
                      Bị khóa link
                    </button>
                  </div>
                ) : character.isPrivate && !isUnlocked ? (
                  /* Private character: Password / Riddle Challenge Card */
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-sky-950/40 border border-indigo-500/40 shadow-inner space-y-3">
                    <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
                      <HelpCircle className="w-4 h-4 text-cyan-400" />
                      <span>Câu Đố Mở Khóa Nhân Vật</span>
                    </div>

                    {character.question && (
                      <p className="text-xs sm:text-sm text-cyan-100 font-medium">
                        {character.question}
                      </p>
                    )}

                    {character.hint && (
                      <div className="text-xs text-cyan-300/80 bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-800/40">
                        💡 <span className="font-semibold">Gợi ý (Hint):</span> {character.hint}
                      </div>
                    )}

                    <form onSubmit={handleUnlockPassword} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nhập câu trả lời / mật mã..."
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-900/80 border border-cyan-500/40 text-cyan-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95 flex items-center gap-1.5 shrink-0"
                      >
                        <Unlock className="w-4 h-4" /> Mở khóa
                      </button>
                    </form>

                    {unlockError && (
                      <p className="text-xs text-rose-400 font-medium">{unlockError}</p>
                    )}
                  </div>
                ) : (
                  /* Unlocked or Public character link button */
                  <button
                    onClick={handleOpenLink}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/30 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <span>{buttonLabel}</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* First Message (Roleplay Opening Chat Bubble) */}
          {character.firstMessage && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> Lời Mở Đầu (First Message)
              </h3>
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-sky-500/5 to-transparent border border-cyan-400/30 text-slate-800 dark:text-cyan-100 text-sm leading-relaxed shadow-sm relative">
                <div className="text-cyan-500 text-3xl font-serif absolute top-1 left-2 opacity-30">“</div>
                <div className="pl-4 italic">
                  {character.firstMessage}
                </div>
              </div>
            </div>
          )}

          {/* Backstory / Cốt Truyện / Plot */}
          {character.backstory && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                📖 Cốt Truyện & Bối Cảnh (Backstory)
              </h3>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-cyan-900/40 text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {character.backstory}
              </div>
            </div>
          )}

          {/* Detailed Description */}
          {character.detailDescription && (
            <div className="space-y-2">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                ✨ Chi Tiết Ngoại Hình & Tính Cách
              </h3>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-cyan-900/40 text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {character.detailDescription}
              </div>
            </div>
          )}

          {/* Feedback & Comments Section */}
          <div className="pt-4 border-t border-sky-100 dark:border-cyan-900/40 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-cyan-950 dark:text-cyan-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-500" />
                Bình Luận & Cảm Nghĩ ({character.feedbacks ? character.feedbacks.length : 0})
              </h3>
              <span className="text-xs text-slate-400">Đồng bộ cho tất cả mọi người</span>
            </div>

            {/* Feedback Input Form */}
            <form onSubmit={handleFeedbackSubmit} className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-400/20 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Tên của bạn (Tùy chọn, ví dụ: Bé Cá Heo)..."
                  value={feedbackAuthor}
                  onChange={(e) => setFeedbackAuthor(e.target.value)}
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 text-slate-800 dark:text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  placeholder="Gửi lời nhận xét hoặc cảm nghĩ về nhân vật này nhé..."
                  value={feedbackContent}
                  onChange={(e) => setFeedbackContent(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 text-slate-800 dark:text-cyan-100 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={isSubmittingFeedback || !feedbackContent.trim()}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" /> Gửi
                </button>
              </div>
            </form>

            {/* Feedbacks list */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {character.feedbacks && character.feedbacks.length > 0 ? (
                character.feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-sky-100 dark:border-cyan-900/40 flex items-start justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-800 dark:text-cyan-300">
                          {fb.authorName || 'Khách Du Thủy'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatTimeAgo(fb.createdAt)}
                        </span>
                      </div>
                      <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {fb.content}
                      </p>
                    </div>

                    {/* Admin delete comment */}
                    {isAdmin && onDeleteFeedback && (
                      <button
                        onClick={() => onDeleteFeedback(character.id, fb.id)}
                        className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-500/10 transition"
                        title="Xóa bình luận này (Admin)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400 italic">
                  Chưa có bình luận nào. Hãy là người đầu tiên để lại cảm nghĩ cho {character.name} nhé!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
