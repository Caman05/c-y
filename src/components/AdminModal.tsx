import React, { useState } from 'react';
import { 
  X, Lock, Shield, Plus, Edit2, Trash2, Music, Bell, Tag, 
  BarChart3, RefreshCw, Key, Image, Link2, Eye, HelpCircle, 
  FileText, MessageSquare, Check, Sparkles 
} from 'lucide-react';
import { Character, MusicTrack, Announcement, SiteStats, ForumPost } from '../types';
import { convertGoogleDriveUrl, DEFAULT_OCEAN_AVATARS } from '../utils/helpers';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLogin: (password: string) => Promise<boolean>;
  onLogout: () => void;
  characters: Character[];
  onSaveCharacter: (char: Partial<Character>) => Promise<void>;
  onDeleteCharacter: (id: string) => Promise<void>;
  musicTracks: MusicTrack[];
  onSaveTrack: (track: Partial<MusicTrack>) => Promise<void>;
  onDeleteTrack: (id: string) => Promise<void>;
  announcements: Announcement[];
  onSaveAnnouncement: (ann: Partial<Announcement>) => Promise<void>;
  onDeleteAnnouncement: (id: string) => Promise<void>;
  tags: string[];
  onAddTag: (tag: string) => Promise<void>;
  onDeleteTag: (tag: string) => Promise<void>;
  stats: SiteStats | null;
  forumPosts: ForumPost[];
  onDeleteForumPost: (id: string) => Promise<void>;
  onDeleteFeedback: (charId: string, feedbackId: string) => Promise<void>;
  isDark: boolean;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLogin,
  onLogout,
  characters,
  onSaveCharacter,
  onDeleteCharacter,
  musicTracks,
  onSaveTrack,
  onDeleteTrack,
  announcements,
  onSaveAnnouncement,
  onDeleteAnnouncement,
  tags,
  onAddTag,
  onDeleteTag,
  stats,
  forumPosts,
  onDeleteForumPost,
  onDeleteFeedback,
  isDark
}) => {
  // Login form
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'characters' | 'music' | 'announcements' | 'tags' | 'moderation' | 'stats' | 'security'>('characters');

  // Character Form state
  const [editingCharacter, setEditingCharacter] = useState<Partial<Character> | null>(null);
  const [isCharFormOpen, setIsCharFormOpen] = useState(false);

  // New tag input
  const [newTagInput, setNewTagInput] = useState('');

  // Music form
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  const [musicUrl, setMusicUrl] = useState('');
  const [musicDuration, setMusicDuration] = useState('03:00');
  const [editingTrackId, setEditingTrackId] = useState<string | null>(null);

  // Announcement form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'info' | 'event' | 'update'>('info');

  // Change Password
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    const success = await onLogin(password);
    setIsLoggingIn(false);
    if (!success) {
      setLoginError('Mật khẩu không chính xác! (Mặc định: oceanadmin)');
    } else {
      setPassword('');
    }
  };

  // Open Character Create/Edit
  const handleOpenCharForm = (char?: Character) => {
    if (char) {
      setEditingCharacter({ ...char });
    } else {
      setEditingCharacter({
        name: '',
        shortDescription: '',
        avatar: '',
        tags: [],
        detailDescription: '',
        backstory: '',
        firstMessage: '',
        linkUrl: '',
        linkButtonLabel: 'Tâm tình cùng nhân vật 🌊',
        isPrivate: false,
        hint: '',
        question: '',
        password: ''
      });
    }
    setIsCharFormOpen(true);
  };

  const handleSaveCharSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharacter || !editingCharacter.name?.trim()) return;

    await onSaveCharacter({
      ...editingCharacter,
      avatar: convertGoogleDriveUrl(editingCharacter.avatar || '')
    });
    setIsCharFormOpen(false);
    setEditingCharacter(null);
  };

  const toggleTagInEditingChar = (tag: string) => {
    if (!editingCharacter) return;
    const curTags = editingCharacter.tags || [];
    if (curTags.includes(tag)) {
      setEditingCharacter({
        ...editingCharacter,
        tags: curTags.filter(t => t !== tag)
      });
    } else {
      setEditingCharacter({
        ...editingCharacter,
        tags: [...curTags, tag]
      });
    }
  };

  const handleSaveTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!musicTitle.trim() || !musicUrl.trim()) return;
    await onSaveTrack({
      id: editingTrackId || undefined,
      title: musicTitle.trim(),
      artist: musicArtist.trim() || 'Biển Xanh Lofi',
      url: musicUrl.trim(),
      duration: musicDuration
    });
    setMusicTitle('');
    setMusicArtist('');
    setMusicUrl('');
    setEditingTrackId(null);
  };

  const handleSaveAnnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    await onSaveAnnouncement({
      title: annTitle.trim(),
      content: annContent.trim(),
      type: annType,
      active: true
    });
    setAnnTitle('');
    setAnnContent('');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('');
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPass, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        setPassMsg('Đổi mật khẩu thành công!');
        setCurrentPass('');
        setNewPass('');
      } else {
        setPassMsg(data.message || 'Lỗi khi đổi mật khẩu.');
      }
    } catch {
      setPassMsg('Lỗi kết nối máy chủ.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl z-10 ${
          isDark
            ? 'bg-slate-900 text-cyan-100 border border-cyan-800'
            : 'bg-white text-slate-800 border border-sky-200'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-sky-100 dark:border-cyan-900/60 bg-gradient-to-r from-cyan-600/10 via-sky-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-500" />
            <h2 className="text-xl sm:text-2xl font-black text-cyan-950 dark:text-cyan-100">
              Bảng Quản Trị Hệ Thống (Admin Control)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold transition"
              >
                Đăng Xuất
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-cyan-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In -> Show Login Form */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-cyan-500/10 flex items-center justify-center text-cyan-500 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-cyan-950 dark:text-cyan-100">
                Xác Minh Danh Tính Quản Trị Viên
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vui lòng nhập mật khẩu quản trị để truy cập bảng điều khiển và quản lý nội dung.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Nhập mật khẩu admin..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 text-slate-800 dark:text-cyan-100 text-sm focus:outline-none focus:border-cyan-400"
              />

              {loginError && (
                <p className="text-xs text-rose-500 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn || !password}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Shield className="w-4 h-4" /> Đăng Nhập Quản Trị
              </button>

              <p className="text-[11px] text-slate-400">
                * Mật khẩu mặc định: <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">oceanadmin</span>
              </p>
            </form>
          </div>
        ) : (
          /* Admin Logged In -> Tabs & Full Management */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 p-3 border-b md:border-b-0 md:border-r border-sky-100 dark:border-cyan-900/60 bg-sky-50/50 dark:bg-slate-900/50 flex md:flex-col gap-1 overflow-x-auto shrink-0 text-xs font-semibold">
              <button
                onClick={() => { setActiveTab('characters'); setIsCharFormOpen(false); }}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'characters'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4" /> Nhân Vật ({characters.length})
              </button>

              <button
                onClick={() => setActiveTab('music')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'music'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Music className="w-4 h-4" /> Nhạc Nền ({musicTracks.length})
              </button>

              <button
                onClick={() => setActiveTab('announcements')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'announcements'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Bell className="w-4 h-4" /> Thông Báo ({announcements.length})
              </button>

              <button
                onClick={() => setActiveTab('tags')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'tags'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Tag className="w-4 h-4" /> Quản Lý Tags ({tags.length})
              </button>

              <button
                onClick={() => setActiveTab('moderation')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'moderation'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Kiểm Duyệt
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'stats'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Thống Kê
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`p-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === 'security'
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Key className="w-4 h-4" /> Mật Khẩu
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* TAB 1: CHARACTERS */}
              {activeTab === 'characters' && (
                <div>
                  {!isCharFormOpen ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-cyan-950 dark:text-cyan-100">
                            Danh Sách Nhân Vật ({characters.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            Thêm, chỉnh sửa hoặc xóa profile nhân vật trong hệ thống
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenCharForm()}
                          className="px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                        >
                          <Plus className="w-4 h-4" /> Thêm Nhân Vật Mới
                        </button>
                      </div>

                      {/* Characters List Table */}
                      <div className="space-y-2">
                        {characters.map((c) => (
                          <div
                            key={c.id}
                            className={`p-3 rounded-2xl flex items-center justify-between gap-3 border ${
                              isDark
                                ? 'bg-slate-800/60 border-cyan-800/40'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={c.avatar || DEFAULT_OCEAN_AVATARS[0]}
                                alt={c.name}
                                className="w-12 h-12 rounded-xl object-cover border border-cyan-400/40"
                              />
                              <div>
                                <h4 className="font-bold text-xs sm:text-sm text-cyan-900 dark:text-cyan-200 flex items-center gap-2">
                                  {c.name}
                                  {c.isPrivate && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 font-normal">
                                      🔒 Pass: {c.password || 'chưa đặt'}
                                    </span>
                                  )}
                                  {!c.linkUrl && (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-normal">
                                      Chưa có link
                                    </span>
                                  )}
                                </h4>
                                <p className="text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                                  {c.shortDescription}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenCharForm(c)}
                                className="p-2 rounded-xl hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition"
                                title="Chỉnh sửa nhân vật"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn xóa nhân vật ${c.name}?`)) {
                                    onDeleteCharacter(c.id);
                                  }
                                }}
                                className="p-2 rounded-xl hover:bg-rose-500/10 text-rose-500 transition"
                                title="Xóa nhân vật"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Character Create/Edit Form */
                    <form onSubmit={handleSaveCharSubmit} className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-cyan-900/60">
                        <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                          {editingCharacter?.id ? 'Chỉnh Sửa Hồ Sơ Nhân Vật' : 'Tạo Hồ Sơ Nhân Vật Mới'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => setIsCharFormOpen(false)}
                          className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                        >
                          Quay lại danh sách
                        </button>
                      </div>

                      {/* Name & Short Description */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1">Tên nhân vật *</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Marina Tiên Cá..."
                            value={editingCharacter?.name || ''}
                            onChange={(e) => setEditingCharacter({ ...editingCharacter, name: e.target.value })}
                            required
                            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">Mô tả ngắn (Hiển thị ngoài thẻ)</label>
                          <input
                            type="text"
                            placeholder="Mô tả tóm tắt tính cách hoặc bối cảnh..."
                            value={editingCharacter?.shortDescription || ''}
                            onChange={(e) => setEditingCharacter({ ...editingCharacter, shortDescription: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Avatar URL / Google Drive link input */}
                      <div>
                        <label className="block text-xs font-semibold mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5 text-cyan-500" />
                            Ảnh đại diện (Hỗ trợ URL trực tiếp hoặc Link Google Drive)
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="Dán link ảnh hoặc link Google Drive (https://drive.google.com/file/d/...)..."
                          value={editingCharacter?.avatar || ''}
                          onChange={(e) => setEditingCharacter({ ...editingCharacter, avatar: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400 font-mono text-[11px]"
                        />
                        {editingCharacter?.avatar && (
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={convertGoogleDriveUrl(editingCharacter.avatar)}
                              alt="Xem trước"
                              className="w-12 h-12 rounded-xl object-cover border border-cyan-400 shadow-sm"
                            />
                            <span className="text-[11px] text-emerald-500 font-semibold">
                              ✓ Xem trước ảnh thành công
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Tags Selection */}
                      <div>
                        <label className="block text-xs font-semibold mb-1.5">
                          Thẻ phân loại (Tags - Hiển thị ngoài thẻ)
                        </label>
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-sky-200 dark:border-cyan-800">
                          {tags.map((t) => {
                            const isSelected = editingCharacter?.tags?.includes(t);
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => toggleTagInEditingChar(t)}
                                className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                                  isSelected
                                    ? 'bg-cyan-500 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                }`}
                              >
                                {isSelected ? '✓ ' : '+ '} {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Link URL & Button Label */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold mb-1 flex items-center gap-1">
                            <Link2 className="w-3.5 h-3.5 text-cyan-500" /> Đường dẫn nhân vật (Link Bot / C.ai / ...)
                          </label>
                          <input
                            type="text"
                            placeholder="Để trống nếu muốn khóa nút link..."
                            value={editingCharacter?.linkUrl || ''}
                            onChange={(e) => setEditingCharacter({ ...editingCharacter, linkUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                          />
                          {!editingCharacter?.linkUrl && (
                            <p className="text-[10px] text-amber-500 mt-1">
                              * Chưa điền link: nút dẫn link sẽ tự động bị khóa (chỉ xem profile).
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            Tên nhãn của nút bấm liên kết
                          </label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Trò chuyện ngay, Bước vào thủy cung..."
                            value={editingCharacter?.linkButtonLabel || ''}
                            onChange={(e) => setEditingCharacter({ ...editingCharacter, linkButtonLabel: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>

                      {/* Private & Password Challenge Configuration */}
                      <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/40 border border-cyan-200 dark:border-cyan-800/60 space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(editingCharacter?.isPrivate)}
                            onChange={(e) => setEditingCharacter({ ...editingCharacter, isPrivate: e.target.checked })}
                            className="w-4 h-4 rounded text-cyan-500 accent-cyan-500"
                          />
                          <span className="font-bold text-xs sm:text-sm text-cyan-950 dark:text-cyan-100 flex items-center gap-1.5">
                            <Lock className="w-4 h-4 text-cyan-500" /> Thiết lập trạng thái Riêng Tư (Cần giải pass để mở link)
                          </span>
                        </label>

                        {editingCharacter?.isPrivate && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div>
                              <label className="block text-[11px] font-semibold mb-1">Câu hỏi câu đố</label>
                              <input
                                type="text"
                                placeholder="Ví dụ: Vảy của Kaelen có ánh màu gì?"
                                value={editingCharacter?.question || ''}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, question: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold mb-1">Gợi ý (Hint)</label>
                              <input
                                type="text"
                                placeholder="Gợi ý: màu xanh của biển cả..."
                                value={editingCharacter?.hint || ''}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, hint: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold mb-1">Mật khẩu chính xác *</label>
                              <input
                                type="text"
                                placeholder="Đáp án mở khóa..."
                                value={editingCharacter?.password || ''}
                                onChange={(e) => setEditingCharacter({ ...editingCharacter, password: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 font-semibold text-cyan-600 dark:text-cyan-400"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* First message */}
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          First Message (Lời chào mở đầu của nhân vật)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Câu thoại chào mở đầu phong cách roleplay..."
                          value={editingCharacter?.firstMessage || ''}
                          onChange={(e) => setEditingCharacter({ ...editingCharacter, firstMessage: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Backstory & Plot */}
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Backstory / Cốt truyện & Plot
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Bối cảnh, nguồn gốc và xuất thân..."
                          value={editingCharacter?.backstory || ''}
                          onChange={(e) => setEditingCharacter({ ...editingCharacter, backstory: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Detailed Description */}
                      <div>
                        <label className="block text-xs font-semibold mb-1">
                          Mô tả chi tiết (Ngoại hình, tính cách, thói quen)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Mô tả kỹ lưỡng..."
                          value={editingCharacter?.detailDescription || ''}
                          onChange={(e) => setEditingCharacter({ ...editingCharacter, detailDescription: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      {/* Submit & Cancel */}
                      <div className="flex justify-end gap-2 pt-2 border-t border-sky-100 dark:border-cyan-900/60">
                        <button
                          type="button"
                          onClick={() => setIsCharFormOpen(false)}
                          className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold"
                        >
                          Hủy Bỏ
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md"
                        >
                          Lưu Hồ Sơ Nhân Vật
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 2: MUSIC */}
              {activeTab === 'music' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Quản Lý Thư Viện Nhạc Nền ({musicTracks.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Các bài hát này sẽ được phát tự động cho khách ghé thăm khi tương tác lần đầu
                    </p>
                  </div>

                  {/* Add Track Form */}
                  <form onSubmit={handleSaveTrackSubmit} className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/40 border border-sky-200 dark:border-cyan-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase text-cyan-800 dark:text-cyan-300">
                      {editingTrackId ? 'Chỉnh Sửa Bài Hát' : 'Thêm Bài Hát Mới'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Tiêu đề bài hát *</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Ocean Waves Lofi..."
                          value={musicTitle}
                          onChange={(e) => setMusicTitle(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Nghệ sĩ</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Biển Cả Xanh..."
                          value={musicArtist}
                          onChange={(e) => setMusicArtist(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold mb-1">Đường dẫn tệp Audio (Direct MP3 URL) *</label>
                        <input
                          type="text"
                          placeholder="https://...mp3"
                          value={musicUrl}
                          onChange={(e) => setMusicUrl(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Thời lượng</label>
                        <input
                          type="text"
                          placeholder="03:00"
                          value={musicDuration}
                          onChange={(e) => setMusicDuration(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      {editingTrackId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTrackId(null);
                            setMusicTitle('');
                            setMusicArtist('');
                            setMusicUrl('');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-semibold"
                        >
                          Hủy
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
                      >
                        {editingTrackId ? 'Cập Nhật Bài Hát' : 'Thêm Vào Danh Sách'}
                      </button>
                    </div>
                  </form>

                  {/* Tracks List */}
                  <div className="space-y-2">
                    {musicTracks.map((t, idx) => (
                      <div
                        key={t.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-cyan-900/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-600 font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <h5 className="font-bold text-cyan-950 dark:text-cyan-200">{t.title}</h5>
                            <p className="text-slate-500 text-[11px]">{t.artist} • {t.duration}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingTrackId(t.id);
                              setMusicTitle(t.title);
                              setMusicArtist(t.artist);
                              setMusicUrl(t.url);
                              setMusicDuration(t.duration || '03:00');
                            }}
                            className="p-1.5 rounded-lg hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteTrack(t.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Quản Lý Thông Báo ({announcements.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hiển thị thanh banner thông báo chào mừng hoặc sự kiện trên đầu trang
                    </p>
                  </div>

                  {/* Add announcement form */}
                  <form onSubmit={handleSaveAnnSubmit} className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-slate-800/40 border border-sky-200 dark:border-cyan-800 space-y-3">
                    <h4 className="font-bold text-xs uppercase text-cyan-800 dark:text-cyan-300">
                      Đăng Thông Báo Mới
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-semibold mb-1">Tiêu đề thông báo *</label>
                        <input
                          type="text"
                          placeholder="Tiêu đề..."
                          value={annTitle}
                          onChange={(e) => setAnnTitle(e.target.value)}
                          required
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1">Loại thông báo</label>
                        <select
                          value={annType}
                          onChange={(e) => setAnnType(e.target.value as any)}
                          className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                        >
                          <option value="info">ℹ️ Thông tin thường</option>
                          <option value="event">🎉 Sự kiện mới</option>
                          <option value="update">⚡ Cập nhật</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold mb-1">Nội dung chi tiết *</label>
                      <textarea
                        rows={2}
                        placeholder="Nội dung thông báo..."
                        value={annContent}
                        onChange={(e) => setAnnContent(e.target.value)}
                        required
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
                      >
                        Đăng Thông Báo
                      </button>
                    </div>
                  </form>

                  {/* List of announcements */}
                  <div className="space-y-2">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-cyan-900/40 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-950 dark:text-cyan-200">{ann.title}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                              {ann.type}
                            </span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300">{ann.content}</p>
                        </div>
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-500 transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: TAGS */}
              {activeTab === 'tags' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Quản Lý Thẻ (Tags) Nhân Vật ({tags.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Thêm thẻ mới để gán cho các nhân vật hoặc lọc trên trang chủ
                    </p>
                  </div>

                  {/* Add tag form */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nhập tên thẻ mới (ví dụ: Tsundere, Học Đường)..."
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newTagInput.trim()) {
                          onAddTag(newTagInput.trim());
                          setNewTagInput('');
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTagInput.trim()) {
                          onAddTag(newTagInput.trim());
                          setNewTagInput('');
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
                    >
                      Thêm Thẻ
                    </button>
                  </div>

                  {/* Current tags cloud */}
                  <div className="flex flex-wrap gap-2 p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-cyan-900/40">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-400/20"
                      >
                        #{t}
                        <button
                          onClick={() => onDeleteTag(t)}
                          className="hover:text-rose-500 transition"
                          title="Xóa thẻ"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: MODERATION */}
              {activeTab === 'moderation' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Kiểm Duyệt Nội Dung & Phản Hồi
                    </h3>
                    <p className="text-xs text-slate-500">
                      Xem và xóa các bài đăng diễn đàn hoặc phản hồi không phù hợp
                    </p>
                  </div>

                  {/* Forum Posts Section */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase text-cyan-800 dark:text-cyan-300">
                      Bài Đăng Diễn Đàn ({forumPosts.length})
                    </h4>
                    {forumPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-cyan-900/40 flex items-start justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-cyan-900 dark:text-cyan-200">{post.title}</span>
                            <span className="text-[10px] text-slate-400">bởi {post.authorName}</span>
                          </div>
                          <p className="mt-1 text-slate-600 dark:text-slate-300 line-clamp-2">{post.content}</p>
                        </div>
                        <button
                          onClick={() => onDeleteForumPost(post.id)}
                          className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                          title="Xóa bài viết"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Characters Feedback Section */}
                  <div className="space-y-2 pt-4 border-t border-sky-100 dark:border-cyan-900/60">
                    <h4 className="font-bold text-xs uppercase text-cyan-800 dark:text-cyan-300">
                      Bình Luận Hồ Sơ Nhân Vật
                    </h4>
                    {characters.flatMap((char) =>
                      (char.feedbacks || []).map((fb) => (
                        <div
                          key={fb.id}
                          className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-sky-100 dark:border-cyan-900/40 flex items-start justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-cyan-800 dark:text-cyan-300">{fb.authorName}</span>
                              <span className="text-[10px] text-slate-400">tại nhân vật: {char.name}</span>
                            </div>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">{fb.content}</p>
                          </div>
                          <button
                            onClick={() => onDeleteFeedback(char.id, fb.id)}
                            className="text-rose-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                            title="Xóa bình luận"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: STATS */}
              {activeTab === 'stats' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Thống Kê Dữ Liệu Thời Gian Thực
                    </h3>
                    <p className="text-xs text-slate-500">
                      Số liệu hoạt động thực tế từ toàn bộ du khách ghé thăm website
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-cyan-600 dark:text-cyan-400">
                        {stats?.totalCharacters || characters.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Tổng nhân vật đã đăng</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-amber-500">
                        {stats?.totalClicks || 0}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Lượt click link bot</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-rose-500">
                        {stats?.totalFavorites || 0}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Lượt thả tim yêu thích</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-sky-500">
                        {stats?.totalFeedbacks || 0}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Bình luận hồ sơ</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-indigo-500">
                        {stats?.totalForumPosts || forumPosts.length}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Bài đăng diễn đàn</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                      <div className="text-2xl sm:text-3xl font-black text-emerald-500">
                        {stats?.visitCount || 100}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Lượt truy cập trang</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: SECURITY */}
              {activeTab === 'security' && (
                <div className="space-y-6 max-w-md">
                  <div>
                    <h3 className="font-bold text-lg text-cyan-900 dark:text-cyan-200">
                      Tùy Chỉnh Mật Khẩu Admin
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cập nhật mật khẩu đăng nhập vào bảng quản trị
                    </p>
                  </div>

                  <form onSubmit={handleChangePasswordSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold mb-1">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        placeholder="Mật khẩu cũ..."
                        value={currentPass}
                        onChange={(e) => setCurrentPass(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold mb-1">Mật khẩu mới</label>
                      <input
                        type="password"
                        placeholder="Mật khẩu mới (ít nhất 4 ký tự)..."
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800"
                      />
                    </div>

                    {passMsg && (
                      <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">{passMsg}</p>
                    )}

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
                    >
                      Đổi Mật Khẩu Ngay
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
