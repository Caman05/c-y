# Firestore Security Specification — Biển Mộng Mơ (`caday-2bea1`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: Every path not explicitly matched is denied for both `read` and `write`.
2. **Admin Identity Invariant (`isAdmin`)**: Only an authenticated user with `request.auth != null`, `request.auth.token.email_verified == true`, and `request.auth.token.email == 'quynhchinga1229@gmail.com'` (or a verified document in `/admins/{uid}`) holds administrative privileges.
3. **Song Invariant (`/songs/{songId}`)**:
   - Public visitors may read (`get`, `list` where `resource.data.id is string`).
   - Only `isAdmin()` may `create`, `update`, or `delete` songs, and every write must pass `isValidId(songId)` and `isValidSong(incoming())` with strict key whitelisting (`hasAll` / `hasOnly`).
4. **Character Invariant (`/characters/{characterId}`)**:
   - Public visitors may read (`get`, `list` where `resource.data.id is string`).
   - Only `isAdmin()` may `create` or `delete` character profiles.
   - `update` is partitioned into two tiers:
     - **Tier 1 (`isAdmin()`)**: Can update character profile fields provided `isValidCharacter(incoming())` holds and `createdAt` + `id` remain immutable.
     - **Tier 2 (Public Counter Action)**: Visitors can only update `clickCount` (increment by 1) or `favoriteCount` (delta of +1 or -1, non-negative) via `affectedKeys().hasOnly(['clickCount'])` or `affectedKeys().hasOnly(['favoriteCount'])`, wrapped in `isValidCharacter(incoming())`.
5. **Comment Relational Sync Invariant (`/comments/{commentId}`)**:
   - A comment can only be created if `isValidId(commentId)`, `isValidComment(incoming())`, and the parent character document `exists(/databases/$(database)/documents/characters/$(incoming().characterId))`.
   - Comments are immutable once created (`allow update: if false;`) and can only be deleted by `isAdmin()`.
6. **Announcement & Settings Invariants (`/announcements/{announcementId}`, `/settings/{settingId}`)**:
   - Publicly readable (`resource.data.id is string`), strictly writable only by `isAdmin()` with schema validation `isValidAnnouncement` / `isValidAppSetting`.
7. **Volumetric & Anti-Base64 Guard**:
   - Character `avatar` is strictly capped at `<= 15000` characters to prevent large base64 blobs in Firestore.
   - All strings and arrays have explicit upper bounds.

---

## 2. The "Dirty Dozen" Payloads

1. **Unauthenticated Song Creation**: Visitor attempts to `create` `/songs/m-hack` without admin auth.
2. **Unverified Admin Email Spoof**: Attacker with `email: "quynhchinga1229@gmail.com"` but `email_verified: false` attempts to `create` a character.
3. **Non-Admin Character Deletion**: Authenticated non-admin (`user@gmail.com`) attempts to `delete` `/characters/c-1`.
4. **Shadow Field Injection on Comment**: Visitor attempts to `create` `/comments/cm-1` with an extra field `"isAdmin": true`.
5. **Orphaned Comment Creation**: Visitor attempts to `create` `/comments/cm-orphan` referencing a non-existent `characterId: "c-nonexistent"`.
6. **Character Profile Hijack via Counter Update**: Visitor attempts to `update` `/characters/c-1` changing `chatLink` alongside `clickCount`.
7. **Arbitrary Counter Jump**: Visitor attempts to `update` `/characters/c-1` setting `favoriteCount` from `10` to `999999`.
8. **Oversized Base64 Avatar Poisoning**: Admin or attacker attempts to write a 200KB base64 string into `/characters/c-1.avatar` (`size() > 15000`).
9. **Path ID Poisoning**: Visitor attempts to create `/comments/invalid id with spaces!` (`!isValidId`).
10. **Comment Mutation After Posting**: Visitor attempts to `update` `/comments/cm-1` to alter `content`.
11. **Unauthorized Settings Modification**: Non-admin attempts to `update` `/settings/donate` to replace `qrImage` and `accountNumber`.
12. **Unbounded Tag List Injection**: Payload with 50 tags (`tags.size() > 15`) on `/characters/c-1`.
