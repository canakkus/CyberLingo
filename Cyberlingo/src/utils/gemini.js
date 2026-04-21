const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

/**
 * Strips HTML tags from a string for use in AI prompts.
 */
export function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

/**
 * Sends a conversation to the Gemini API and returns the assistant response text.
 *
 * @param {Array<{role: 'user'|'assistant', text: string}>} messages - Chat history
 * @param {string} systemPrompt - System instruction for the AI
 * @returns {Promise<string>} - The AI response text
 */
export async function askGemini(messages, systemPrompt) {
  // Map our internal roles to Gemini's 'user' / 'model' roles
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }))

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512
    }
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini API Fehler: ${response.status}`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Keine Antwort von Gemini erhalten.')
  return text
}
