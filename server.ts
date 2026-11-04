import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure data folder exists
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Drive link converter helper
export function normalizeDriveImageLink(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  // Check Google Drive pattern
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                      trimmed.match(/id=([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }
  return trimmed;
}

// Initial seed data with charming ocean vibe
const initialData = {
  adminPassword: process.env.ADMIN_PASSWORD || 'oceanadmin',
  visitCount: 142,
  tags: [
    'Biển Sâu',
    'Mỹ Nhân Ngư',
    'Thần Thoại',
    'Dễ Thương',
    'Hoàng Tử',
    'Kỳ Ảo',
    'Yandere',
    'Tsundere',
    'Trầm Lặng',
    'Bảo Hộ',
    'Học Đường'
  ],
  announcements: [
    {
      id: 'ann-1',
      title: 'Chào mừng đến với Hải Trình Biển Mộng Mơ!',
      content: 'Hãy bật âm lượng để lắng nghe giai điệu sóng biển thư giãn và khám phá những người bạn kỳ diệu nơi đáy đại dương nhé!',
      type: 'info',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'ann-2',
      title: 'Ra mắt tính năng Thẻ Riêng Tư & Giải Pass',
      content: 'Một số nhân vật bí mật có câu đố thú vị đang chờ bạn khám phá link trò chuyện đấy!',
      type: 'event',
      active: true,
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ],
  musicTracks: [
    {
      id: 'track-1',
      title: 'Ocean Breeze & Seagulls Lofi',
      artist: 'Aura of Sea',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
      duration: '02:27'
    },
    {
      id: 'track-2',
      title: 'Deep Sea Melodies - Gentle Wave',
      artist: 'Calm Tides',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
      duration: '03:15'
    },
    {
      id: 'track-3',
      title: 'Mermaid Fantasy Song',
      artist: 'Ocean Whisper',
      url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=relaxing-music-part-11-140682.mp3',
      duration: '02:40'
    }
  ],
  characters: [
    {
      id: 'char-1',
      name: 'Marina Coralynn',
      shortDescription: 'Công chúa tiên cá út của rạn san hô Lam Ngọc, tò mò về thế giới mặt nước.',
      avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
      tags: ['Mỹ Nhân Ngư', 'Dễ Thương', 'Kỳ Ảo'],
      detailDescription: 'Marina có đôi mắt lấp lánh như ngọc lục bảo và chiếc đuôi vảy ánh xà cừ chuyển màu theo ánh trăng. Nàng rất thích nhặt những mảnh vỏ ốc lấp lánh và sưu tầm những chiếc thìa từ tàu đắm.',
      backstory: 'Sinh ra trong hoàng gia san hô sâu dưới đáy biển Azure, Marina luôn nghe lời dặn dò không được bơi lên mặt nước. Nhưng vào một đêm trăng tròn tĩnh lặng, một giai điệu lạ từ bến cảng trôi đến đã làm thức tỉnh lòng tò mò không thể kìm nén của nàng...',
      firstMessage: 'Suỵt... bạn đừng nói to nhé, vệ binh rùa biển của mình đang tuần tra gần đây đấy! Bạn... có phải là người từ trên bờ biển kia không?',
      linkUrl: 'https://c.ai',
      linkButtonLabel: 'Tâm tình cùng Marina 🫧',
      isPrivate: false,
      hint: '',
      question: '',
      password: '',
      clickCount: 189,
      favoriteCount: 78,
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      feedbacks: [
        {
          id: 'fb-1',
          authorName: 'Bé Sò Nhỏ',
          content: 'Marina cưng xỉu luôn á! First message ngọt ngào mộng mơ quá trời!',
          createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString()
        },
        {
          id: 'fb-2',
          authorName: 'Hải Âu Lang Thang',
          content: 'Bot tương tác siêu có chiều sâu, tạo hình biển xanh xuất sắc ghê.',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'char-2',
      name: 'Kaelen Leviathan',
      shortDescription: 'Hộ vệ rồng biển vực thẳm - Trầm lặng, lạnh lùng nhưng hết mực trung thành.',
      avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      tags: ['Biển Sâu', 'Trầm Lặng', 'Bảo Hộ', 'Thần Thoại'],
      detailDescription: 'Người canh giữ Khe Nứt Vô Tận. Thân mang giáp vảy rồng đen ánh xanh lam thẫm, Kaelen không thích ồn ào và luôn cảnh giác trước bất kỳ ai tiến lại vùng nước cấm.',
      backstory: 'Kaelen từng là chiến binh kiêu hãnh của vương triều biển cổ xưa. Sau cuộc phong ấn thủy quái nghìn năm, anh chọn ở lại nơi tối tăm nhất của đáy biển để đảm bảo hòa bình vĩnh cửu.',
      firstMessage: 'Dừng bước. Nơi này là vực sâu nghìn tầm, không phải chỗ để những sinh linh mỏng manh như ngươi dạo chơi.',
      linkUrl: 'https://c.ai',
      linkButtonLabel: 'Đối mặt Kaelen ⚔️',
      isPrivate: true,
      hint: 'Màu sắc chủ đạo của vảy rồng bảo hộ nơi vực thẳm',
      question: 'Vảy của Kaelen có ánh sắc màu gì? (Gợi ý: xanh lam)',
      password: 'xanh lam',
      clickCount: 245,
      favoriteCount: 92,
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      feedbacks: [
        {
          id: 'fb-3',
          authorName: 'Bọt Biển Cute',
          content: 'Gu tui gu tui, ngoài lạnh trong nóng xỉu ngang! Giải đố hint dễ thương quá nè.',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'char-3',
      name: 'Lumiere Sứa Nhỏ',
      shortDescription: 'Tinh linh sứa phát quang ngây thơ, thích trôi theo dòng hải lưu ấm áp.',
      avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
      tags: ['Dễ Thương', 'Kỳ Ảo', 'Biển Sâu'],
      detailDescription: 'Lumiere nhỏ bé, thân trong suốt tỏa ra ánh sáng hồng lam dịu dàng. Mỗi khi vui vẻ, xung quanh em sẽ tạo ra vô số bóng nước phát sáng rực rỡ.',
      backstory: 'Sinh ra từ giọt nước mắt hạnh phúc của Nữ Thần Biển Cả, Lumiere không có ký ức về thù hận, chỉ luôn mong muốn đem ánh sáng ấm áp sưởi ấm những sinh vật lạc lối dưới vực tối.',
      firstMessage: 'Pikoo~ Nhìn này, bong bóng của mình có thể đổi màu đấy! Cậu chạm vào một cái thử xem, không bị chích đâu nha~',
      linkUrl: 'https://c.ai',
      linkButtonLabel: 'Chơi cùng Lumiere ✨',
      isPrivate: false,
      hint: '',
      question: '',
      password: '',
      clickCount: 312,
      favoriteCount: 115,
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      feedbacks: [
        {
          id: 'fb-4',
          authorName: 'Cá Heo Mộng Mơ',
          content: 'Em bé này chữa lành tâm hồn thực sự, nhìn thôi là đã thấy bình yên rồi!',
          createdAt: new Date().toISOString()
        }
      ]
    },
    {
      id: 'char-4',
      name: 'Zephyr Hải Vân',
      shortDescription: 'Thuyền trưởng con tàu ma Hải Tặc Mây Trôi, lang thang giữa biển và bầu trời.',
      avatar: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      tags: ['Thần Thoại', 'Tsundere', 'Kỳ Ảo'],
      detailDescription: 'Một chàng trai trẻ với chiếc áo choàng màu gió biển và chiếc la bàn luôn chỉ về phương người có ước mơ chân thật nhất.',
      backstory: 'Zephyr bị trúng lời nguyền không thể già đi khi dám trộm tấm hải đồ của thần bão tố. Chàng đi thuyền trên mây và chỉ thả neo khi gặp người thú vị.',
      firstMessage: 'Hừm, lại một kẻ lạ mặt nữa mò lên boong tàu của ta à? Đưa chiếc vỏ ốc đẹp nhất của ngươi ra làm lệ phí lên tàu đi đã.',
      linkUrl: '',
      linkButtonLabel: 'Lên tàu cùng Zephyr ⚓',
      isPrivate: false,
      hint: '',
      question: '',
      password: '',
      clickCount: 95,
      favoriteCount: 41,
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      feedbacks: []
    }
  ],
  forumPosts: [
    {
      id: 'post-1',
      authorName: 'Admin Đại Dương 🐋',
      authorRole: 'admin',
      title: 'Chào mừng các bạn đến với Diễn đàn Đại Dương!',
      content: 'Nơi này để chúng mình cùng giao lưu, chia sẻ plot ý tưởng, trao đổi về các nhân vật bot yêu thích hoặc yêu cầu admin tạo thêm nhân vật mới nha! Chúc mọi người có những phút giây thư giãn tuyệt vời bên tiếng sóng biển.',
      tag: 'Thông Báo',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      likes: 34,
      comments: [
        {
          id: 'c-1',
          authorName: 'Bé Sò Nhỏ',
          content: 'Web đẹp xỉu luôn admin ơi, vibe biển ngắm hoài không chán!',
          createdAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString()
        },
        {
          id: 'c-2',
          authorName: 'Thủy Cung Lữ Khách',
          content: 'Mong admin thêm nhiều bot yandere biển sâu bí ẩn nữa nhé!',
          createdAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'post-2',
      authorName: 'Ngôi Sao Biển',
      authorRole: 'user',
      title: 'Có ai giải được pass của Kaelen chưa ạ?',
      content: 'Gợi ý câu đố dễ thương quá trời! Mình nhập cái là ra ngay link tâm sự liền, ổng ngầu đét luôn mng ơi!!',
      tag: 'Chia Sẻ',
      createdAt: new Date(Date.now() - 15 * 3600 * 1000).toISOString(),
      likes: 19,
      comments: [
        {
          id: 'c-3',
          authorName: 'Cá Voi Lưng Gù',
          content: 'Đúng rùi haha, đọc hint là biết liền xanh lam siêu dễ thương!',
          createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString()
        }
      ]
    }
  ],
  favoritesByIp: {} as Record<string, string[]>
};

// Database Read / Write
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...initialData, ...parsed };
  } catch (err) {
    console.error('Error reading DB:', err);
    return initialData;
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// Client IP resolver
function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Track visits
app.use((req, res, next) => {
  if (req.path === '/' && req.method === 'GET') {
    const db = readDb();
    db.visitCount = (db.visitCount || 0) + 1;
    writeDb(db);
  }
  next();
});

// ==================== API ROUTES ====================

// 1. STATS
app.get('/api/stats', (req, res) => {
  const db = readDb();
  const totalCharacters = db.characters.length;
  const totalClicks = db.characters.reduce((sum: number, c: any) => sum + (c.clickCount || 0), 0);
  const totalFavorites = db.characters.reduce((sum: number, c: any) => sum + (c.favoriteCount || 0), 0);
  const totalFeedbacks = db.characters.reduce((sum: number, c: any) => sum + ((c.feedbacks && c.feedbacks.length) || 0), 0);
  const totalForumPosts = db.forumPosts.length;

  res.json({
    totalCharacters,
    totalClicks,
    totalFavorites,
    totalFeedbacks,
    totalForumPosts,
    visitCount: db.visitCount || 0
  });
});

// 2. ADMIN AUTH
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const db = readDb();
  if (password === db.adminPassword) {
    res.json({ success: true, token: 'ocean-admin-valid-token' });
  } else {
    res.status(401).json({ success: false, message: 'Mật khẩu quản trị viên không chính xác.' });
  }
});

app.post('/api/admin/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = readDb();
  if (currentPassword !== db.adminPassword) {
    return res.status(401).json({ success: false, message: 'Mật khẩu hiện tại không đúng.' });
  }
  if (!newPassword || newPassword.trim().length < 4) {
    return res.status(400).json({ success: false, message: 'Mật khẩu mới phải từ 4 ký tự trở lên.' });
  }
  db.adminPassword = newPassword.trim();
  writeDb(db);
  res.json({ success: true, message: 'Đổi mật khẩu admin thành công!' });
});

// 3. CHARACTERS
app.get('/api/characters', (req, res) => {
  const db = readDb();
  // Return characters with password sanitized for client unless private check
  const list = db.characters.map((c: any) => {
    return {
      ...c,
      avatar: normalizeDriveImageLink(c.avatar),
      hasPassword: Boolean(c.isPrivate && c.password)
      // We don't expose plain c.password to the client
    };
  });
  res.json(list);
});

// Create Character
app.post('/api/characters', (req, res) => {
  const db = readDb();
  const {
    name,
    shortDescription,
    avatar,
    tags,
    detailDescription,
    backstory,
    firstMessage,
    linkUrl,
    linkButtonLabel,
    isPrivate,
    hint,
    question,
    password
  } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Tên nhân vật không được để trống.' });
  }

  const newChar = {
    id: 'char-' + Date.now(),
    name: name.trim(),
    shortDescription: shortDescription ? shortDescription.trim() : '',
    avatar: normalizeDriveImageLink(avatar || ''),
    tags: Array.isArray(tags) ? tags : [],
    detailDescription: detailDescription ? detailDescription.trim() : '',
    backstory: backstory ? backstory.trim() : '',
    firstMessage: firstMessage ? firstMessage.trim() : '',
    linkUrl: linkUrl ? linkUrl.trim() : '',
    linkButtonLabel: (linkButtonLabel && linkButtonLabel.trim()) || 'Xem liên kết 🌊',
    isPrivate: Boolean(isPrivate),
    hint: hint ? hint.trim() : '',
    question: question ? question.trim() : '',
    password: password ? password.trim() : '',
    clickCount: 0,
    favoriteCount: 0,
    createdAt: new Date().toISOString(),
    feedbacks: []
  };

  db.characters.unshift(newChar);

  // If any new tags exist, record them
  if (Array.isArray(tags)) {
    tags.forEach((t: string) => {
      if (t && !db.tags.includes(t)) {
        db.tags.push(t);
      }
    });
  }

  writeDb(db);
  res.status(201).json(newChar);
});

// Update Character
app.put('/api/characters/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const index = db.characters.findIndex((c: any) => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Không tìm thấy nhân vật.' });
  }

  const existing = db.characters[index];
  const body = req.body;

  db.characters[index] = {
    ...existing,
    name: body.name !== undefined ? body.name.trim() : existing.name,
    shortDescription: body.shortDescription !== undefined ? body.shortDescription.trim() : existing.shortDescription,
    avatar: body.avatar !== undefined ? normalizeDriveImageLink(body.avatar) : existing.avatar,
    tags: Array.isArray(body.tags) ? body.tags : existing.tags,
    detailDescription: body.detailDescription !== undefined ? body.detailDescription.trim() : existing.detailDescription,
    backstory: body.backstory !== undefined ? body.backstory.trim() : existing.backstory,
    firstMessage: body.firstMessage !== undefined ? body.firstMessage.trim() : existing.firstMessage,
    linkUrl: body.linkUrl !== undefined ? body.linkUrl.trim() : existing.linkUrl,
    linkButtonLabel: body.linkButtonLabel !== undefined ? body.linkButtonLabel.trim() : existing.linkButtonLabel,
    isPrivate: body.isPrivate !== undefined ? Boolean(body.isPrivate) : existing.isPrivate,
    hint: body.hint !== undefined ? body.hint.trim() : existing.hint,
    question: body.question !== undefined ? body.question.trim() : existing.question,
    password: body.password !== undefined ? body.password.trim() : existing.password,
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  res.json(db.characters[index]);
});

// Delete Character
app.delete('/api/characters/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.characters = db.characters.filter((c: any) => c.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Đã xóa nhân vật thành công.' });
});

