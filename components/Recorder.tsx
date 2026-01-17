'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Recorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])

  const [isRecording, setIsRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isTrimming, setIsTrimming] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const router = useRouter()
  

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: 30 },
        audio: false,
      })

      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })

      const combinedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...micStream.getAudioTracks(),
      ])

      streamRef.current = combinedStream

      const mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm',
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: 'video/webm',
        })

        const url = URL.createObjectURL(blob)
        setVideoUrl(url)
        setHasRecorded(true)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Recording failed:', err)
      alert('Permission denied or recording failed.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    setIsRecording(false)
  }
const handleTrim = async () => {
  if (!videoUrl || endTime === null) return

  setIsTrimming(true)

  try {
    const blob = await fetch(videoUrl).then((res) => res.blob())

    const formData = new FormData()
    formData.append('file', blob, 'recording.webm')
    formData.append('start', String(startTime))
    formData.append('end', String(endTime))

    const res = await fetch('/api/trim', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      console.error('Trim failed')
      return
    }

    const trimmedBlob = await res.blob()
    const trimmedUrl = URL.createObjectURL(trimmedBlob)
    setVideoUrl(trimmedUrl)
  } finally {
    setIsTrimming(false)
  }
}





  const handleUpload = async () => {
    if (!videoUrl) return

    setIsUploading(true)
    try {
      const blob = await fetch(videoUrl).then((r) => r.blob())

      const formData = new FormData()
      formData.append('file', blob, 'trimmed.webm')
      if (endTime !== null) formData.append('duration', String(endTime))

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        console.error('Upload failed')
        alert('Upload failed')
        return
      }

      const data = await res.json()
      if (data?.shareUrl) {
        setShareUrl(data.shareUrl)
        router.push(data.shareUrl)
      }
    } catch (err) {
      console.error('Upload error', err)
      alert('Upload error')
    } finally {
      setIsUploading(false)
    }
  }


  



  return (
    <div className="record-page space-y-4">
      <div className="recorder-controls flex gap-3">
        {!isRecording && !hasRecorded ? (
          <button
            onClick={startRecording}
            disabled={isTrimming || isUploading}
            className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
          >
            Start Recording
          </button>
        ) : isRecording ? (
          <button
            onClick={stopRecording}
            disabled={isTrimming || isUploading}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Stop Recording
          </button>
        ) : null}
      </div>

      {/* Minimal status text */}
      <div>
        {isRecording && <div>Recording...</div>}
        {!isRecording && isTrimming && <div>Trimming...</div>}
        {!isRecording && !isTrimming && isUploading && <div>Uploading...</div>}
      </div>

      {videoUrl && (
        <div className="space-y-2">
          <div className="video-wrap">
            {videoUrl && (
  <video
    src={videoUrl}
    controls
    className="rounded border"
    onLoadedMetadata={(e) => {
      const duration = e.currentTarget.duration
      setEndTime(Math.floor(duration))
    }}
  />
)}

          </div>

          <a
            href={videoUrl}
            download="recording.webm"
            className="text-blue-600 underline"
          >
            Download original recording
          </a>
          {videoUrl && endTime !== null && (
  <div className="space-y-2">
    <div className="flex gap-3">
      <label>
        Start (sec)
        <input
          type="number"
          min={0}
          max={endTime - 1}
          value={startTime}
          onChange={(e) => setStartTime(Number(e.target.value))}
          className="border px-2 ml-2 w-20"
        />
      </label>

      <label>
        End (sec)
        <input
          type="number"
          min={startTime + 1}
          max={endTime}
          value={endTime}
          onChange={(e) => setEndTime(Number(e.target.value))}
          className="border px-2 ml-2 w-20"
        />
      </label>
    </div>

    <button
      onClick={handleTrim}
      disabled={isTrimming}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {isTrimming ? 'Trimming...' : 'Trim Video'}
    </button>

    <div style={{ marginTop: 8 }}>
      <button
        onClick={handleUpload}
        disabled={isUploading || isTrimming}
        className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
      >
        {isUploading ? 'Uploading...' : 'Upload & Share'}
      </button>
    </div>
  </div>
)}




        </div>
      )}
    </div>
  )
}
