import { marked } from 'marked'
import katex from 'katex'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-matlab'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'

/**
 * 预处理 Markdown 中的数学公式
 * 将 $$...$$（块级）和 $...$（行内）替换为 KaTeX 渲染的 HTML
 * 注意：跳过代码块和行内代码中的 $ 符号
 */
function renderMathExpressions(markdown) {
  if (!markdown) return markdown
  const lines = markdown.split('\n')
  const result = []
  let inCodeBlock = false
  let blockMathBuffer = []
  let collectingBlockMath = false

  const renderInlineMath = (text) => {
    return text.replace(/\$([^\$\n]+?)\$/g, (match, expr) => {
      try {
        return katex.renderToString(expr.trim(), {
          displayMode: false,
          throwOnError: false,
          output: 'html',
        })
      } catch {
        return match
      }
    })
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed.startsWith('```')) {
      if (collectingBlockMath) {
        result.push('$$', ...blockMathBuffer)
        blockMathBuffer = []
        collectingBlockMath = false
      }
      inCodeBlock = !inCodeBlock
      result.push(line)
      continue
    }

    if (inCodeBlock) {
      result.push(line)
      continue
    }

    // 单行块级公式 $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      const expr = trimmed.slice(2, -2)
      try {
        result.push(katex.renderToString(expr.trim(), {
          displayMode: true,
          throwOnError: false,
          output: 'html',
        }))
      } catch {
        result.push(line)
      }
      continue
    }

    // 独立成行的 $$ 块级公式边界
    if (trimmed === '$$') {
      if (!collectingBlockMath) {
        collectingBlockMath = true
        blockMathBuffer = []
      } else {
        const expr = blockMathBuffer.join('\n')
        try {
          result.push(katex.renderToString(expr.trim(), {
            displayMode: true,
            throwOnError: false,
            output: 'html',
          }))
        } catch {
          result.push('$$', ...blockMathBuffer, '$$')
        }
        blockMathBuffer = []
        collectingBlockMath = false
      }
      continue
    }

    if (collectingBlockMath) {
      blockMathBuffer.push(line)
      continue
    }

    // 行内公式（按行内代码分割保护）
    const parts = line.split(/(`[^`]*`)/g)
    const processed = parts.map((part) => {
      if (part.startsWith('`') && part.endsWith('`')) return part
      return renderInlineMath(part)
    }).join('')
    result.push(processed)
  }

  if (collectingBlockMath) {
    result.push('$$', ...blockMathBuffer)
  }

  return result.join('\n')
}

// 语言别名映射
const langAliases = {
  c: 'c',
  h: 'c',
  cpp: 'cpp',
  'c++': 'cpp',
  py: 'python',
  python: 'python',
  matlab: 'matlab',
  m: 'matlab',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
}

function highlightCode(code, lang) {
  const language = langAliases[(lang || '').toLowerCase()]
  const escaped = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (!language) return escaped

  try {
    const grammar = Prism.languages[language]
    if (!grammar) return escaped
    return Prism.highlight(code, grammar, language)
  } catch {
    return escaped
  }
}

// 自定义 renderer
const renderer = {
  code({ text, lang }) {
    const language = lang || ''

    // Mermaid 图表：输出占位 div，由组件端加载 CDN 后渲染
    if (language.toLowerCase() === 'mermaid') {
      return `<div class="mermaid-wrapper my-4 flex justify-center"><div class="mermaid">${text}</div></div>`
    }

    const highlighted = highlightCode(text, language)
    return `<pre class="rounded-xl bg-stone-100 dark:bg-stone-900/70 overflow-x-auto my-4 border border-stone-200 dark:border-stone-700/50"><code class="font-mono text-xs leading-relaxed opacity-90 block p-4" data-lang="${language}">${highlighted}</code></pre>`
  },

  codespan({ text }) {
    return `<code class="px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-mono border border-stone-200 dark:border-stone-700/50">${text}</code>`
  },

  blockquote({ text }) {
    return `<blockquote class="pl-4 border-l-2 border-stone-300 dark:border-stone-600 my-4 opacity-60 text-sm italic">${marked.parseInline(text)}</blockquote>`
  },

  heading({ text, depth }) {
    const sizes = {
      1: 'text-2xl font-semibold mt-10 mb-5 opacity-95',
      2: 'text-lg font-semibold mt-8 mb-4 opacity-90',
      3: 'text-base font-medium mt-6 mb-3 opacity-80',
      4: 'text-sm font-medium mt-5 mb-2 opacity-70',
    }
    const cls = sizes[depth] || sizes[4]
    if (depth === 2 || depth === 3) {
      return `<h${depth} class="${cls}" data-toc-target="1">${marked.parseInline(text)}</h${depth}>`
    }
    return `<h${depth} class="${cls}">${marked.parseInline(text)}</h${depth}>`
  },

  paragraph({ text }) {
    return `<p class="text-sm leading-relaxed opacity-75 my-3">${marked.parseInline(text)}</p>`
  },

  list({ items, ordered }) {
    const tag = ordered ? 'ol' : 'ul'
    const cls = ordered
      ? 'list-decimal list-inside my-4 space-y-1.5 text-sm opacity-75'
      : 'list-disc list-inside my-4 space-y-1.5 text-sm opacity-75'
    const lis = items.map(item => `<li class="leading-relaxed">${marked.parseInline(item.text)}</li>`).join('')
    return `<${tag} class="${cls}">${lis}</${tag}>`
  },

  link({ href, text }) {
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-emerald-600 dark:text-emerald-400 hover:underline opacity-90">${text}</a>`
  },

  image({ href, text }) {
    return `<img src="${href}" alt="${text || ''}" class="rounded-xl my-4 max-w-full max-h-[600px] object-contain border border-stone-200 dark:border-stone-700/30" loading="lazy" />`
  },

  table({ header, rows }) {
    const thead = header.map(c => `<th class="px-3 py-2 text-left text-xs font-semibold opacity-70 border-b border-stone-200 dark:border-stone-700/50">${marked.parseInline(c.text)}</th>`).join('')
    const tbody = rows.map(row => {
      const tds = row.map(c => `<td class="px-3 py-2 text-sm opacity-60 border-b border-stone-100 dark:border-stone-800/50">${marked.parseInline(c.text)}</td>`).join('')
      return `<tr>${tds}</tr>`
    }).join('')
    return `<div class="overflow-x-auto my-4"><table class="w-full text-left border-collapse"><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`
  },

  strong({ text }) {
    return `<strong class="font-semibold opacity-90">${text}</strong>`
  },

  em({ text }) {
    return `<em class="italic opacity-80">${text}</em>`
  },

  hr() {
    return `<hr class="my-6 border-stone-200 dark:border-stone-700/50" />`
  },
}

