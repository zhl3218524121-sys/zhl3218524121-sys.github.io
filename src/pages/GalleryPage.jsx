import { useState, useRef } from 'react'
import { X, Plus, Upload, Lock } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'

export default function GalleryPage() {
  const { data: photos } = useJsonData('/data/photos.json')
  const [lightbox, setLightbox] = useState(null)
  const [localPhotos, setLocalPhotos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gallery-local') || '[]')
    } catch {
      return []
    }
  })
  const [showUpload, setShowUpload] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const fileRef = useRef(null)

  const allPhotos = [...(photos || []), ...localPhotos]

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newPhoto = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          src: ev.target.result,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '本地上传',
          isLocal: true,
        }
        setLocalPhotos(prev => {
          const updated = [...prev, newPhoto]
          localStorage.setItem('gallery-local', JSON.stringify(updated))
          return updated
        })
      }
      reader.readAsDataURL(file)
    })
    setShowUpload(false)
  }

  const deleteLocalPhoto = (id) => {
    setLocalPhotos(prev => {
      const updated = prev.filter(p => p.id !== id)
      localStorage.setItem('gallery-local', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-semibold mb-2">灵感板</h1>
            <p className="text-sm opacity-50">记录旅行、摄影与生活碎片</p>
          </div>
          {isAdmin ? (
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              添加图片
            </button>
          ) : (
            <button
              onClick={() => {
                const pwd = prompt('请输入管理员密码')
                if (pwd === 'admin888') setIsAdmin(true)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm opacity-60 hover:opacity-100 transition-opacity"
            >
              <Lock size={14} />
              管理
            </button>
          )}
        </div>

        {/* 上传区域 */}
        {showUpload && (
          <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800/30 text-center">
            <Upload size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm opacity-60 mb-3">点击选择或拖拽图片到此处</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-stone-700 text-sm hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
            >
              选择文件
            </button>
          </div>
        )}

        {/* 瀑布流布局 */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
          {allPhotos.map(photo => (
            <div
              key={photo.id}
              className="group relative break-inside-avoid rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer"
              onClick={() => setLightbox(photo)}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                <h3 className="text-white font-medium text-sm mb-1">{photo.title}</h3>
                <p className="text-white/70 text-xs leading-relaxed">{photo.description}</p>
              </div>
              {/* 本地图片删除按钮 - 仅管理员可见 */}
              {photo.isLocal && isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteLocalPhoto(photo.id) }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 全览 Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
          >
            <X size={20} />
          </button>
          <div className="max-w-5xl max-h-[90vh] flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <img
              src={lightbox.src}
              alt={lightbox.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 text-center">
              <h3 className="text-white font-medium text-lg">{lightbox.title}</h3>
              <p className="text-white/60 text-sm mt-1">{lightbox.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