// Increment Click Count
app.post('/api/characters/:id/click', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const char = db.characters.find((c: any) => c.id === id);
  if (char) {
    char.clickCount = (char.clickCount || 0) + 1;
    writeDb(db);
    return res.json({ success: true, clickCount: char.clickCount });
  }
  res.status(404).json({ error: 'Không tìm thấy nhân vật.' });
});

// Unlock Private Character Password
app.post('/api/characters/:id/unlock', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { password } = req.body;
  const char = db.characters.find((c: any) => c.id === id);
  if (!char) {
    return res.status(404).json({ error: 'Không tìm thấy nhân vật.' });
  }
  if (!char.isPrivate) {
    return res.json({ success: true, linkUrl: char.linkUrl });
  }
  const cleanAttempt = (password || '').toString().trim().toLowerCase();
  const cleanTarget = (char.password || '').toString().trim().toLowerCase();

  if (cleanAttempt === cleanTarget) {
    return res.json({ success: true, linkUrl: char.linkUrl });
  } else {
    return res.status(400).json({ success: false, message: 'Mật khẩu chưa chính xác, hãy xem lại gợi ý nhé!' });
  }
});

// Add Feedback to Character
app.post('/api/characters/:id/feedback', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { authorName, content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Nội dung bình luận không được để trống.' });
  }

  const char = db.characters.find((c: any) => c.id === id);
  if (!char) {
    return res.status(404).json({ error: 'Không tìm thấy nhân vật.' });
  }

  if (!char.feedbacks) {
    char.feedbacks = [];
  }

  const newFeedback = {
    id: 'fb-' + Date.now(),
    authorName: (authorName && authorName.trim()) || 'Khách Du Thủy',
    content: content.trim(),
    createdAt: new Date().toISOString()
  };

  char.feedbacks.unshift(newFeedback);
  writeDb(db);

  res.status(201).json(newFeedback);
});

