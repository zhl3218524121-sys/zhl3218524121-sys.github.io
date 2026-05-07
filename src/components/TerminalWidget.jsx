import { useState, useEffect, useRef } from 'react'
import { Terminal, X } from 'lucide-react'

const COMMANDS = {
  help: {
    output: [
      '可用命令：',
      '  whoami    - 关于我',
      '  skills    - 技术栈',
      '  projects  - 项目列表',
      '  contact   - 联系方式',
      '  clear     - 清屏',
      '  help      - 显示此帮助',
    ],
  },
  whoami: {
    output: [
      '章海林 (Zhang Hailin)',
      '═══════════════════════════════════════',
      '身份：控制科学与工程 / 机器人学 / 嵌入式系统研发',
      '状态：备战考研 (浙江大学)',
      '位置：中国',
      '',
      '擅长将自动控制理论转化为实际的硬件驱动逻辑。',
      '追求在技术深度与系统稳定性之间实现最优平衡。',
    ],
  },
  skills: {
    output: [
      '技术栈：',
      '═══════════════════════════════════════',
      '  [控制系统]  闭环控制 / PID 调参 / MATLAB Simulink',
      '  [嵌入式]    STM32 / ARM Cortex-M / FreeRTOS / PWM',
      '  [网络]      TCP/IP / 拥塞控制 / BBR / Linux 内核',
      '  [语言]      C/C++ / Python / MATLAB / Shell',
      '  [工具]      Git / Docker / KiCad / 示波器',
    ],
  },
  projects: {
    output: [
      '项目列表：',
      '═══════════════════════════════════════',
      '  1. 智能控制系统设计与底层驱动实现',
      '     → STM32 + 串级 PID + CAN 总线',
      '',
      '  2. 复杂动力学系统建模与数据分析',
      '     → MATLAB + 逆运动学 + 数值分析',
      '',
      '  3. 高性能网络通讯环境构建与协议调优',
      '     → BBR + DPDK + Linux 内核调优',
      '',
      '输入 "open 1" 查看项目详情',
    ],
  },
  contact: {
    output: [
      '联系方式：',
      '═══════════════════════════════════════',
      '  邮箱：3218524121@qq.com',
      '  GitHub：github.com/zhl3218524121-sys',
      '  状态：开放合作 / 欢迎技术交流',
    ],
  },
  open: {
    output: ['用法：open [项目编号]  例如：open 1'],
  },
  'open 1': {
    output: ['正在打开项目 1...', '请访问 /works/1'],
  },
  'open 2': {
    output: ['正在打开项目 2...', '请访问 /works/2'],
  },
  'open 3': {
    output: ['正在打开项目 3...', '请访问 /works/3'],
  },
}

const WELCOME_LINES = [
  '正在初始化系统...',
  '加载内核模块... [OK]',
  '挂载文件系统... [OK]',
  '启动网络服务... [OK]',
  '加载用户配置... [OK]',
  '',
  '╔═══════════════════════════════════════╗',
  '║  欢迎来到章海林的个人技术空间          ║',
  '║  Welcome to Zhang Hailin\'s Tech Space ║',
  '╚═══════════════════════════════════════╝',
  '',
  '输入 "help" 查看可用命令',
  '',
]

export default function TerminalWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [showWelcome, setShowWelcome] = useState(false)
  const bottomRef = useRef(null)

  // 打字机效果显示欢迎语
  useEffect(() => {
    if (!isOpen || showWelcome) return

    let index = 0
    const interval = setInterval(() => {
      if (index < WELCOME_LINES.length) {
        setLines(prev => [...prev, { type: 'system', text: WELCOME_LINES[index] }])
        index++
      } else {
        setShowWelcome(true)
        clearInterval(interval)
      }
    }, 80)

    return () => clearInterval(interval)
  }, [isOpen])

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const cmd = input.trim().toLowerCase()
    setLines(prev => [...prev, { type: 'input', text: `> ${input}` }])

    if (cmd === 'clear') {
      setLines([])
    } else if (COMMANDS[cmd]) {
      COMMANDS[cmd].output.forEach((line, i) => {
        setTimeout(() => {
          setLines(prev => [...prev, { type: 'output', text: line }])
        }, i * 30)
      })
    } else {
      setLines(prev => [...prev, { type: 'error', text: `命令未找到: ${cmd}` }])
      setTimeout(() => {
        setLines(prev => [...prev, { type: 'output', text: '输入 "help" 查看可用命令' }])
      }, 200)
    }

    setInput('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="打开终端"
      >
        <Terminal size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)]">
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-700/50 bg-stone-900/95 backdrop-blur-xl">
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-stone-800/80 border-b border-stone-700/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-stone-400 font-mono">zhanghailin@dev:~</span>
          </div>
          <button
            onClick={() => { setIsOpen(false); setLines([]); setShowWelcome(false) }}
            className="text-stone-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* 终端内容 */}
        <div className="h-[320px] overflow-y-auto p-4 font-mono text-xs leading-relaxed">
          {lines.map((line, i) => (
            <div
              key={i}
              className={`mb-0.5 ${
                line.type === 'input'
                  ? 'text-emerald-400'
                  : line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'system'
                  ? 'text-stone-500'
                  : 'text-stone-300'
              }`}
            >
              {line.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* 输入框 */}
        <form onSubmit={handleSubmit} className="border-t border-stone-700/50 p-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-mono text-xs">{'>'}</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent text-stone-300 font-mono text-xs outline-none placeholder:text-stone-600"
              placeholder="输入命令..."
              autoFocus
              spellCheck={false}
            />
          </div>
        </form>
      </div>
    </div>
  )
}