marked.setOptions({
  gfm: true,
  breaks: true,
  mangle: false,
})

marked.use({ renderer })

/**
 * 完整解析 Markdown：公式预处理 → marked 解析
 */
export function parseMarkdown(markdown) {
  const withMath = renderMathExpressions(markdown || '')
  return marked.parse(withMath)
}

/**
 * 提取 h2/h3 标题用于 TOC
 */
export function extractHeadings(markdown) {
  if (!markdown) return []
  const lines = markdown.split('\n')
  const headings = []
  let inCodeBlock = false
  lines.forEach(line => {
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      return
    }
    if (inCodeBlock) return
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      headings.push({
        depth: match[1].length,
        text: match[2].trim(),
        id: `toc-heading-${headings.length}`,
      })
    }
  })
  return headings
}

// ========== Mermaid CDN 动态加载 ==========
// mermaid 体积大且按需使用，通过 CDN 加载 UMD 版本，不参与打包
let mermaidLoadingPromise = null

export function loadMermaidFromCDN(version = '11.17.2') {
  if (typeof window === 'undefined') return Promise.reject(new Error('window unavailable'))
  if (window.mermaid) return Promise.resolve(window.mermaid)
  if (mermaidLoadingPromise) return mermaidLoadingPromise

  mermaidLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://cdn.jsdelivr.net/npm/mermaid@${version}/dist/mermaid.min.js`
    script.async = true
    script.onload = () => {
      if (window.mermaid) resolve(window.mermaid)
      else reject(new Error('mermaid 全局变量未找到'))
    }
    script.onerror = () => {
      mermaidLoadingPromise = null
      reject(new Error('从 CDN 加载 mermaid 失败'))
    }
    document.head.appendChild(script)
  })
  return mermaidLoadingPromise
}