// Delete Feedback (Admin)
app.delete('/api/characters/:charId/feedback/:feedbackId', (req, res) => {
  const db = readDb();
  const { charId, feedbackId } = req.params;
  const char = db.characters.find((c: any) => c.id === charId);
  if (!char || !char.feedbacks) {
    return res.status(404).json({ error: 'Không tìm thấy bình luận.' });
  }

  char.feedbacks = char.feedbacks.filter((fb: any) => fb.id !== feedbackId);
  writeDb(db);
  res.json({ success: true, message: 'Đã xóa bình luận thành công.' });
});

// 4. FAVORITES (Synced per IP / device key)
app.get('/api/favorites', (req, res) => {
  const db = readDb();
  const clientIp = getClientIp(req);
  const clientKey = (req.headers['x-client-id'] as string) || clientIp;
  const favList = db.favoritesByIp[clientKey] || db.favoritesByIp[clientIp] || [];
  res.json(favList);
});

app.post('/api/characters/:id/favorite', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const clientIp = getClientIp(req);
  const clientKey = (req.headers['x-client-id'] as string) || clientIp;

  if (!db.favoritesByIp[clientKey]) {
    db.favoritesByIp[clientKey] = [];
  }

  const favs = db.favoritesByIp[clientKey];
  const char = db.characters.find((c: any) => c.id === id);
  const isCurrentlyFav = favs.includes(id);

  if (isCurrentlyFav) {
    db.favoritesByIp[clientKey] = favs.filter((fId: string) => fId !== id);
    if (char && char.favoriteCount > 0) {
      char.favoriteCount -= 1;
    }
  } else {
    favs.push(id);
    if (char) {
      char.favoriteCount = (char.favoriteCount || 0) + 1;
    }
  }

  writeDb(db);
  res.json({
    isFavorite: !isCurrentlyFav,
    favoriteCount: char ? char.favoriteCount : 0,
    favorites: db.favoritesByIp[clientKey]
  });
});

