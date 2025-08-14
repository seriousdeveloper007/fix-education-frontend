
export function getStoredNoteId(tabId) {
  if (!tabId) return null;
  return localStorage.getItem(`noteId:${tabId}`);
}

export function setStoredNoteId(tabId, noteId) {
  if (!tabId || !noteId) return;
  localStorage.setItem(`noteId:${tabId}`, noteId);
}

export function removeStoredNoteId(tabId) {
  if (!tabId) return;
  localStorage.removeItem(`noteId:${tabId}`);
}

export function clearAllStoredNoteIds() {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('noteId:')) {
      localStorage.removeItem(key);
    }
  });
}

export function getAllStoredNoteIds() {
  const keys = Object.keys(localStorage);
  const noteIds = {};
  keys.forEach(key => {
    if (key.startsWith('noteId:')) {
      const tabId = key.replace('noteId:', '');
      noteIds[tabId] = localStorage.getItem(key);
    }
  });
  return noteIds;
}

// Cleanup function to remove orphaned note IDs
export function cleanupOrphanedNoteIds(validTabIds = []) {
  const allNoteIds = getAllStoredNoteIds();
  Object.keys(allNoteIds).forEach(tabId => {
    if (!validTabIds.includes(tabId)) {
      removeStoredNoteId(tabId);
      console.log(`Removed orphaned note ID for tab: ${tabId}`);
    }
  });
}