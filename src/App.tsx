import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, Heart, Users, MessageSquare, Trophy, 
  Shield, Dices, ExternalLink, Menu, X 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  Character, MusicTrack, ForumPost, Announcement, SiteStats 
} from './types';
import { getClientToken, isNewlyCreated } from './utils/helpers';
import { Sidebar } from './components/Sidebar';
import { TopStatusCards } from './components/TopStatusCards';
import { AudioPlayer } from './components/AudioPlayer';
import { CharacterCard } from './components/CharacterCard';
import { CharacterDetailModal } from './components/CharacterDetailModal';
import { RandomCharacterModal } from './components/RandomCharacterModal';
import { SearchAndFilter } from './components/SearchAndFilter';
import { LeaderboardSection } from './components/LeaderboardSection';
import { ForumSection } from './components/ForumSection';
import { AdminModal } from './components/AdminModal';
import { AnnouncementBanner } from './components/AnnouncementBanner';

export default function App() {
  // Navigation & View State
  const [currentTab, setCurrentTab] = useState<'all' | 'favorites' | 'forum' | 'leaderboard'>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Theme & Appearance
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('ocean_theme') === 'dark';
  });
  const [isCustomCursor, setIsCustomCursor] = useState<boolean>(() => {
    return localStorage.getItem('ocean_custom_cursor') !== 'false';
  });

  // Data collections
  const [characters, setCharacters] = useState<Character[]>([]);
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'clicks' | 'favorites' | 'name'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'new' | 'private' | 'public'>('all');

  // Modals
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('ocean_admin_logged') === 'true';
  });

  // Client identifier for synced favorites
  const clientToken = useMemo(() => getClientToken(), []);

  // Sync Dark mode class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ocean_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ocean_theme', 'light');
    }
  }, [isDark]);

  // Sync Custom Cursor class on <body>
  useEffect(() => {
    if (isCustomCursor) {
      document.body.classList.add('ocean-cursor');
      localStorage.setItem('ocean_custom_cursor', 'true');
    } else {
      document.body.classList.remove('ocean-cursor');
      localStorage.setItem('ocean_custom_cursor', 'false');
    }
  }, [isCustomCursor]);

  // Keyboard shortcut: Ctrl + Shift + A to open Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [charsRes, musicRes, forumRes, annRes, tagsRes, statsRes, favRes] = await Promise.all([
        fetch('/api/characters'),
        fetch('/api/music'),
        fetch('/api/forum'),
        fetch('/api/announcements'),
        fetch('/api/tags'),
        fetch('/api/stats'),
        fetch('/api/favorites', {
          headers: { 'x-client-id': clientToken }
        })
      ]);

      if (charsRes.ok) setCharacters(await charsRes.json());
      if (musicRes.ok) setMusicTracks(await musicRes.json());
      if (forumRes.ok) setForumPosts(await forumRes.json());
      if (annRes.ok) setAnnouncements(await annRes.json());
      if (tagsRes.ok) setTags(await tagsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (favRes.ok) setFavorites(await favRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [clientToken]);

  // Favorite toggle handler
  const handleToggleFavorite = async (e: React.MouseEvent, charId: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/characters/${charId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': clientToken
        }
      });
      const data = await res.json();
      if (res.ok) {
        setFavorites(data.favorites);
        setCharacters(prev =>
          prev.map(c => (c.id === charId ? { ...c, favoriteCount: data.favoriteCount } : c))
        );
        if (selectedCharacter && selectedCharacter.id === charId) {
          setSelectedCharacter(prev =>
            prev ? { ...prev, favoriteCount: data.favoriteCount } : null
          );
        }

        if (data.isFavorite) {
          confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.7 },
            colors: ['#f43f5e', '#fb7185', '#38bdf8']
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Character Click counter
  const handleCharacterClick = async (charId: string) => {
    try {
      const res = await fetch(`/api/characters/${charId}/click`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setCharacters(prev =>
          prev.map(c => (c.id === charId ? { ...c, clickCount: data.clickCount } : c))
        );
        if (selectedCharacter && selectedCharacter.id === charId) {
          setSelectedCharacter(prev =>
            prev ? { ...prev, clickCount: data.clickCount } : null
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Feedback comment to character
  const handleAddFeedback = async (charId: string, authorName: string, content: string) => {
    const res = await fetch(`/api/characters/${charId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, content })
    });
    const newFb = await res.json();
    if (res.ok) {
      setCharacters(prev =>
        prev.map(c => {
          if (c.id === charId) {
            return {
              ...c,
              feedbacks: [newFb, ...(c.feedbacks || [])]
            };
          }
          return c;
        })
      );
      if (selectedCharacter && selectedCharacter.id === charId) {
        setSelectedCharacter(prev =>
          prev ? { ...prev, feedbacks: [newFb, ...(prev.feedbacks || [])] } : null
        );
      }
    }
  };

  // Delete Feedback (Admin)
  const handleDeleteFeedback = async (charId: string, feedbackId: string) => {
    const res = await fetch(`/api/characters/${charId}/feedback/${feedbackId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      setCharacters(prev =>
        prev.map(c => {
          if (c.id === charId) {
            return {
              ...c,
              feedbacks: (c.feedbacks || []).filter(fb => fb.id !== feedbackId)
            };
          }
          return c;
        })
      );
      if (selectedCharacter && selectedCharacter.id === charId) {
        setSelectedCharacter(prev =>
          prev
            ? {
                ...prev,
                feedbacks: (prev.feedbacks || []).filter(fb => fb.id !== feedbackId)
              }
            : null
        );
      }
    }
  };

  // Forum Actions
  const handleAddForumPost = async (post: { authorName: string; authorRole: 'admin' | 'user'; title: string; content: string; tag: string }) => {
    const res = await fetch('/api/forum', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const newPost = await res.json();
    if (res.ok) {
      setForumPosts(prev => [newPost, ...prev]);
    }
  };

  const handleAddForumComment = async (postId: string, comment: { authorName: string; authorRole: 'admin' | 'user'; content: string }) => {
    const res = await fetch(`/api/forum/${postId}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    const newC = await res.json();
    if (res.ok) {
      setForumPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: [...(p.comments || []), newC] };
          }
          return p;
        })
      );
    }
  };

  const handleLikeForumPost = async (postId: string) => {
    const res = await fetch(`/api/forum/${postId}/like`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setForumPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, likes: data.likes } : p))
      );
    }
  };

  const handleDeleteForumPost = async (postId: string) => {
    const res = await fetch(`/api/forum/${postId}`, { method: 'DELETE' });
    if (res.ok) {
      setForumPosts(prev => prev.filter(p => p.id !== postId));
    }
  };

  const handleDeleteForumComment = async (postId: string, commentId: string) => {
    const res = await fetch(`/api/forum/${postId}/comment/${commentId}`, { method: 'DELETE' });
    if (res.ok) {
      setForumPosts(prev =>
        prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: (p.comments || []).filter(c => c.id !== commentId) };
          }
          return p;
        })
      );
    }
  };

  // Admin Operations
  const handleAdminLogin = async (password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    if (res.ok) {
      setIsAdmin(true);
      localStorage.setItem('ocean_admin_logged', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('ocean_admin_logged');
  };

  const handleSaveCharacter = async (char: Partial<Character>) => {
    if (char.id) {
      const res = await fetch(`/api/characters/${char.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(char)
      });
      const updated = await res.json();
      if (res.ok) {
        setCharacters(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      }
    } else {
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(char)
      });
      const created = await res.json();
      if (res.ok) {
        setCharacters(prev => [created, ...prev]);
      }
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    const res = await fetch(`/api/characters/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCharacters(prev => prev.filter(c => c.id !== id));
      if (selectedCharacter && selectedCharacter.id === id) {
        setSelectedCharacter(null);
      }
    }
  };

  const handleSaveTrack = async (track: Partial<MusicTrack>) => {
    if (track.id) {
      const res = await fetch(`/api/music/${track.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track)
      });
      const updated = await res.json();
      if (res.ok) {
        setMusicTracks(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      }
    } else {
      const res = await fetch('/api/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(track)
      });
      const created = await res.json();
      if (res.ok) {
        setMusicTracks(prev => [...prev, created]);
      }
    }
  };

  const handleDeleteTrack = async (id: string) => {
    const res = await fetch(`/api/music/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMusicTracks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleSaveAnnouncement = async (ann: Partial<Announcement>) => {
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ann)
    });
    const created = await res.json();
    if (res.ok) {
      setAnnouncements(prev => [created, ...prev]);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleAddTag = async (tag: string) => {
    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag })
    });
    const list = await res.json();
    if (res.ok) {
      setTags(list);
    }
  };

  const handleDeleteTag = async (tag: string) => {
    const res = await fetch(`/api/tags/${encodeURIComponent(tag)}`, { method: 'DELETE' });
    const list = await res.json();
    if (res.ok) {
      setTags(list);
      if (selectedTag === tag) setSelectedTag(null);
    }
  };

  // Top 3 Hot by clicks (for badge rendering)
  const top3HotIds = useMemo(() => {
    return [...characters]
      .sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0))
      .slice(0, 3)
      .map(c => c.id);
  }, [characters]);

  // Filtered & Sorted Characters
  const displayedCharacters = useMemo(() => {
    let list = [...characters];

    if (currentTab === 'favorites') {
      list = list.filter(c => favorites.includes(c.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        (c.shortDescription && c.shortDescription.toLowerCase().includes(q)) ||
        (c.tags && c.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    if (selectedTag) {
      list = list.filter(c => c.tags && c.tags.includes(selectedTag));
    }

    if (filterType === 'new') {
      list = list.filter(c => isNewlyCreated(c.createdAt));
    } else if (filterType === 'private') {
      list = list.filter(c => c.isPrivate);
    } else if (filterType === 'public') {
      list = list.filter(c => !c.isPrivate);
    }

    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'clicks') {
      list.sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
    } else if (sortBy === 'favorites') {
      list.sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }

    return list;
  }, [characters, currentTab, favorites, searchQuery, selectedTag, filterType, sortBy]);

  const currentSongTitle = musicTracks.length > 0 ? musicTracks[0].title : 'Ocean Waves Lofi';

  return (
    <div
      className={`min-h-screen bg-ocean-pattern transition-colors duration-300 flex flex-col lg:flex-row ${
        isDark ? 'text-slate-100' : 'text-slate-800'
      }`}
    >
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/90 dark:bg-[#0b1523]/90 border-b border-[#d8eaf8] dark:border-[#192b45] backdrop-blur-md sticky top-0 z-30">
        <div
          onClick={() => setCurrentTab('all')}
          className="flex items-center gap-1 cursor-pointer font-['Caveat',cursive] text-3xl font-bold text-slate-800 dark:text-sky-100"
        >
          OceanArt<span className="text-[#3874cb]">✦</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRandomModalOpen(true)}
            className="p-2 rounded-xl bg-amber-50 text-amber-500 font-bold text-xs"
            title="Quay nhân vật hôm nay"
          >
            🎲
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-sky-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-72 bg-white dark:bg-[#0b1523] h-full shadow-2xl p-4 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Sidebar
              currentTab={currentTab}
              setCurrentTab={(t) => {
                setCurrentTab(t);
                setIsMobileMenuOpen(false);
              }}
              favoritesCount={favorites.length}
              onOpenRandom={() => {
                setIsRandomModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              onOpenAdmin={() => {
                setIsAdminModalOpen(true);
                setIsMobileMenuOpen(false);
              }}
              isAdmin={isAdmin}
              isDark={isDark}
              toggleDark={() => setIsDark(!isDark)}
              isCustomCursor={isCustomCursor}
              toggleCustomCursor={() => setIsCustomCursor(!isCustomCursor)}
            />
          </div>
        </div>
      )}

      {/* Left Sidebar (Matching Reference Screenshot QiaoArt Left Bar) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          favoritesCount={favorites.length}
          onOpenRandom={() => setIsRandomModalOpen(true)}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          isAdmin={isAdmin}
          isDark={isDark}
          toggleDark={() => setIsDark(!isDark)}
          isCustomCursor={isCustomCursor}
          toggleCustomCursor={() => setIsCustomCursor(!isCustomCursor)}
        />
      </div>

      {/* Right Main Gallery Area (Matching Reference Screenshot Layout) */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl mx-auto w-full">
        {/* Top Header Row matching "A selection of original & commissioned illustrations ✦" */}
        <div className="flex items-center justify-between pb-4 mb-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="font-medium italic tracking-wide flex items-center gap-1.5">
            <span>A selection of original & deep sea characters</span>
            <span className="text-[#3874cb]">✦</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-[#122238] border border-[#d6e7f7] dark:border-[#1e3556] text-slate-700 dark:text-slate-300 shadow-sm">
              VI • Ocean
            </span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white dark:bg-[#122238] border border-[#d6e7f7] dark:border-[#1e3556] text-slate-700 dark:text-slate-300 hover:text-[#3874cb] transition shadow-sm flex items-center gap-1"
              title="Admin Control"
            >
              <Shield className="w-3 h-3 text-amber-500" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Announcement Banner if any */}
        <AnnouncementBanner
          announcements={announcements}
          isDark={isDark}
        />

        {/* Top 4 Horizontal Status / Metric Cards (Exact match of reference screenshot!) */}
        <TopStatusCards
          totalCharacters={characters.length}
          totalClicks={characters.reduce((s, c) => s + (c.clickCount || 0), 0)}
          currentSongTitle={currentSongTitle}
          isDark={isDark}
        />

        {/* LEADERBOARD VIEW */}
        {currentTab === 'leaderboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100 dark:border-cyan-900/40">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-sky-100 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-amber-500" />
                  Bảng Vinh Danh Đại Dương
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Xếp hạng các nhân vật được săn đón và thả tim nhiều nhất từ người dùng
                </p>
              </div>

              <button
                onClick={() => setCurrentTab('all')}
                className="px-4 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-[#d6e7f7] text-[#3874cb] font-bold text-xs shadow-sm hover:bg-sky-50 transition"
              >
                &larr; Xem tất cả hồ sơ
              </button>
            </div>

            <LeaderboardSection
              characters={characters}
              onSelectCharacter={(c) => setSelectedCharacter(c)}
              isDark={isDark}
            />
          </div>
        )}

        {/* FORUM VIEW */}
        {currentTab === 'forum' && (
          <div className="space-y-6">
            <ForumSection
              posts={forumPosts}
              onAddPost={handleAddForumPost}
              onAddComment={handleAddForumComment}
              onLikePost={handleLikeForumPost}
              onDeletePost={isAdmin ? handleDeleteForumPost : undefined}
              onDeleteComment={isAdmin ? handleDeleteForumComment : undefined}
              isAdmin={isAdmin}
              isDark={isDark}
            />
          </div>
        )}

        {/* MAIN CHARACTER GALLERY VIEW (ALL / FAVORITES) */}
        {(currentTab === 'all' || currentTab === 'favorites') && (
          <div>
            {/* Favorites Header if active */}
            {currentTab === 'favorites' && (
              <div className="p-4 rounded-2xl bg-white dark:bg-[#122238] border border-rose-200 dark:border-rose-900/40 shadow-sm flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-rose-500 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 fill-current" />
                    Bộ Sưu Tập Yêu Thích Của Bạn ({favorites.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Được đồng bộ riêng theo thiết bị / IP của bạn.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentTab('all')}
                  className="px-3 py-1 rounded-xl bg-rose-50 text-rose-600 text-xs font-bold hover:bg-rose-100 transition"
                >
                  Quay lại tất cả
                </button>
              </div>
            )}

            {/* Horizontal Filter Pill Row matching [全部] [半身] [头像] [胸像] in screenshot */}
            <SearchAndFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              availableTags={tags}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterType={filterType}
              setFilterType={setFilterType}
              totalCount={currentTab === 'favorites' ? favorites.length : characters.length}
              filteredCount={displayedCharacters.length}
              isDark={isDark}
            />

            {/* Character Cards Gallery Grid matching polaroid illustrations in screenshot */}
            {displayedCharacters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6">
                {displayedCharacters.map((char) => {
                  const isHot = top3HotIds.includes(char.id);
                  const hotRank = isHot ? top3HotIds.indexOf(char.id) + 1 : undefined;

                  return (
                    <CharacterCard
                      key={char.id}
                      character={char}
                      isFavorite={favorites.includes(char.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={(c) => setSelectedCharacter(c)}
                      isDark={isDark}
                      isHot={isHot}
                      hotRank={hotRank}
                    />
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div className="py-20 text-center space-y-3 bg-white/60 dark:bg-[#122238]/60 rounded-3xl border border-[#d6e7f7] dark:border-[#1e3556] p-8">
                <div className="text-5xl animate-bounce">🌊</div>
                <h3 className="text-base font-bold text-slate-800 dark:text-sky-100">
                  {currentTab === 'favorites'
                    ? 'Bạn chưa lưu nhân vật nào vào mục yêu thích!'
                    : 'Không tìm thấy hồ sơ phù hợp với bộ lọc!'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {currentTab === 'favorites'
                    ? 'Nhấn vào biểu tượng trái tim trên thẻ nhân vật để thêm vào danh sách yêu thích nha.'
                    : 'Hãy thử tìm bằng từ khóa khác hoặc bấm đặt lại bộ lọc.'}
                </p>
                <button
                  onClick={() => {
                    setCurrentTab('all');
                    setSearchQuery('');
                    setSelectedTag(null);
                    setFilterType('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-[#3874cb] text-white text-xs font-bold shadow-md hover:bg-[#2f63ae] transition"
                >
                  Xem Tất Cả Nhân Vật
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Audio Player (Always Visible, matching ocean lofi vibe) */}
      <AudioPlayer
        tracks={musicTracks}
        isDark={isDark}
      />

      {/* MODAL 1: Character Detail & Feedback */}
      {selectedCharacter && (
        <CharacterDetailModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
          isFavorite={favorites.includes(selectedCharacter.id)}
          onToggleFavorite={handleToggleFavorite}
          onAddFeedback={handleAddFeedback}
          onDeleteFeedback={isAdmin ? handleDeleteFeedback : undefined}
          onCharacterClick={handleCharacterClick}
          isAdmin={isAdmin}
          isDark={isDark}
        />
      )}

      {/* MODAL 2: Gacha / Random Character of the Day */}
      {isRandomModalOpen && (
        <RandomCharacterModal
          characters={characters}
          onClose={() => setIsRandomModalOpen(false)}
          onSelectCharacter={(c) => setSelectedCharacter(c)}
          isDark={isDark}
        />
      )}

      {/* MODAL 3: Admin Dashboard */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        isAdmin={isAdmin}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        characters={characters}
        onSaveCharacter={handleSaveCharacter}
        onDeleteCharacter={handleDeleteCharacter}
        musicTracks={musicTracks}
        onSaveTrack={handleSaveTrack}
        onDeleteTrack={handleDeleteTrack}
        announcements={announcements}
        onSaveAnnouncement={handleSaveAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
        tags={tags}
        onAddTag={handleAddTag}
        onDeleteTag={handleDeleteTag}
        stats={stats}
        forumPosts={forumPosts}
        onDeleteForumPost={handleDeleteForumPost}
        onDeleteFeedback={handleDeleteFeedback}
        isDark={isDark}
      />
    </div>
  );
}