// 5. MUSIC
app.get('/api/music', (req, res) => {
  const db = readDb();
  res.json(db.musicTracks || []);
});

app.post('/api/music', (req, res) => {
  const db = readDb();
  const { title, artist, url, duration } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: 'Tiêu đề và đường dẫn nhạc không được để trống.' });
  }
  const newTrack = {
    id: 'track-' + Date.now(),
    title: title.trim(),
    artist: (artist && artist.trim()) || 'Biển Xanh Lofi',
    url: url.trim(),
    duration: duration ? duration.trim() : '03:00'
  };
  db.musicTracks.push(newTrack);
  writeDb(db);
  res.status(201).json(newTrack);
});

app.put('/api/music/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const track = db.musicTracks.find((t: any) => t.id === id);
  if (!track) return res.status(404).json({ error: 'Không tìm thấy bài hát.' });
  const { title, artist, url, duration } = req.body;
  if (title) track.title = title.trim();
  if (artist) track.artist = artist.trim();
  if (url) track.url = url.trim();
  if (duration) track.duration = duration.trim();
  writeDb(db);
  res.json(track);
});

app.delete('/api/music/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.musicTracks = db.musicTracks.filter((t: any) => t.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Đã xóa bài hát thành công.' });
});

// 6. TAGS
app.get('/api/tags', (req, res) => {
  const db = readDb();
  res.json(db.tags || []);
});

