/**
 * Firestore Security Rules Test Suite — Biển Mộng Mơ (caday-2bea1)
 * Verifies all "Dirty Dozen" adversarial payloads return PERMISSION_DENIED.
 */

export interface TestCase {
  id: number;
  name: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  path: string;
  auth: { uid: string } | null;
  payload?: Record<string, unknown>;
  expected: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: TestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated Song Creation',
    operation: 'create',
    path: '/songs/m-hack',
    auth: null,
    payload: {
      id: 'm-hack',
      title: 'Hack Track',
      artist: 'Attacker',
      url: 'https://example.com/a.mp3',
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Non-Admin UID Spoof',
    operation: 'create',
    path: '/songs/m-spoof',
    auth: {
      uid: 'spoof-uid',
    },
    payload: {
      id: 'm-spoof',
      title: 'Spoof Track',
      artist: 'Spoofer',
      url: 'https://example.com/a.mp3',
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Non-Admin Character Deletion',
    operation: 'delete',
    path: '/characters/c-1',
    auth: {
      uid: 'visitor-1',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow Field Injection on Comment',
    operation: 'create',
    path: '/comments/cm-1',
    auth: null,
    payload: {
      id: 'cm-1',
      characterId: 'c-1',
      authorName: 'Visitor',
      content: 'Nice!',
      createdAt: '2026-11-03T00:00:00.000Z',
      isAdmin: true,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Orphaned Comment Creation (Non-existent Character)',
    operation: 'create',
    path: '/comments/cm-orphan',
    auth: null,
    payload: {
      id: 'cm-orphan',
      characterId: 'c-nonexistent',
      authorName: 'Visitor',
      content: 'Hello',
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Character Profile Hijack via Counter Update',
    operation: 'update',
    path: '/characters/c-1',
    auth: null,
    payload: {
      clickCount: 290,
      chatLink: 'https://malicious.example.com',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Arbitrary Counter Jump (+999999)',
    operation: 'update',
    path: '/characters/c-1',
    auth: null,
    payload: {
      favoriteCount: 999999,
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Oversized Base64 Avatar Poisoning (>15000 chars)',
    operation: 'create',
    path: '/characters/c-big',
    auth: {
      uid: 'mDMDrnFB7LNSJbVTkd9G7KMo2ao1',
    },
    payload: {
      id: 'c-big',
      name: 'Big Avatar',
      shortDescription: 'Desc',
      avatar: 'data:image/png;base64,' + 'A'.repeat(20000),
      tags: ['Biển Sâu'],
      intro: 'Intro',
      chatLink: '',
      postLink: '',
      isPrivate: false,
      question: '',
      hint: '',
      passwordHash: '',
      clickCount: 0,
      favoriteCount: 0,
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'Path ID Poisoning (Invalid Characters)',
    operation: 'create',
    path: '/comments/invalid id!',
    auth: null,
    payload: {
      id: 'invalid id!',
      characterId: 'c-1',
      authorName: 'Visitor',
      content: 'Hello',
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Comment Mutation After Posting',
    operation: 'update',
    path: '/comments/cm-1',
    auth: null,
    payload: {
      content: 'Edited comment',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'Unauthorized Settings Modification',
    operation: 'update',
    path: '/settings/donate',
    auth: {
      uid: 'user-2',
    },
    payload: {
      id: 'donate',
      accountNumber: '00000000',
      updatedAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Unbounded Tag List Injection (>15 tags)',
    operation: 'create',
    path: '/characters/c-tags',
    auth: {
      uid: 'mDMDrnFB7LNSJbVTkd9G7KMo2ao1',
    },
    payload: {
      id: 'c-tags',
      name: 'Tag Overflow',
      shortDescription: 'Desc',
      avatar: 'https://example.com/a.jpg',
      tags: Array.from({ length: 20 }, (_, i) => `Tag-${i}`),
      intro: 'Intro',
      chatLink: '',
      postLink: '',
      isPrivate: false,
      question: '',
      hint: '',
      passwordHash: '',
      clickCount: 0,
      favoriteCount: 0,
      createdAt: '2026-11-03T00:00:00.000Z',
    },
    expected: 'PERMISSION_DENIED',
  },
];
