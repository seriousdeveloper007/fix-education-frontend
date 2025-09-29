import { useCallback, useEffect, useRef, useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { sendChatMessage } from '../services/chatService'

function ChatDock({
  title = 'Ask, learn, brainstorm, draw',
  placeholder = 'Ask the board…',
  onSend,
  width = 360,
}) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text) return
    setInput('')

    // 1) append user message
    setMessages(m => [...m, { role: 'user', text, ts: Date.now() }])

    // 2) optionally get an assistant reply from onSend
    try {
      const maybeReply = onSend ? await onSend(text) : null
      if (typeof maybeReply === 'string' && maybeReply.length > 0) {
        setMessages(m => [...m, { role: 'ai', text: maybeReply, ts: Date.now() }])
      }
    } catch (e) {
      console.error(e)
      setMessages(m => [
        ...m,
        { role: 'ai', text: 'Oops, failed to send. Check console/network.', ts: Date.now() },
      ])
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div
      style={{
        width,
        borderLeft: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        padding: 12,
        gap: 8,
        background: '#fff',
      }}
    >
      <div style={{ fontWeight: 600 }}>{title}</div>

      <div
        ref={listRef}
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          paddingRight: 4,
        }}
      >
        {messages.length === 0 ? (
          <div style={{ color: '#888' }}>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.4,
                  color: m.role === 'user' ? '#1f6feb' : '#8b949e',
                  minWidth: 40,
                }}
              >
                {m.role}
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>{m.text}</div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{
            flex: 1,
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '10px 12px',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim()}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '10px 14px',
            background: input.trim() ? '#111' : '#f4f4f4',
            color: input.trim() ? '#fff' : '#999',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

// --- Page: Tldraw on the left, simple chat on the right ---
export default function ClassroomPage() {
  const onSend = useCallback(async (text) => {
    return await sendChatMessage(text)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Tldraw licenseKey={import.meta.env.VITE_TLDRAW_LICENSE_KEY} />
      </div>
      <ChatDock onSend={onSend} />
    </div>
  )
}