app.post('/api/tags', (req, res) => {
  const db = readDb();
  const { tag } = req.body;
  if (!tag || !tag.trim()) {
    return res.status(400).json({ error: 'Thẻ tag không hợp lệ.' });
  }
  const cleanTag = tag.trim();
  if (!db.tags.includes(cleanTag)) {
    db.tags.push(cleanTag);
    writeDb(db);
  }
  res.status(201).json(db.tags);
});

app.delete('/api/tags/:tag', (req, res) => {
  const db = readDb();
  const { tag } = req.params;
  db.tags = db.tags.filter((t: string) => t !== decodeURIComponent(tag));
  writeDb(db);
  res.json(db.tags);
});

// 7. ANNOUNCEMENTS
app.get('/api/announcements', (req, res) => {
  const db = readDb();
  res.json(db.announcements || []);
});

app.post('/api/announcements', (req, res) => {
  const db = readDb();
  const { title, content, type } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Tiêu đề và nội dung thông báo không được để trống.' });
  }
  const newAnn = {
    id: 'ann-' + Date.now(),
    title: title.trim(),
    content: content.trim(),
    type: type || 'info',
    active: true,
    createdAt: new Date().toISOString()
  };
  db.announcements.unshift(newAnn);
  writeDb(db);
  res.status(201).json(newAnn);
});

