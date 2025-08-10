import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import LexicalEditor from './editor/LexicalEditor';
import { ensureNote, updateNote, fetchNote } from '../services/noteService';
import { getStoredNoteId, setStoredNoteId } from '../utils/storage';

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
  return <span className={`text-xs px-2 py-0.5 rounded border ${map[state]}`}>{label}</span>;
}

export default function NoteView({ tabId }) {
  const [status, setStatus] = useState('idle'); // 'saving' | 'saved' | 'error' | 'idle'
  const [title, setTitle] = useState('Untitled');
  const [initialDocState, setInitialDocState] = useState(null);

  // server bookkeeping
  const noteIdRef = useRef(getStoredNoteId(tabId));
  const versionRef = useRef(0);

  // sequential save queue (prevents parallel PUTs → 409 loops)
  const savingRef = useRef(false);
  const pendingRef = useRef(null);

  // --- Bootstrapping: fetch if we have an id, otherwise create once ---
  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        setStatus('saving');

        const existingId = noteIdRef.current;
        if (existingId) {
          // Try fetch first → avoids duplicate POST
          try {
            const n = await fetchNote(tabId, existingId);
            if (!active) return;
            versionRef.current = n.version ?? 0;
            setTitle(n.title || 'Untitled');
            setInitialDocState(n.document_state || null);
            setStatus('saved');
            setTimeout(() => active && setStatus('idle'), 800);
            return;
          } catch (e) {
            console.warn('Stored note_id invalid, will create a fresh note', e);
            // fall through to create
          }
        }

        // Create only when we truly don't have a valid note_id for this tab
        const payload = { title: 'Untitled', plain_text: '', html: '', document_state: {} };
        const note = await ensureNote(tabId, payload);
        if (!active) return;

        noteIdRef.current = note.note_id;
        versionRef.current = note.version ?? 0;
        setStoredNoteId(tabId, note.note_id);

        setTitle(note.title || 'Untitled');
        setInitialDocState(note.document_state || null);

        setStatus('saved');
        setTimeout(() => active && setStatus('idle'), 800);
      } catch (e) {
        // If backend still returns a duplicate error here, it means localStorage
        // didn’t have the id and there’s no id-by-tab fetch route yet.
        // Once you add an UPSERT on POST, this won’t happen.
        console.error(e);
        setStatus('error');
      }
    }

    if (tabId) bootstrap();
    return () => {
      active = false;
    };
  }, [tabId]);

  // --- Single-flight save pump: drains pending updates sequentially ---
  const pumpQueue = useMemo(
    () => async () => {
      if (savingRef.current) return;
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
          console.error('save failed', e);
          if (e.status === 409) {
            // version mismatch → refresh latest, then retry once
            try {
              const fresh = await fetchNote(tabId, noteIdRef.current);
              versionRef.current = fresh.version ?? versionRef.current;
              // put the same payload back if nothing newer arrived
              if (!pendingRef.current) pendingRef.current = payload;
              continue; // retry loop
            } catch (e2) {
              console.error('refresh after 409 failed', e2);
            }
          }
          setStatus('error');
        }
      }

      if (status === 'saved') setTimeout(() => setStatus('idle'), 800);
      savingRef.current = false;
    },
    [status, tabId]
  );

  // Coalesce rapid edits; latest wins
  const scheduleSave = useMemo(
    () =>
      debounce((payload) => {
        pendingRef.current = payload;
        // fire and forget; pump drains queue sequentially
        // (no parallel PUTs → no version thrash)
        pumpQueue();
      }, 400),
    [pumpQueue]
  );

  useEffect(() => () => scheduleSave.cancel(), [scheduleSave]);

  // editor → save
  const handleEditorChange = ({ plain_text, html, document_state }) => {
    scheduleSave({ title, plain_text, html, document_state });
  };

  // title edits
  const onTitleChange = (e) => setTitle(e.target.value || 'Untitled');
  const onTitleBlur = () => scheduleSave.flush();

  return (
    <div className="w-full h-full p-2 overflow-hidden flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <label className="text-sm text-slate-600 shrink-0">Title</label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Untitled"
          />
        </div>
        <StatusChip state={status} />
      </div>

      <div className="flex-1 min-h-0">
        <LexicalEditor
          initialDocState={initialDocState}
          tabId={tabId}
          noteId={noteIdRef.current}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}

NoteView.propTypes = {
  tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
