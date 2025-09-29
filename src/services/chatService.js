import { API_BASE_URL } from '../config'

function extractErrorMessage(data, status) {
  if (!data) return `Request failed with status ${status}`
  if (typeof data === 'string' && data.trim().length > 0) return data
  if (typeof data.detail === 'string' && data.detail.trim().length > 0) return data.detail
  if (typeof data.message === 'string' && data.message.trim().length > 0) return data.message
  return `Request failed with status ${status}`
}

export async function sendChatMessage(text) {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) {
    let errorMessage
    try {
      const errorData = await response.json()
      errorMessage = extractErrorMessage(errorData, response.status)
    } catch (error) {
      const fallback = await response.text()
      errorMessage = fallback?.trim().length ? fallback : `Request failed with status ${response.status}`
    }
    throw new Error(errorMessage)
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    const data = await response.json()
    if (typeof data === 'string') return data
    if (data && typeof data.text === 'string') return data.text
    if (data && typeof data.message === 'string') return data.message
    if (data && typeof data.reply === 'string') return data.reply
    return 'Message delivered to the classroom service.'
  }

  const responseText = await response.text()
  return responseText?.trim().length ? responseText : 'Message delivered to the classroom service.'
}
