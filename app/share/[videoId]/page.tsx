"use client"

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'

export default function Page() {
  const { videoId } = useParams() as { videoId: string }
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [useProxy, setUseProxy] = useState(false)
  const [views, setViews] = useState<number | null>(null)
  const [didCountView, setDidCountView] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoId) return

    async function fetchSigned() {
      try {
        const res = await fetch(`/api/uploads/${videoId}`)
        const json = await res.json()
        if (json?.url) setSignedUrl(json.url)
        else setUseProxy(true)
      } catch (e) {
        setUseProxy(true)
      }
    }

    async function fetchViews() {
      try {
        const r = await fetch(`/api/analytics/${videoId}`)
        const j = await r.json()
        if (typeof j?.views === 'number') setViews(j.views)
      } catch (e) {
        // ignore
      }
    }

    fetchSigned()
    fetchViews()
  }, [videoId])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    function onError() {
      setUseProxy(true)
    }
    function onLoaded() {
      if (v.duration === 0 || Number.isNaN(v.duration)) setUseProxy(true)
    }
    function onPlay() {
      if (didCountView) return
      setDidCountView(true)
      ;(async () => {
        try {
          await fetch(`/api/analytics/${videoId}`, { method: 'POST' })
          const r = await fetch(`/api/analytics/${videoId}`)
          const j = await r.json()
          if (typeof j?.views === 'number') setViews(j.views)
        } catch (e) {
          // ignore
        }
      })()
    }

    v.addEventListener('error', onError)
    v.addEventListener('loadedmetadata', onLoaded)
    v.addEventListener('play', onPlay)
    return () => {
      v.removeEventListener('error', onError)
      v.removeEventListener('loadedmetadata', onLoaded)
      v.removeEventListener('play', onPlay)
    }
  }, [signedUrl, useProxy, didCountView, videoId])

  const shareLink = useProxy ? `/api/uploads/${videoId}/raw` : signedUrl || ''

  return (
    <div style={{ padding: 20 }}>
      <h1>Share</h1>
      <div>
        <video ref={videoRef} controls src={shareLink || undefined} style={{ width: '100%', maxWidth: 720 }} />
      </div>
      <div style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input readOnly value={shareLink ?? ''} style={{ flex: 1 }} />
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(shareLink)
                alert('copied')
              } catch (e) {
                console.error(e)
              }
            }}
          >
            Copy
          </button>
        </div>
        <div style={{ marginTop: 8 }}>
          Views: {views === null ? '—' : views}
        </div>
      </div>
    </div>
  )
}
