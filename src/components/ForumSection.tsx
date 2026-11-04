import React, { useState } from 'react';
import { 
  MessageSquare, Heart, Send, Sparkles, Shield, Trash2, 
  MessageCircle, PlusCircle, ChevronDown, ChevronUp 
} from 'lucide-react';
import { ForumPost } from '../types';
import { formatTimeAgo } from '../utils/helpers';

interface ForumSectionProps {
  posts: ForumPost[];
  onAddPost: (post: { authorName: string; authorRole: 'admin' | 'user'; title: string; content: string; tag: string }) => Promise<void>;
  onAddComment: (postId: string, comment: { authorName: string; authorRole: 'admin' | 'user'; content: string }) => Promise<void>;
  onLikePost: (postId: string) => Promise<void>;
  onDeletePost?: (postId: string) => Promise<void>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<void>;
  isAdmin: boolean;
  isDark: boolean;
}

export const ForumSection: React.FC<ForumSectionProps> = ({
  posts,
  onAddPost,
  onAddComment,
  onLikePost,
  onDeletePost,
  onDeleteComment,
  isAdmin,
  isDark
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newTag, setNewTag] = useState('Tâm Sự Biển');

  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, { author: string; content: string }>>({});

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleCommentChange = (postId: string, field: 'author' | 'content', value: string) => {
    setCommentInputs(prev => ({
      ...prev,
      [postId]: {
        ...(prev[postId] || { author: '', content: '' }),
        [field]: value
      }
    }));
  };

  const submitComment = async (postId: string) => {
    const input = commentInputs[postId];
    if (!input || !input.content.trim()) return;

    await onAddComment(postId, {
      authorName: input.author || (isAdmin ? 'Admin Đại Dương' : 'Du Khách Hải Đảo'),
      authorRole: isAdmin ? 'admin' : 'user',
      content: input.content.trim()
    });

    setCommentInputs(prev => ({
      ...prev,
      [postId]: { author: input.author, content: '' }
    }));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    await onAddPost({
      title: newTitle.trim(),
      content: newContent.trim(),
      authorName: newAuthor.trim() || (isAdmin ? 'Admin Đại Dương 🐋' : 'Du Khách Hải Đảo 🐚'),
      authorRole: isAdmin ? 'admin' : 'user',
      tag: newTag
    });

    setNewTitle('');
    setNewContent('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Forum Header & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-sky-400/10 via-cyan-400/10 to-indigo-400/10 border border-cyan-400/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐚</span>
            <h2 className="text-xl sm:text-2xl font-black text-cyan-950 dark:text-cyan-100">
              Diễn Đàn Đại Dương
            </h2>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Giao lưu tâm sự, chia sẻ cốt truyện, gửi gắm yêu cầu nhân vật cho admin và mọi người!
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Viết Bài Mới
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowCreateModal(false)}
          />
          <div
            className={`relative w-full max-w-lg rounded-3xl p-6 shadow-2xl z-10 ${
              isDark
                ? 'bg-slate-900 text-cyan-100 border border-cyan-700/60'
                : 'bg-white text-slate-800 border border-sky-200'
            }`}
          >
            <h3 className="text-lg font-bold text-cyan-900 dark:text-cyan-200 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-500" /> Tạo Bài Đăng Mới
            </h3>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Tên hiển thị của bạn
                </label>
                <input
                  type="text"
                  placeholder={isAdmin ? 'Admin Đại Dương 🐋' : 'Ví dụ: Bé Hải Cẩu...'}
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Chủ đề / Phân loại
                </label>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Tâm Sự Biển">🌊 Tâm Sự Biển</option>
                  <option value="Gợi Ý Bot">💡 Gợi Ý Nhân Vật Mới</option>
                  <option value="Fanfic & Plot">✨ Fanfic & Cốt Truyện</option>
                  <option value="Hỏi Đáp">❓ Giao Lưu & Hỏi Đáp</option>
                  {isAdmin && <option value="Thông Báo">📢 Thông Báo Quản Trị</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Tiêu đề bài viết
                </label>
                <input
                  type="text"
                  placeholder="Tiêu đề thật ngắn gọn và thu hút..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Nội dung chia sẻ
                </label>
                <textarea
                  rows={4}
                  placeholder="Gửi gắm suy nghĩ của bạn đến cộng đồng đại dương nhé..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs"
                >
                  Đăng Bài Ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {posts && posts.length > 0 ? (
          posts.map((post) => {
            const commentsOpen = expandedComments[post.id];
            const commentCount = post.comments ? post.comments.length : 0;
            const inputState = commentInputs[post.id] || { author: '', content: '' };

            return (
              <div
                key={post.id}
                className={`p-5 rounded-3xl transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border border-cyan-800/40'
                    : 'bg-white/90 border border-sky-100 shadow-sm'
                }`}
              >
                {/* Post Top Meta */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-cyan-900 dark:text-cyan-200 flex items-center gap-1">
                      {post.authorRole === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                          <Shield className="w-3 h-3" /> Admin
                        </span>
                      ) : null}
                      {post.authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      • {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 font-semibold border border-cyan-400/20">
                      {post.tag}
                    </span>

                    {/* Admin delete post */}
                    {isAdmin && onDeletePost && (
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="p-1 rounded-lg hover:bg-rose-500/10 text-rose-400 transition"
                        title="Xóa bài viết này (Admin)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Title & Content */}
                <h3 className="text-base sm:text-lg font-bold text-cyan-950 dark:text-cyan-100 mb-1.5">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Bottom Bar: Like & Comments toggle */}
                <div className="mt-4 pt-3 border-t border-sky-100 dark:border-cyan-900/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-4">
                    {/* Like button */}
                    <button
                      onClick={() => onLikePost(post.id)}
                      className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-500 transition active:scale-90"
                    >
                      <Heart className="w-4 h-4 text-rose-400 hover:fill-rose-400" />
                      <span>{post.likes || 0}</span>
                    </button>

                    {/* Comments toggle */}
                    <button
                      onClick={() => toggleComments(post.id)}
                      className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-cyan-500 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-cyan-500" />
                      <span>{commentCount} phản hồi</span>
                      {commentsOpen ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Comments Expandable Section */}
                {commentsOpen && (
                  <div className="mt-4 pt-3 border-t border-sky-50 dark:border-cyan-950/60 space-y-3">
                    {/* Comments list */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {post.comments.map((c) => (
                          <div
                            key={c.id}
                            className="p-2.5 rounded-2xl bg-sky-50/70 dark:bg-slate-800/60 border border-sky-100 dark:border-cyan-900/40 flex items-start justify-between text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-1">
                                  {c.authorRole === 'admin' && (
                                    <Shield className="w-3 h-3 text-amber-500" />
                                  )}
                                  {c.authorName}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {formatTimeAgo(c.createdAt)}
                                </span>
                              </div>
                              <p className="mt-1 text-slate-700 dark:text-slate-300">
                                {c.content}
                              </p>
                            </div>

                            {isAdmin && onDeleteComment && (
                              <button
                                onClick={() => onDeleteComment(post.id, c.id)}
                                className="text-rose-400 hover:text-rose-600 p-1 rounded"
                                title="Xóa bình luận"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 italic py-1">
                        Chưa có phản hồi nào. Hãy viết bình luận đầu tiên!
                      </div>
                    )}

                    {/* New Comment Input */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Tên bạn..."
                        value={inputState.author}
                        onChange={(e) =>
                          handleCommentChange(post.id, 'author', e.target.value)
                        }
                        className="w-full sm:w-1/4 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 text-slate-800 dark:text-cyan-100"
                      />
                      <input
                        type="text"
                        placeholder="Viết phản hồi của bạn..."
                        value={inputState.content}
                        onChange={(e) =>
                          handleCommentChange(post.id, 'content', e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            submitComment(post.id);
                          }
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-sky-200 dark:border-cyan-800 text-slate-800 dark:text-cyan-100"
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1 shrink-0"
                      >
                        <Send className="w-3 h-3" /> Trả lời
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Chưa có bài viết nào trong diễn đàn. Hãy mở đầu làn sóng mới nhé!
          </div>
        )}
      </div>
    </div>
  );
};
