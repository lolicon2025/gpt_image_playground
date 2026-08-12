import { useEffect } from 'react'
import { useStore } from '../store'

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds} 秒`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins < 60) return secs > 0 ? `${mins} 分 ${secs} 秒` : `${mins} 分钟`
  const hours = Math.floor(mins / 60)
  const remMins = mins % 60
  return `${hours} 小时 ${remMins} 分 ${secs} 秒`
}

export default function AutoRetrySummaryModal() {
  const modalData = useStore((s) => s.autoRetrySummaryModal)
  const closeModal = useStore((s) => s.closeAutoRetrySummaryModal)

  useEffect(() => {
    if (!modalData) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalData, closeModal])

  if (!modalData) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal()
      }}
    >
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 text-gray-900 dark:text-white transition-all">
        {/* 关闭按钮 */}
        <button
          type="button"
          onClick={closeModal}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
          aria-label="关闭"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 头部标题与图标 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight">挂机连续生图任务报告</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">所有请求已结算完毕，统计详情如下</p>
          </div>
        </div>

        {/* 统计指标卡片网格 */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-xs">
          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">目标成功</span>
            <span className="text-base font-semibold font-mono text-blue-600 dark:text-blue-400">
              {modalData.targetCount} <span className="text-xs font-normal">张</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">实际成功</span>
            <span className="text-base font-semibold font-mono text-green-600 dark:text-green-400">
              {modalData.successCount} <span className="text-xs font-normal">张</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">设定并发</span>
            <span className="text-base font-semibold font-mono">
              {modalData.concurrency} <span className="text-xs font-normal">个</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">发起总请求</span>
            <span className="text-base font-semibold font-mono">
              {modalData.totalAttempts} <span className="text-xs font-normal">次</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">失败请求数</span>
            <span className="text-base font-semibold font-mono text-red-500 dark:text-red-400">
              {modalData.failedAttempts} <span className="text-xs font-normal">次</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] flex flex-col gap-1">
            <span className="text-gray-500 dark:text-gray-400">挂机总耗时</span>
            <span className="text-base font-semibold font-mono text-purple-600 dark:text-purple-400">
              {formatDuration(modalData.durationSeconds)}
            </span>
          </div>
        </div>

        {/* 底部按钮 */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs transition-colors shadow-sm focus:outline-none"
          >
            确 定
          </button>
        </div>
      </div>
    </div>
  )
}