app.put('/api/announcements/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const ann = db.announcements.find((a: any) => a.id === id);
  if (!ann) return res.status(404).json({ error: 'Không tìm thấy thông báo.' });
  const { title, content, type, active } = req.body;
  if (title !== undefined) ann.title = title.trim();
  if (content !== undefined) ann.content = content.trim();
  if (type !== undefined) ann.type = type;
  if (active !== undefined) ann.active = Boolean(active);
  writeDb(db);
  res.json(ann);
});

app.delete('/api/announcements/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.announcements = db.announcements.filter((a: any) => a.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// 8. FORUM
app.get('/api/forum', (req, res) => {
  const db = readDb();
  res.json(db.forumPosts || []);
});

app.post('/api/forum', (req, res) => {
  const db = readDb();
  const { authorName, authorRole, title, content, tag } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Tiêu đề và nội dung bài viết không được để trống.' });
  }
  const newPost = {
    id: 'post-' + Date.now(),
    authorName: (authorName && authorName.trim()) || 'Du Khách Hải Đảo',
    authorRole: authorRole === 'admin' ? 'admin' : 'user',
    title: title.trim(),
    content: content.trim(),
    tag: tag ? tag.trim() : 'Tâm Sự Biển',
    createdAt: new Date().toISOString(),
    likes: 0,
    comments: []
  };
  db.forumPosts.unshift(newPost);
  writeDb(db);
  res.status(201).json(newPost);
});

app.post('/api/forum/:id/comment', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { authorName, authorRole, content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ error: 'Nội dung phản hồi không được để trống.' });
  }
  const post = db.forumPosts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  if (!post.comments) post.comments = [];

  const newComment = {
    id: 'c-' + Date.now(),
    authorName: (authorName && authorName.trim()) || 'Hải Ly Dễ Thương',
    authorRole: authorRole === 'admin' ? 'admin' : 'user',
    content: content.trim(),
    createdAt: new Date().toISOString()
  };
  post.comments.push(newComment);
  writeDb(db);
  res.status(201).json(newComment);
});

app.post('/api/forum/:id/like', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const post = db.forumPosts.find((p: any) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Không tìm thấy bài viết.' });
  post.likes = (post.likes || 0) + 1;
  writeDb(db);
  res.json({ likes: post.likes });
});

app.delete('/api/forum/:id', (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.forumPosts = db.forumPosts.filter((p: any) => p.id !== id);
  writeDb(db);
  res.json({ success: true, message: 'Đã xóa bài viết diễn đàn.' });
});

app.delete('/api/forum/:postId/comment/:commentId', (req, res) => {
  const db = readDb();
  const { postId, commentId } = req.params;
  const post = db.forumPosts.find((p: any) => p.id === postId);
  if (!post || !post.comments) return res.status(404).json({ error: 'Không tìm thấy bình luận.' });
  post.comments = post.comments.filter((c: any) => c.id !== commentId);
  writeDb(db);
  res.json({ success: true, message: 'Đã xóa bình luận.' });
});

// ==================== VITE & SPA SERVING ====================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌊 Ocean Sanctuary Server running on port ${PORT}`);
  });
}

startServer();
