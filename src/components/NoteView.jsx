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
  const [status, setStatus] = useState('idle');
  const [title, setTitle] = useState('Untitled');
  const [initialDocState, setInitialDocState] = useState(null);

  const noteIdRef = useRef(getStoredNoteId(tabId));
  const versionRef = useRef(0);
  const lastContentRef = useRef({ plain_text: '', html: '', document_state: {} });

  const savingRef = useRef(false);
  const pendingRef = useRef(null);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
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
            setTimeout(() => active && setStatus('idle'), 800);
            return;
          } catch (e) {
            console.warn('Stored note_id invalid, will create a fresh note', e);
          }
        }

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
        setTimeout(() => active && setStatus('idle'), 800);
      } catch (e) {
        console.error(e);
        setStatus('error');
      }
    }

    if (tabId) bootstrap();
    return () => {
      active = false;
    };
  }, [tabId]);

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
            try {
              const fresh = await fetchNote(tabId, noteIdRef.current);
              versionRef.current = fresh.version ?? versionRef.current;
              if (!pendingRef.current) pendingRef.current = payload;
              continue;
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

  const scheduleSave = useMemo(
    () =>
      debounce((payload) => {
        pendingRef.current = payload;
        pumpQueue();
      }, 400),
    [pumpQueue]
  );

  useEffect(() => () => scheduleSave.cancel(), [scheduleSave]);

  const handleEditorChange = ({ plain_text, html, document_state }) => {
    lastContentRef.current = { plain_text, html, document_state };
    scheduleSave({ title, plain_text, html, document_state });
  };

  const onTitleChange = (e) => {
    const t = e.target.value || 'Untitled';
    setTitle(t);
    const { plain_text, html, document_state } = lastContentRef.current;
    scheduleSave({ title: t, plain_text, html, document_state });
  };
  const onTitleBlur = () => scheduleSave.flush();

  return (
    <div className="w-full h-full overflow-hidden flex flex-col gap-3 p-2 relative">
      {/* Fixed title row (no chip here anymore) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <label className="text-sm text-slate-600 shrink-0">Title</label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            onBlur={onTitleBlur}
            className="w-full min-w-0 rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Untitled"
          />
        </div>
      </div>

      {/* Editor fills the rest; internal area scrolls */}
      <div className="flex-1 min-h-0">
        <LexicalEditor
          initialDocState={initialDocState}
          tabId={tabId}
          noteId={noteIdRef.current}
          onChange={handleEditorChange}
        />
      </div>

      {/* Status chip at bottom-right, always visible */}
      <div className="absolute bottom-2 right-2 pointer-events-none">
        <StatusChip state={status} />
      </div>
    </div>
  );
}

NoteView.propTypes = {
  tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
