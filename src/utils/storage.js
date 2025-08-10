export function getStoredNoteId(tabId) {
    return localStorage.getItem(`noteId:${tabId}`);
  }
  
  export function setStoredNoteId(tabId, noteId) {
    localStorage.setItem(`noteId:${tabId}`, noteId);
  }
  