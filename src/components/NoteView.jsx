import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import LexicalEditor from './editor/LexicalEditor';
import { ensureNote, updateNote, fetchNote } from '../services/noteService';
import { getStoredNoteId, setStoredNoteId, removeStoredNoteId } from '../utils/storage';

function StatusChip({ state }) {
  const map = {
    idle: 'text-slate-500 bg-slate-100 border-slate-200',
    saving: 'text-amber-700 bg-amber-100 border-amber-200',
    saved: 'text-emerald-700 bg-emerald-100 border-emerald-200',
    error: 'text-rose-700 bg-rose-100 border-rose-200',
  };
  const label =
    state === 'saving'
      ? 'Saving to library…'
      : state === 'saved'
      ? 'Saved to library'
      : state === 'error'
      ? 'Error while saving'
      : 'Idle';
  return <span className={`text-sm px-3 py-1 rounded-full border ${map[state]}`}>{label}</span>;
}

export default function NoteView({ tabId }) {
  const [status, setStatus] = useState('idle');
  const [title, setTitle] = useState('Untitled');
  const [initialDocState, setInitialDocState] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const noteIdRef = useRef(getStoredNoteId(tabId));
  const versionRef = useRef(0);
  const lastContentRef = useRef({ plain_text: '', html: '', document_state: {} });

  const savingRef = useRef(false);
  const pendingRef = useRef(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (noteIdRef.current && !title.trim()) {
      // Remove note ID from storage if note is empty
      removeStoredNoteId(tabId);
      console.log('Cleaned up empty note from storage');
    }
  }, [tabId, title]);

  // Enhanced error handling
  const handleError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);
    setStatus('error');
    
    // If note doesn't exist anymore, clean up storage
    if (error.status === 404) {
      removeStoredNoteId(tabId);
      noteIdRef.current = null;
    }
  }, [tabId]);

  useEffect(() => {
    let active = true;
    
    async function bootstrap() {
      if (!tabId) {
        console.warn('No tabId provided to NoteView');
        return;
      }

      try {
        setStatus('saving');

        const existingId = noteIdRef.current;
        if (existingId) {
          try {
            const n = await fetchNote(tabId, existingId);
            if (!active) return;
            
            versionRef.current = n.version ?? 0;
            setTitle(n.title || 'Untitled');
            setInitialDocState(n.document_state || null);
            lastContentRef.current = {
              plain_text: n.plain_text || '',
              html: n.html || '',
              document_state: n.document_state || {},
            };
            setStatus('saved');
            setIsReady(true);
            setTimeout(() => active && setStatus('idle'), 800);
            return;
          } catch (e) {
            console.warn('Stored note_id invalid, will create a fresh note', e);
            removeStoredNoteId(tabId); // Clean up invalid note ID
          }
        }

        // Create new note
        const payload = { title: 'Untitled', plain_text: '', html: '', document_state: {} };
        const note = await ensureNote(tabId, payload);
        if (!active) return;

        noteIdRef.current = note.note_id;
        versionRef.current = note.version ?? 0;
        setStoredNoteId(tabId, note.note_id);

        setTitle(note.title || 'Untitled');
        setInitialDocState(note.document_state || null);
        lastContentRef.current = {
          plain_text: note.plain_text || '',
          html: note.html || '',
          document_state: note.document_state || {},
        };

        setStatus('saved');
        setIsReady(true);
        setTimeout(() => active && setStatus('idle'), 800);
      } catch (e) {
        handleError(e, 'bootstrap');
      }
    }

    if (tabId) bootstrap();
    
    return () => {
      active = false;
      cleanup();
    };
  }, [tabId, handleError, cleanup]);

  const pumpQueue = useMemo(
    () => async () => {
      if (savingRef.current || !noteIdRef.current) return;
      savingRef.current = true;

      while (pendingRef.current) {
        const payload = pendingRef.current;
        pendingRef.current = null;

        try {
          setStatus('saving');
          const res = await updateNote(tabId, noteIdRef.current, {
            ...payload,
            base_version: versionRef.current,
          });
          versionRef.current = res.version ?? versionRef.current + 1;
          setStatus('saved');
        } catch (e) {
          console.error('Save failed:', e);
          if (e.status === 409) {
            // Conflict - refresh and retry
            try {
              const fresh = await fetchNote(tabId, noteIdRef.current);
              versionRef.current = fresh.version ?? versionRef.current;
              if (!pendingRef.current) pendingRef.current = payload;
              continue;
            } catch (e2) {
              handleError(e2, 'refresh after 409');
              break;
            }
          } else {
            handleError(e, 'save');
            break;
          }
        }
      }

      if (status === 'saved') {
        setTimeout(() => setStatus('idle'), 800);
      }
      savingRef.current = false;
    },
    [status, tabId, handleError]
  );

  const scheduleSave = useMemo(
    () =>
      debounce((payload) => {
        if (!noteIdRef.current) {
          console.warn('Cannot save: no note ID available');
          return;
        }
        pendingRef.current = payload;
        pumpQueue();
      }, 400),
    [pumpQueue]
  );

  // Clean up debounced function
  useEffect(() => () => scheduleSave.cancel(), [scheduleSave]);

  const handleEditorChange = useCallback(({ plain_text, html, document_state }) => {
    // Debug logging to verify images are being saved
    if (document_state && JSON.stringify(document_state).includes('"type":"image"')) {
      console.log('Document state contains images, preparing to save...');
      console.log('Image nodes found in state:', 
        JSON.stringify(document_state).match(/"type":"image"/g)?.length || 0
      );
    }
    
    lastContentRef.current = { plain_text, html, document_state };
    scheduleSave({ title, plain_text, html, document_state });
  }, [title, scheduleSave]);

  const onTitleChange = useCallback((e) => {
    const t = e.target.value || 'Untitled';
    setTitle(t);
    const { plain_text, html, document_state } = lastContentRef.current;
    scheduleSave({ title: t, plain_text, html, document_state });
  }, [scheduleSave]);

  const onTitleBlur = useCallback(() => {
    scheduleSave.flush();
  }, [scheduleSave]);

  // Don't render editor until we're ready
  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-slate-500">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-4 p-4 relative">
      {/* Title input with better styling */}
      <div className="flex items-center gap-3">
        <label className="text-base font-medium text-slate-700 shrink-0">Title</label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          onBlur={onTitleBlur}
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          placeholder="Enter note title..."
        />
      </div>

      {/* Editor fills the rest with proper padding */}
      <div className="flex-1 min-h-0 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <LexicalEditor
          initialDocState={initialDocState}
          tabId={tabId}
          noteId={noteIdRef.current}
          onChange={handleEditorChange}
        />
      </div>

      {/* Status chip at bottom-right, always visible */}
      <div className="absolute bottom-6 right-6">
        <StatusChip state={status} />
      </div>
    </div>
  );
}

NoteView.propTypes = {
  tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};