import { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function AudioPlayer() {
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef(null)

  // 预设 BGM 链接（可替换为本地文件）
  const bgmUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress((audio.currentTime / audio.duration) * 100 || 0)
    const onEnd = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnd)
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('ended', onEnd) }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().catch(() => {}); setPlaying(true); setMuted(false); audio.muted = false }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !muted
    setMuted(!muted)
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <audio ref={audioRef} src={bgmUrl} loop preload="none" />
      {open && (
        <div className="mb-3 bg-white/90 dark:bg-stone-800/90 backdrop-blur-md rounded-xl shadow-lg border border-stone-200/40 dark:border-stone-700/40 p-3 w-56 animate-slide-up">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 flex items-center justify-center hover:scale-105 transition-transform">
              {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="text-xs opacity-70 mb-1">{playing ? '正在播放' : '已暂停'}</div>
              <div className="h-1 bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
                <div className="h-full bg-stone-600 dark:bg-stone-300 transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <button onClick={toggleMute} className="opacity-60 hover:opacity-100 transition-opacity">
              {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className={`tooltip w-10 h-10 rounded-full backdrop-blur-md shadow-lg border flex items-center justify-center hover:scale-105 transition-all ${
          playing
            ? 'bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 border-transparent'
            : 'bg-white/90 dark:bg-stone-800/90 border-stone-200/40 dark:border-stone-700/40'
        }`}
        aria-label="音频播放器"
        data-tip={open ? '收起播放器' : '音乐播放器'}
      >
        <Music size={18} />
      </button>
    </div>
  )
}
