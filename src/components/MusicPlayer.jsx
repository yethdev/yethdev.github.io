import { useState, useRef, useEffect, useCallback } from 'react'
import { Play } from 'lucide-react'
import './MusicPlayer.css'

const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

export default function MusicPlayer() {
  const audio = useRef(null)
  const player = useRef(null)
  const ctx = useRef(null)
  const gain = useRef(null)
  const analyser = useRef(null)
  const raf = useRef(null)
  const bars = useRef([])
  const loaded = useRef(false)
  const [playing, setPlaying] = useState(false)
  const [vol, setVol] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const [volOpen, setVolOpen] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (audio.current) audio.current.volume = 1
  }, [])

  function initAudio() {
    if (ctx.current) return
    const c = new AudioContext()
    const src = c.createMediaElementSource(audio.current)
    const g = c.createGain()
    const a = c.createAnalyser()
    a.fftSize = 64
    g.gain.value = 0
    src.connect(g)
    g.connect(a)
    a.connect(c.destination)
    ctx.current = c
    gain.current = g
    analyser.current = a
  }

  function vizOn() {
    const a = analyser.current
    if (!a) return
    const buf = new Uint8Array(a.frequencyBinCount)
    const loop = () => {
      a.getByteFrequencyData(buf)
      ;[1, 3, 6, 10].forEach((bin, i) => {
        if (bars.current[i])
          bars.current[i].style.transform = `scaleY(${0.15 + (buf[bin] / 255) * 0.85})`
      })
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
  }

  function vizOff() {
    cancelAnimationFrame(raf.current)
    bars.current.forEach(b => { if (b) b.style.transform = 'scaleY(0.15)' })
  }

  useEffect(() => {
    if (!volOpen) return
    const close = (e) => {
      if (player.current && !player.current.contains(e.target)) setVolOpen(false)
    }
    document.addEventListener('touchstart', close)
    return () => document.removeEventListener('touchstart', close)
  }, [volOpen])

  const fade = useCallback((to, dur = 0.5) => {
    const g = gain.current
    if (!g) return
    const t = ctx.current.currentTime
    g.gain.cancelScheduledValues(t)
    g.gain.setValueAtTime(g.gain.value, t)
    g.gain.linearRampToValueAtTime(to, t + dur)
  }, [])

  async function toggle() {
    const el = audio.current
    if (!el) return
    if (playing) {
      fade(0, 0.5)
      setTimeout(() => { el.pause(); vizOff() }, 550)
      setPlaying(false)
    } else {
      if (!loaded.current) {
        const _p = [61, 81, 4].map(v => String.fromCharCode(v ^ 98)).join('')
        const r = await fetch('https://yeth.dev/' + _p)
        el.src = URL.createObjectURL(new Blob([await r.arrayBuffer()], { type: 'audio/mpeg' }))
        el.loop = true
        loaded.current = true
      }
      initAudio()
      if (ctx.current.state === 'suspended') ctx.current.resume()
      gain.current.gain.cancelScheduledValues(ctx.current.currentTime)
      gain.current.gain.setValueAtTime(0, ctx.current.currentTime)
      await el.play()
      fade(vol, 0.5)
      vizOn()
      if (!isMobile) { setToast(true); setTimeout(() => setToast(false), 2000) }
      setPlaying(true)
    }
  }

  return (
    <>
      {toast && (
        <div className="music-toast">
          <span className="music-toast-title">Double Trio 2</span>
          <span className="music-toast-artist">By Storm</span>
        </div>
      )}
      <div className="music-player" ref={player} onMouseLeave={() => setVolOpen(false)}>
      <audio ref={audio} />
      {!isMobile && (
        <div className={`music-volume${volOpen ? ' visible' : ''}`}>
          <input
            type="range" min="0" max="1" step="0.01"
            value={vol}
            onChange={e => {
              const v = +e.target.value
              setVol(v)
              if (gain.current && playing) {
                gain.current.gain.cancelScheduledValues(ctx.current.currentTime)
                gain.current.gain.setValueAtTime(v, ctx.current.currentTime)
              }
              setMuted(v === 0)
            }}
            className="volume-slider"
            orient="vertical"
          />
        </div>
      )}
      <button
        className={`music-btn${playing ? ' playing' : ''}`}
        onClick={() => toggle()}
        onContextMenu={e => {
          e.preventDefault()
          if (!audio.current) return
          audio.current.muted = !muted
          setMuted(!muted)
        }}
      >
        {playing
          ? <span className="music-eq">
              <span ref={el => bars.current[0] = el} />
              <span ref={el => bars.current[1] = el} />
              <span ref={el => bars.current[2] = el} />
              <span ref={el => bars.current[3] = el} />
            </span>
          : <Play size={18} />
        }
      </button>
    </div>
    </>
  )
}
