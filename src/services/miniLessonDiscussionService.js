import { API_BASE_URL } from '../config';

const STORAGE_KEY = 'chatDiscussionID';
const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

function readStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(record) {
  if (typeof window === 'undefined') return;
  try {
    if (!record) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch {
    return;
  }
}

export function clearMiniLessonDiscussionChatId() {
  writeStorage(null);
}

export function storeMiniLessonDiscussionChatId(chatId, miniLessonId) {
  if (!chatId) {
    clearMiniLessonDiscussionChatId();
    return;
  }

  const record = {
    id: String(chatId),
    lessonId: miniLessonId != null ? String(miniLessonId) : null,
    expiresAt: Date.now() + FIFTEEN_MINUTES_MS,
  };

  writeStorage(record);
}

export function getStoredMiniLessonDiscussionChatId(miniLessonId) {
  const record = readStorage();
  if (!record) return null;

  if (typeof record.expiresAt === 'number' && record.expiresAt > 0) {
    if (record.expiresAt < Date.now()) {
      clearMiniLessonDiscussionChatId();
      return null;
    }
  }

  if (!record.id) {
    clearMiniLessonDiscussionChatId();
    return null;
  }

  if (miniLessonId != null && record.lessonId != null) {
    if (String(miniLessonId) !== String(record.lessonId)) {
      return null;
    }
  }

  return String(record.id);
}

export async function fetchMiniLessonDiscussionMessages(chatId) {
  if (!chatId) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/messages/chat/${encodeURIComponent(chatId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.filter((item) => item && typeof item === 'object');
  } catch {
    return [];
  }
}
