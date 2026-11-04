import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import { MusicTrack } from '../types';

interface AudioPlayerProps {
  tracks: MusicTrack[];
  isDark: boolean;
}

let singletonAudioElement: HTMLAudioElement | null = null;
let autoplayInitDone = false;
let autoplayUnlocked = false;
let lastUnlockTimestamp = 0;

function getSingletonAudioElement(): HTMLAudioElement {
  if (!singletonAudioElement) {
    const existing = document.getElementById('audio-engine') as HTMLAudioElement | null;
    singletonAudioElement = existing || new Audio();
    singletonAudioElement.preload = 'auto';
  }
  return singletonAudioElement;
}

function extractDriveFileId(rawUrl?: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (!/(?:drive\.google\.com|drive\.usercontent\.google\.com|docs\.google\.com)/i.test(trimmed)) {
    return null;
  }
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i) || trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/i);
  if (fileMatch && fileMatch[1]) return fileMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (idMatch && idMatch[1]) return idMatch[1];
  return null;
}

function convertDropboxAudioUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!/dropbox\.com/i.test(trimmed)) return trimmed;
  try {
    const parsed = new URL(trimmed);
    parsed.hostname = 'dl.dropboxusercontent.com';
    parsed.host = 'dl.dropboxusercontent.com';
    if (parsed.searchParams.get('dl') === '0') {
      parsed.searchParams.delete('dl');
    }
    if (!parsed.searchParams.has('raw')) {
      parsed.searchParams.set('raw', '1');
    }
    const converted = parsed.toString();
    console.log('[Music] URL gốc:', trimmed, '| URL sau khi chuyển:', converted);
    return converted;
  } catch {
    let converted = trimmed
      .replace(/^(https?:\/\/)?(www\.)?dropbox\.com/i, 'https://dl.dropboxusercontent.com')
      .replace(/([?&])dl=0(&|$)/i, (_match, p1, p2) => (p2 === '&' ? p1 : ''));
    if (!/[?&]raw=1\b/i.test(converted)) {
      converted += (converted.includes('?') ? '&' : '?') + 'raw=1';
    }
    console.log('[Music] URL gốc:', trimmed, '| URL sau khi chuyển:', converted);
    return converted;
  }
}

function buildCandidateUrls(track: MusicTrack | null): { urls: string[]; isDrive: boolean } {
  if (!track) return { urls: [], isDrive: false };
  const urls: string[] = [];
  const addUnique = (u: string) => {
    if (u && !urls.includes(u)) urls.push(u);
  };

  const storageUrl = (track.storage_url || '').trim();
  if (storageUrl) {
    const sId = extractDriveFileId(storageUrl);
    if (sId) {
      addUnique(`https://drive.google.com/uc?export=download&id=${sId}`);
      addUnique(`https://drive.usercontent.google.com/download?id=${sId}&export=download&confirm=t`);
    } else if (/dropbox\.com/i.test(storageUrl)) {
      addUnique(convertDropboxAudioUrl(storageUrl));
    } else {
      addUnique(storageUrl);
    }
  }

  const rawUrl = (track.url || '').trim();
  const driveId = extractDriveFileId(rawUrl);
  if (driveId) {
    addUnique(`https://drive.google.com/uc?export=download&id=${driveId}`);
    addUnique(`https://drive.usercontent.google.com/download?id=${driveId}&export=download&confirm=t`);
  } else if (/dropbox\.com/i.test(rawUrl)) {
    addUnique(convertDropboxAudioUrl(rawUrl));
  } else if (rawUrl) {
    addUnique(rawUrl);
  }

  return { urls, isDrive: Boolean(driveId || extractDriveFileId(storageUrl)) };
}

