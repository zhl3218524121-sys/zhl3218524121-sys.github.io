import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Github, Play, Wrench, Target, Award, AlertTriangle, Lightbulb, Layers, ZoomIn, X } from 'lucide-react'
import { useJsonData } from '../hooks/useJsonData'
import { TechCategory } from '../components/TechTag'
import CommentSlot from '../components/CommentSlot'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { data: works, loading: worksLoading } = useJsonData('/data/works.json')
  const { data: architectures, loading: archLoading } = useJsonData('/data/architectures.json')

  const work = works?.find(w => w.id === Number(id))
  const architecture = work ? architectures?.[work.id] : null
  const detail = work?.detail

  if (worksLoading || archLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
      </div>
    )
  }

  if (!work) {
    return (
      <div className="pt-24 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">项目未找到</h1>
          <button
            onClick={() => navigate('/works')}
            className="text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            ← 返回作品集
          </button>
        </div>
      </div>
    )
  }

  const archImageUrl = `/assets/architectures/${work.id}.svg`

  return (
    <div className="pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/works')}
          className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity mb-6"
        >
          <ArrowLeft size={16} />
          返回作品集
        </button>

        {/* 封面图 */}
        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 mb-8">
          <img
            src={work.image}
            alt={work.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-semibold mb-3">{work.title}</h1>
        <p className="text-base opacity-60 leading-relaxed mb-8">{work.description}</p>

        {/* 系统架构图 */}
        {architecture && (
          <div className="mb-10">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2 opacity-80">
              <Layers size={16} className="opacity-50" />
              系统架构
            </h2>
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-stone-200/30 dark:border-stone-700/30 bg-white dark:bg-stone-900/50 cursor-zoom-in group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={archImageUrl}
                alt={architecture.title}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <ZoomIn size={12} />
                  点击放大
                </div>
              </div>
            </div>
            <p className="text-xs opacity-40 mt-2 text-center">{architecture.description}</p>
          </div>
        )}

        {/* 技术栈标签 */}
        {work.techCategories && (
          <div className="mb-10 p-6 rounded-2xl bg-stone-50/50 dark:bg-stone-800/20 border border-stone-200/30 dark:border-stone-700/30">
            <h2 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Wrench size={16} className="opacity-50" />
              技术栈
            </h2>
            {work.techCategories.map(tc => (
              <TechCategory key={tc.category} category={tc.category} items={tc.items} />
            ))}
          </div>
        )}

        {/* 项目详情 */}
        {detail && (
          <div className="space-y-8 mb-10">
            {/* 项目背景 */}
            <section>
              <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                <Lightbulb size={16} className="opacity-50" />
                项目背景
              </h2>
              <p className="text-sm opacity-60 leading-relaxed pl-6">{detail.background}</p>
            </section>

            {/* 我的角色 */}
            <section>
              <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                <Target size={16} className="opacity-50" />
                我的角色
              </h2>
              <p className="text-sm opacity-60 leading-relaxed pl-6">{detail.role}</p>
            </section>

            {/* 技术方案 */}
            {detail.techStack && (
              <section>
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                  <Wrench size={16} className="opacity-50" />
                  技术方案
                </h2>
                <div className="pl-6 space-y-2">
                  {Object.entries(detail.techStack).map(([key, value]) => (
                    <div key={key} className="flex items-start gap-2 text-sm">
                      <span className="opacity-40 shrink-0 w-20 capitalize">{key}</span>
                      <span className="opacity-70">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 技术难点 & 解决 */}
            {detail.challenges && (
              <section>
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                  <AlertTriangle size={16} className="opacity-50" />
                  技术难点 & 解决
                </h2>
                <div className="pl-6 space-y-3">
                  {detail.challenges.map((c, i) => (
                    <div key={i} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="opacity-40">难点{i + 1}:</span>
                        <span className="opacity-80">{c.problem}</span>
                      </div>
                      <div className="flex items-center gap-2 pl-14">
                        <span className="opacity-40">→ 解决:</span>
                        <span className="opacity-70 text-emerald-600 dark:text-emerald-400">{c.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 量化成果 */}
            {detail.results && (
              <section>
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                  <Award size={16} className="opacity-50" />
                  量化成果
                </h2>
                <p className="text-sm opacity-80 leading-relaxed pl-6 text-emerald-600 dark:text-emerald-400">
                  {detail.results}
                </p>
              </section>
            )}

            {/* 相关链接 */}
            {detail.links && (
              <section>
                <h2 className="text-sm font-medium mb-3 flex items-center gap-2 opacity-80">
                  <ExternalLink size={16} className="opacity-50" />
                  相关链接
                </h2>
                <div className="pl-6 flex flex-wrap gap-3">
                  {detail.links.demo && detail.links.demo !== '#' && (
                    <a
                      href={detail.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 text-sm hover:opacity-90 transition-opacity"
                    >
                      <Play size={14} />
                      在线演示
                    </a>
                  )}
                  {detail.links.source && detail.links.source !== '#' && (
                    <a
                      href={detail.links.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Github size={14} />
                      源码仓库
                    </a>
                  )}
                  {detail.links.video && (
                    <a
                      href={detail.links.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 text-sm hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Play size={14} />
                      视频演示
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 评论区域 */}
        <div className="mt-12 pt-8 border-t border-stone-200/30 dark:border-stone-700/30">
          <CommentSlot workId={work.id} />
        </div>
      </div>

      {/* 架构图灯箱 */}
      {lightboxOpen && architecture && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={20} />
          </button>
          <img
            src={archImageUrl}
            alt={architecture.title}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
