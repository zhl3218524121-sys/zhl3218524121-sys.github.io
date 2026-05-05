import { useState, useRef } from 'react'
import { X, Plus, Upload, Lock, Download, Copy, CheckCircle } from 'lucide-react'
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
  const [showExport, setShowExport] = useState(false)
  const [exportStatus, setExportStatus] = useState('idle') // idle | copied
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
            <div className="flex items-center gap-3">
              <span className="text-xs opacity-40">管理员模式</span>
              <button
                onClick={() => setIsAdmin(false)}
                className="text-xs opacity-40 hover:opacity-70 transition-opacity"
              >
                退出
              </button>
            </div>
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

        {/* 管理员功能区：上传 + 导出 */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap gap-3">
            <button
              onClick={() => { setShowUpload(!showUpload); setShowExport(false) }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
            >
              <Plus size={16} />
              {showUpload ? '收起上传' : '添加图片'}
            </button>
            <button
              onClick={() => { setShowExport(!showExport); setShowUpload(false) }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              <Download size={16} />
              {showExport ? '收起导出' : '导出本地图片'}
            </button>
          </div>
        )}

        {/* 上传区域 */}
        {showUpload && (
          <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800/30 text-center">
            <Upload size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm opacity-60 mb-3">点击选择或拖拽图片到此处（仅存入当前浏览器）</p>
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

        {/* 导出区域 */}
        {showExport && <ExportPanel localPhotos={localPhotos} status={exportStatus} setStatus={setExportStatus} />}

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

// 导出面板组件
function ExportPanel({ localPhotos, status, setStatus }) {
  if (!localPhotos || localPhotos.length === 0) {
    return (
      <div className="mb-8 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30 text-center">
        <p className="text-sm opacity-50">暂无本地图片可导出</p>
      </div>
    )
  }

  const generateJson = () => {
    return localPhotos.map((p, i) => {
      const ext = p.src.includes('image/png') ? 'png' : 'jpg'
      const filename = `gallery_${i + 1}.${ext}`
      return {
        id: `gallery-${Date.now()}-${i}`,
        src: `/assets/gallery/${filename}`,
        title: p.title || `图片 ${i + 1}`,
        description: p.description || ''
      }
    })
  }

  const downloadAll = () => {
    localPhotos.forEach((p, i) => {
      const ext = p.src.includes('image/png') ? 'png' : 'jpg'
      const filename = `gallery_${i + 1}.${ext}`
      const link = document.createElement('a')
      link.href = p.src
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }

  const copyJson = async () => {
    const json = JSON.stringify(generateJson(), null, 2)
    await navigator.clipboard.writeText(json)
    setStatus('copied')
    setTimeout(() => setStatus('idle'), 2000)
  }

  const jsonConfig = JSON.stringify(generateJson(), null, 2)

  return (
    <div className="mb-8 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/30">
      <h3 className="text-sm font-medium mb-4">导出本地图片到仓库</h3>

      {/* 预览 */}
      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mb-4">
        {localPhotos.map((p, i) => (
          <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700">
            <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={downloadAll}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
        >
          <Download size={14} />
          下载 {localPhotos.length} 张图片
        </button>
        <button
          onClick={copyJson}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          {status === 'copied' ? <CheckCircle size={14} className="text-emerald-600" /> : <Copy size={14} />}
          {status === 'copied' ? '已复制' : '复制 JSON 配置'}
        </button>
      </div>

      {/* 步骤说明 */}
      <div className="text-xs opacity-60 space-y-1 mb-4">
        <p>1. 点击"下载所有图片"，保存到电脑</p>
        <p>2. 把图片复制到项目 <code className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-700">public/assets/gallery/</code> 文件夹</p>
        <p>3. 点击"复制 JSON 配置"，粘贴到 <code className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-700">public/data/photos.json</code></p>
        <p>4. 重新构建并推送</p>
      </div>

      {/* JSON 预览 */}
      <details className="text-xs">
        <summary className="opacity-40 cursor-pointer hover:opacity-70 transition-opacity select-none mb-2">
          查看 JSON 配置
        </summary>
        <pre className="p-4 rounded-lg bg-stone-100 dark:bg-stone-900/50 overflow-x-auto text-[11px] leading-relaxed opacity-70">
          {jsonConfig}
        </pre>
      </details>
    </div>
  )
}