function fisherYatesShuffle<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ tracks, isDark }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(getSingletonAudioElement());
  const candidatesRef = useRef<string[]>([]);
  const candidateIdxRef = useRef<number>(0);
  const isDriveRef = useRef<boolean>(false);
  const wantsToPlayRef = useRef<boolean>(false);
  const isClearingSrcRef = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  const shuffleQueueRef = useRef<string[]>([]);
  const playHistoryRef = useRef<string[]>([]);
  const knownTrackIdsRef = useRef<Set<string>>(new Set());
  const failedTrackIdsRef = useRef<Set<string>>(new Set());
  const currentTrackIdRef = useRef<string | null>(null);
  const initialRandomPickedRef = useRef<boolean>(false);

  const currentTrack = tracks[currentTrackIndex] || null;

  const refillShuffleQueue = useCallback((lastPlayedId: string | null) => {
    if (tracks.length === 0) {
      shuffleQueueRef.current = [];
      knownTrackIdsRef.current = new Set();
      return;
    }
    const allIds = tracks.map((t) => t.id);
    knownTrackIdsRef.current = new Set(allIds);
    const shuffled = fisherYatesShuffle(allIds);
    if (shuffled.length >= 2 && lastPlayedId && shuffled[0] === lastPlayedId) {
      const swapIdx = 1 + Math.floor(Math.random() * (shuffled.length - 1));
      const tmp = shuffled[0];
      shuffled[0] = shuffled[swapIdx];
      shuffled[swapIdx] = tmp;
    }
    shuffleQueueRef.current = shuffled;
  }, [tracks]);

  const syncQueueWithTracks = useCallback(() => {
    const validIds = new Set(tracks.map((t) => t.id));
    shuffleQueueRef.current = shuffleQueueRef.current.filter((id) => validIds.has(id));
    playHistoryRef.current = playHistoryRef.current.filter((id) => validIds.has(id));
    Array.from(failedTrackIdsRef.current).forEach((id) => {
      if (!validIds.has(id)) failedTrackIdsRef.current.delete(id);
    });
    Array.from(knownTrackIdsRef.current).forEach((id) => {
      if (!validIds.has(id)) knownTrackIdsRef.current.delete(id);
    });

    tracks.forEach((t) => {
      if (!knownTrackIdsRef.current.has(t.id)) {
        knownTrackIdsRef.current.add(t.id);
        if (t.id !== currentTrackIdRef.current && !shuffleQueueRef.current.includes(t.id)) {
          const randPos = Math.floor(Math.random() * (shuffleQueueRef.current.length + 1));
          shuffleQueueRef.current.splice(randPos, 0, t.id);
        }
      }
    });
  }, [tracks]);

  useEffect(() => {
    if (tracks.length === 0) return;
    if (!initialRandomPickedRef.current) {
      initialRandomPickedRef.current = true;
      refillShuffleQueue(null);
      const firstId = shuffleQueueRef.current.shift() || tracks[0].id;
      currentTrackIdRef.current = firstId;
      playHistoryRef.current = [firstId];
      const idx = tracks.findIndex((t) => t.id === firstId);
      setCurrentTrackIndex(idx !== -1 ? idx : 0);
      return;
    }
    syncQueueWithTracks();
    if (currentTrackIdRef.current) {
      const newIdx = tracks.findIndex((t) => t.id === currentTrackIdRef.current);
      if (newIdx !== -1 && newIdx !== currentTrackIndex) {
        setCurrentTrackIndex(newIdx);
      } else if (newIdx === -1) {
        if (shuffleQueueRef.current.length === 0) refillShuffleQueue(null);
        const nextId = shuffleQueueRef.current.shift() || tracks[0].id;
        currentTrackIdRef.current = nextId;
        playHistoryRef.current.push(nextId);
        const fallbackIdx = tracks.findIndex((t) => t.id === nextId);
        setCurrentTrackIndex(fallbackIdx !== -1 ? fallbackIdx : 0);
      }
    }
  }, [tracks, currentTrackIndex, refillShuffleQueue, syncQueueWithTracks]);

  const clearLoadTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleNext = useCallback((e?: React.SyntheticEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (tracks.length === 0) return;
    failedTrackIdsRef.current.clear();
    wantsToPlayRef.current = true;

    if (tracks.length === 1) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      setCurrentTime(0);
      audio.play().catch(() => {});
      return;
    }

    syncQueueWithTracks();
    if (shuffleQueueRef.current.length === 0) {
      refillShuffleQueue(currentTrackIdRef.current);
    }
    const nextId = shuffleQueueRef.current.shift() || tracks[0].id;
    currentTrackIdRef.current = nextId;
    if (playHistoryRef.current[playHistoryRef.current.length - 1] !== nextId) {
      playHistoryRef.current.push(nextId);
    }
    const nextIdx = tracks.findIndex((t) => t.id === nextId);
    setCurrentTrackIndex(nextIdx !== -1 ? nextIdx : 0);
  }, [tracks, refillShuffleQueue, syncQueueWithTracks]);

  const handlePrev = useCallback((e?: React.SyntheticEvent) => {
    if (e && 'stopPropagation' in e) e.stopPropagation();
    if (tracks.length === 0) return;
    failedTrackIdsRef.current.clear();
    syncQueueWithTracks();
    wantsToPlayRef.current = true;

    if (playHistoryRef.current.length > 1) {
      const poppedId = playHistoryRef.current.pop();
      const prevId = playHistoryRef.current[playHistoryRef.current.length - 1];
      if (poppedId && poppedId !== prevId) {
        shuffleQueueRef.current = [
          poppedId,
          ...shuffleQueueRef.current.filter((id) => id !== poppedId),
        ];
      }
      currentTrackIdRef.current = prevId;
      const prevIdx = tracks.findIndex((t) => t.id === prevId);
      if (prevIdx !== -1) {
        setCurrentTrackIndex(prevIdx);
        return;
      }
    }

    const audio = audioRef.current;
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().catch(() => {});
  }, [tracks, syncQueueWithTracks]);

  const handleSelectTrackFromList = useCallback((idx: number) => {
    if (idx < 0 || idx >= tracks.length) return;
    syncQueueWithTracks();
    failedTrackIdsRef.current.clear();
    const chosen = tracks[idx];
    shuffleQueueRef.current = shuffleQueueRef.current.filter((id) => id !== chosen.id);
    currentTrackIdRef.current = chosen.id;
    if (playHistoryRef.current[playHistoryRef.current.length - 1] !== chosen.id) {
      playHistoryRef.current.push(chosen.id);
    }
    wantsToPlayRef.current = true;
    setCurrentTrackIndex(idx);
  }, [tracks, syncQueueWithTracks]);

  const skipBrokenTrackOrStop = useCallback((fallbackErrMsg: string) => {
    if (currentTrackIdRef.current) {
      failedTrackIdsRef.current.add(currentTrackIdRef.current);
      if (playHistoryRef.current[playHistoryRef.current.length - 1] === currentTrackIdRef.current) {
        playHistoryRef.current.pop();
      }
    }
    const allFailed = tracks.length === 0 || tracks.every((t) => failedTrackIdsRef.current.has(t.id));
    if (!allFailed && tracks.length > 1) {
      syncQueueWithTracks();
      let nextId: string | undefined = shuffleQueueRef.current.find((id) => !failedTrackIdsRef.current.has(id));
      if (!nextId) {
        refillShuffleQueue(currentTrackIdRef.current);
        nextId = shuffleQueueRef.current.find((id) => !failedTrackIdsRef.current.has(id));
      }
      if (nextId) {
        shuffleQueueRef.current = shuffleQueueRef.current.filter((id) => id !== nextId);
        currentTrackIdRef.current = nextId;
        playHistoryRef.current.push(nextId);
        const nextIdx = tracks.findIndex((t) => t.id === nextId);
        if (nextIdx !== -1) {
          setCurrentTrackIndex(nextIdx);
          return;
        }
      }
    }
    wantsToPlayRef.current = false;
    failedTrackIdsRef.current.clear();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setErrorMessage(fallbackErrMsg);
  }, [tracks, refillShuffleQueue, syncQueueWithTracks]);

  const assignCandidate = useCallback((idx: number, trackObj: MusicTrack | null) => {
    const audio = audioRef.current;
    clearLoadTimeout();
    if (idx < 0 || idx >= candidatesRef.current.length) return false;
    candidateIdxRef.current = idx;
    const nextUrl = candidatesRef.current[idx];
    isClearingSrcRef.current = false;
    audio.src = nextUrl;
    audio.load();

    console.log('[Music] URL gốc:', trackObj?.url || '', trackObj?.storage_url ? `(storage_url: ${trackObj.storage_url})` : '');
    console.log('[Music] URL đã chuyển đổi:', candidatesRef.current);
    console.log('[Music] audio.src thực tế:', audio.src);

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      if (audio.readyState < 1) {
        console.log('[Music] Timeout 12s | audio.src thực tế:', audio.currentSrc || audio.src, '| audio.error.code:', audio.error ? audio.error.code : 'TIMEOUT');
        if (candidateIdxRef.current + 1 < candidatesRef.current.length) {
          assignCandidate(candidateIdxRef.current + 1, trackObj);
          if (wantsToPlayRef.current) {
            audio.play().catch(() => {});
          }
        } else {
          skipBrokenTrackOrStop(
            isDriveRef.current
              ? "Google Drive không trả về dữ liệu âm thanh. Hãy kiểm tra file đã chia sẻ 'Bất kỳ ai có đường liên kết', file không quá lớn, hoặc dùng link MP3 trực tiếp."
              : 'Quá thời gian chờ 12 giây nhưng không tải được âm thanh.'
          );
        }
      }
    }, 12000);
    return true;
  }, [clearLoadTimeout, skipBrokenTrackOrStop]);

  const playCurrent = useCallback((isAutoplay = false) => {
    const audio = audioRef.current;
    wantsToPlayRef.current = true;
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        clearLoadTimeout();
        failedTrackIdsRef.current.clear();
        setErrorMessage(null);
      }).catch((err: any) => {
        const name = err?.name || '';
        if (name === 'AbortError') return;
        if (name === 'NotAllowedError') {
          setIsPlaying(false);
          return;
        }
        const code = audio.error ? audio.error.code : 4;
        console.log('[Music] Lỗi play() | audio.src thực tế:', audio.currentSrc || audio.src, '| audio.error.code:', code);
        if (name === 'NotSupportedError' || !isAutoplay) {
          if (candidateIdxRef.current + 1 < candidatesRef.current.length) {
            assignCandidate(candidateIdxRef.current + 1, currentTrack);
            playCurrent(false);
          } else {
            skipBrokenTrackOrStop(
              isDriveRef.current
                ? "Google Drive không trả về dữ liệu âm thanh. Hãy kiểm tra file đã chia sẻ 'Bất kỳ ai có đường liên kết', file không quá lớn, hoặc dùng link MP3 trực tiếp."
                : `Không thể phát nguồn nhạc (mã lỗi ${code}).`
            );
          }
        }
      });
    }
  }, [assignCandidate, clearLoadTimeout, currentTrack, skipBrokenTrackOrStop]);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    const onLoadedMetadata = () => {
      clearLoadTimeout();
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
    };
    const onCanPlay = () => {
      clearLoadTimeout();
      failedTrackIdsRef.current.clear();
      setErrorMessage(null);
    };
    const onPlaying = () => {
      clearLoadTimeout();
      failedTrackIdsRef.current.clear();
      setErrorMessage(null);
      setIsPlaying(true);
    };
    const onPause = () => {
      setIsPlaying(false);
    };
    const onTimeUpdate = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
      setDuration(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
    };
    const onEnded = () => {
      handleNext();
    };
    const onError = () => {
      const attrSrc = audio.getAttribute('src');
      if (isClearingSrcRef.current || !attrSrc || attrSrc.trim() === '') return;
      clearLoadTimeout();
      const code = audio.error ? audio.error.code : 0;
      console.log('[Music] Sự kiện audio error | audio.src thực tế:', audio.currentSrc || audio.src, '| audio.error.code:', code);
      if (candidateIdxRef.current + 1 < candidatesRef.current.length) {
        assignCandidate(candidateIdxRef.current + 1, currentTrack);
        if (wantsToPlayRef.current) {
          playCurrent(false);
        }
      } else {
        skipBrokenTrackOrStop(
          isDriveRef.current
            ? "Google Drive không trả về dữ liệu âm thanh. Hãy kiểm tra file đã chia sẻ 'Bất kỳ ai có đường liên kết', file không quá lớn, hoặc dùng link MP3 trực tiếp."
            : `Không thể phát nguồn nhạc (mã lỗi ${code}).`
        );
      }
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [assignCandidate, clearLoadTimeout, currentTrack, handleNext, playCurrent, skipBrokenTrackOrStop]);

  useEffect(() => {
    if (!currentTrack || !initialRandomPickedRef.current) return;
    currentTrackIdRef.current = currentTrack.id;
    setCurrentTime(0);
    setDuration(0);
    setErrorMessage(null);

    const built = buildCandidateUrls(currentTrack);
    candidatesRef.current = built.urls;
    isDriveRef.current = built.isDrive;
    candidateIdxRef.current = 0;

    if (built.urls.length > 0) {
      assignCandidate(0, currentTrack);
      if (!autoplayInitDone) {
        autoplayInitDone = true;
        wantsToPlayRef.current = true;
        playCurrent(true);
      } else if (wantsToPlayRef.current) {
        playCurrent(false);
      }
    }
  }, [currentTrackIndex, tracks, assignCandidate, currentTrack, playCurrent]);

  useEffect(() => {
    if (autoplayUnlocked || tracks.length === 0) return;
    const events = ['pointerup', 'mousedown', 'keydown', 'touchend', 'click'];
    const removeAll = () => {
      events.forEach((ev) => window.removeEventListener(ev, onFirstGesture, true));
    };
    const onFirstGesture = () => {
      if (autoplayUnlocked) {
        removeAll();
        return;
      }
      const audio = audioRef.current;
      if (!audio.paused) {
        autoplayUnlocked = true;
        removeAll();
        return;
      }
      lastUnlockTimestamp = Date.now();
      audio.play().then(() => {
        autoplayUnlocked = true;
        lastUnlockTimestamp = Date.now();
        removeAll();
      }).catch((err: any) => {
        if (err?.name === 'NotAllowedError') return;
        autoplayUnlocked = true;
        removeAll();
      });
    };
    events.forEach((ev) => window.addEventListener(ev, onFirstGesture, true));
    return () => removeAll();
  }, [tracks.length]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const audio = audioRef.current;
    if (lastUnlockTimestamp && Date.now() - lastUnlockTimestamp < 450 && !audio.paused) {
      lastUnlockTimestamp = 0;
      return;
    }
    autoplayUnlocked = true;
    if (!audio.paused && !audio.ended) {
      wantsToPlayRef.current = false;
      audio.pause();
    } else {
      failedTrackIdsRef.current.clear();
      playCurrent(false);
    }
  };

  const formatSeconds = (sec: number) => {
    if (!Number.isFinite(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentTrack) return null;

  return (
    <>
      {/* Floating Bottom Left Ocean Music Widget */}
      <div className="fixed bottom-5 left-5 z-40 transition-all duration-300">
        <div
          className={`relative rounded-3xl shadow-xl transition-all duration-300 ${
            isDark
              ? 'bg-sky-950/90 text-cyan-100 border border-cyan-500/30 shadow-cyan-950/50'
              : 'bg-white/90 text-cyan-900 border border-sky-200 shadow-sky-200/50'
          } backdrop-blur-md`}
        >
          {/* Main Mini Controller Bar */}
          <div className="flex items-center gap-3 p-2.5 px-4">
            {/* Spinning Pearl / Vinyl Disc */}
            <div
              onClick={() => setIsExpanded(!isExpanded)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform duration-300 ${
                isPlaying ? 'animate-spin' : ''
              } bg-gradient-to-tr from-cyan-400 via-sky-300 to-indigo-300 shadow-md`}
              style={{ animationDuration: '6s' }}
              title="Nhấn để mở rộng trình phát nhạc"
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-inner">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-700"></div>
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </div>

            {/* Song title info */}
            <div
              className="cursor-pointer max-w-[140px] sm:max-w-[180px] overflow-hidden"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <div className="text-xs font-bold truncate flex items-center gap-1">
                <Music className="w-3 h-3 text-cyan-500 inline-block shrink-0" />
                <span className="truncate">{currentTrack.title}</span>
              </div>
              <div className="text-[10px] opacity-75 truncate" title={errorMessage || currentTrack.artist}>
                {errorMessage || currentTrack.artist}
              </div>
            </div>

            {/* Quick Play/Pause & Next Button */}
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm transition active:scale-95"
                title={isPlaying ? 'Tạm dừng' : 'Phát nhạc'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 transition"
                title="Bài tiếp theo"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 ml-1"
                title={isExpanded ? 'Thu gọn' : 'Chi tiết'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Drawer */}
          {isExpanded && (
            <div className="p-4 pt-1 border-t border-cyan-500/20 w-72 sm:w-80">
              {/* Progress Slider */}
              <div className="my-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Number(e.target.value);
                      setCurrentTime(Number(e.target.value));
                    }
                  }}
                  className="w-full h-1.5 bg-cyan-200 dark:bg-cyan-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] opacity-70 mt-1">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Extended Controls */}
              <div className="flex items-center justify-between mt-2">
                {/* Volume Slider */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-cyan-600 dark:text-cyan-300 hover:opacity-80"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(Number(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 bg-cyan-200 dark:bg-cyan-900 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>

                {/* Prev / Play / Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="p-1 hover:text-cyan-500 transition"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center hover:bg-cyan-600 transition shadow"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <button
                    onClick={handleNext}
                    className="p-1 hover:text-cyan-500 transition"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Playlist Toggle */}
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition ${
                    showPlaylist
                      ? 'bg-cyan-500 text-white'
                      : 'hover:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300'
                  }`}
                  title="Danh sách bài hát"
                >
                  <ListMusic className="w-4 h-4" />
                </button>
              </div>

              {/* Playlist items */}
              {showPlaylist && (
                <div className="mt-3 max-h-40 overflow-y-auto space-y-1 pr-1 border-t border-cyan-500/10 pt-2 text-xs">
                  {tracks.map((t, idx) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTrackFromList(idx)}
                      className={`flex items-center justify-between p-1.5 px-2 rounded-xl cursor-pointer transition ${
                        currentTrackIndex === idx
                          ? 'bg-cyan-500/20 font-bold text-cyan-600 dark:text-cyan-300'
                          : 'hover:bg-cyan-500/10 opacity-80'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {idx + 1}. {t.title}
                      </span>
                      <span className="text-[10px] shrink-0 opacity-60">{t.duration || '03:00'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
