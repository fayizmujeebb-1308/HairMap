'use client'

import { useState, useRef, useEffect } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'Is my adherence good enough to see results?',
  'What does my Norwood stage mean for treatment?',
  'How long until I see results from minoxidil?',
  'Should I be worried about finasteride side effects?',
]

function renderMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>(?:\s*<li>[\s\S]*?<\/li>)*)/g, '<ul class="list-disc list-inside space-y-0.5 my-1">$1</ul>')
    .split('\n\n')
    .map(p => p.startsWith('<ul') ? p : `<p>${p}</p>`)
    .join('')
}

export default function CoachChat({ firstName }: { firstName: string }) {
  const [history, setHistory] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, streamingText])

  async function send(message: string) {
    if (!message.trim() || streaming) return
    const userMsg: Message = { role: 'user', content: message }
    setHistory(h => [...h, userMsg])
    setInput('')
    setStreaming(true)
    setStreamingText('')

    try {
      const res = await fetch('/api/ai-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      })

      if (!res.ok || !res.body) throw new Error('Failed')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        full += chunk
        setStreamingText(full)
      }

      setHistory(h => [...h, { role: 'assistant', content: full }])
      setStreamingText('')
    } catch {
      setHistory(h => [...h, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    } finally {
      setStreaming(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  const isEmpty = history.length === 0 && !streaming

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-3">

        {isEmpty && (
          <div className="space-y-4 pt-2">
            <div className="bg-white rounded-2xl shadow-card px-4 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Hey {firstName} 👋 I&apos;m your AI hair coach. Ask me anything about your treatments, hair loss progression, or what steps to take next.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium px-1">Suggested questions</p>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="w-full text-left bg-white rounded-xl shadow-card px-4 py-3 text-xs text-gray-600 active:bg-gray-50 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-[80%] bg-primary text-white text-sm px-4 py-3 rounded-2xl rounded-tr-md leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-[88%] bg-white shadow-card px-4 py-3 rounded-2xl rounded-tl-md">
                <div
                  className="text-sm text-gray-700 leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-1 [&_li]:text-gray-600 [&_p]:mb-1 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                />
              </div>
            )}
          </div>
        ))}

        {/* Streaming bubble */}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[88%] bg-white shadow-card px-4 py-3 rounded-2xl rounded-tl-md">
              {streamingText ? (
                <div
                  className="text-sm text-gray-700 leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:my-1 [&_p]:mb-1 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(streamingText) }}
                />
              ) : (
                <div className="flex gap-1 items-center py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 pt-2">
        <div className="flex items-end gap-2 bg-white rounded-2xl shadow-card px-4 py-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask your hair coach…"
            rows={1}
            disabled={streaming}
            className="flex-1 resize-none text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent leading-relaxed max-h-32"
            style={{ minHeight: 24 }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || streaming}
            className="w-8 h-8 rounded-xl bg-primary disabled:opacity-30 flex items-center justify-center shrink-0 active:scale-95 transition-all"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-gray-300 text-center mt-2">Not medical advice. Consult a doctor for treatment decisions.</p>
      </div>

    </div>
  )
}
