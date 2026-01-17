import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

type Meta = {
  videoId: string
  createdAt: string
  views: number
  duration: number | null
  watchedSeconds: number
}

export default async function Page({ params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  const { videoId } = (await params) as { videoId: string }

  const dataDir = path.join(process.cwd(), 'data')
  const metaPath = path.join(dataDir, `${videoId}.json`)

  await mkdir(dataDir, { recursive: true })

  let meta: Meta | null = null
  try {
    const raw = await readFile(metaPath, 'utf8')
    meta = JSON.parse(raw) as Meta
  } catch (e) {
    meta = {
      videoId,
      createdAt: new Date().toISOString(),
      views: 0,
      duration: null,
      watchedSeconds: 0,
    }
  }

  meta.views = (meta.views || 0) + 1
  await writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8')

  const videoUrl = `/api/uploads/${videoId}`


  return (
    <div className="prose">
      <h1 className="text-xl font-semibold mb-4">Shared Recording</h1>
      <div className="mb-4">
        <video id="player" src={videoUrl} controls className="w-full max-w-3xl" />
      </div>

      <div id="meta" className="text-sm text-gray-700">
        <div className="mb-1">Views: <span id="views">{meta.views}</span></div>
        <div>Completion: <span id="completion">{computeCompletion(meta)}</span>%</div>
      </div>

      <div className="mt-4">
        <a href="/" className="text-blue-600">Back</a>
      </div>

      <script dangerouslySetInnerHTML={{ __html: clientScript(videoId, meta.duration ?? null) }} />
    </div>
  )
}

function computeCompletion(meta: Meta) {
  if (!meta.duration || meta.duration <= 0) return 0
  const pct = Math.min(100, Math.round((meta.watchedSeconds / meta.duration) * 100))
  return pct
}

function clientScript(videoId: string, duration: number | null) {
  // Minimal client-side script (no framework) to track watch progress.
  // Sends watchedSeconds to the analytics API and updates the completion UI.
  return `  
    (function(){
      const player = document.getElementById('player')
      const viewsEl = document.getElementById('views')
      const completionEl = document.getElementById('completion')

      // Send watchedSeconds to server (debounced)
      let lastSent = 0
      let maxSeen = 0
      let timer = null

      function sendProgress() {
        if (!maxSeen) return
        fetch('/api/analytics/${videoId}', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ watchedSeconds: Math.floor(maxSeen) })
        }).then(res => res.json()).then(data => {
          if (data && data.watchedSeconds !== undefined) {
            const dur = ${duration === null ? 'null' : duration}
            if (dur) {
              const pct = Math.min(100, Math.round((data.watchedSeconds / dur) * 100))
              completionEl.textContent = pct
            }
          }
        }).catch(()=>{})
      }

      player.addEventListener('timeupdate', function(){
        const t = player.currentTime || 0
        if (t > maxSeen) maxSeen = t
        const dur = ${duration === null ? 'null' : duration}
        if (dur) {
          const pct = Math.min(100, Math.round((maxSeen / dur) * 100))
          completionEl.textContent = pct
        }

        if (timer) clearTimeout(timer)
        timer = setTimeout(sendProgress, 1500)
      })

      player.addEventListener('ended', function(){
        // When video ends, persist full duration as watchedSeconds.
        const dur = player.duration || 0
        maxSeen = Math.max(maxSeen, dur)
        sendProgress()
      })
    })();
  `
}
