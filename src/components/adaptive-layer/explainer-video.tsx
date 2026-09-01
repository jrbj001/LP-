'use client'

import { useCallback, useRef, useState } from 'react'
import { Maximize2, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { VIDEO } from './lp-data'

const SRC = '/video/adaptive-layer.mp4'
const POSTER = '/video/adaptive-layer-poster.jpg'

function formatSec(sec: number) {
  const s = Math.max(0, Math.floor(sec))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function ExplainerVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(89)

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    await video.play()
  }, [])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) void play()
    else video.pause()
  }, [play])

  async function fullscreen() {
    const el = stageRef.current
    if (!el) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await el.requestFullscreen()
  }

  return (
    <div
      ref={stageRef}
      className="overflow-hidden rounded-3xl border border-black/[0.08] bg-neutral-950 text-white shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)]"
    >
      <div className="relative aspect-video bg-[#fbfbfa]">
        <video
          ref={videoRef}
          src={SRC}
          poster={POSTER}
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => {
            setPlaying(true)
            setStarted(true)
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false)
            setProgress(1)
          }}
          onTimeUpdate={e => {
            const v = e.currentTarget
            setCurrent(v.currentTime)
            if (v.duration) setProgress(v.currentTime / v.duration)
          }}
          onLoadedMetadata={e => setDuration(e.currentTarget.duration || 89)}
        />

        {!started && (
          <button
            type="button"
            onClick={() => void play()}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/15"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-neutral-950">
              <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
            </span>
            <span className="mt-4 text-[13px] text-neutral-800/80">Assistir · {VIDEO.durationLabel}</span>
          </button>
        )}
      </div>

      <div className="border-t border-white/[0.06] px-4 py-3 sm:px-5">
        <button
          type="button"
          aria-label="Progresso"
          className="group relative h-1.5 w-full rounded-full bg-white/10"
          onClick={e => {
            const video = videoRef.current
            if (!video?.duration) return
            const rect = e.currentTarget.getBoundingClientRect()
            video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration
          }}
        >
          <span className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
        </button>
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-neutral-950"
            aria-label={playing ? 'Pausar' : 'Reproduzir'}
          >
            {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 translate-x-px" fill="currentColor" />}
          </button>
          <button
            type="button"
            onClick={() => {
              const video = videoRef.current
              if (!video) return
              video.muted = !video.muted
              setMuted(video.muted)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
            aria-label={muted ? 'Ligar som' : 'Desligar som'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <p className="ml-1 hidden text-[11px] text-white/40 sm:block">
            {formatSec(current)} / {formatSec(duration)}
          </p>
          <button
            type="button"
            onClick={() => void fullscreen()}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
            aria-label="Tela cheia"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
