'use client'

import { useCallback, useState } from 'react'
import useApiLogStore, { type IApiLogEntry } from '@/shared/model/apiLogStore'

type TabKey = 'api-log' | 'package-version' | 'logger'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'api-log', label: 'API Log' },
  { key: 'package-version', label: 'Package Version' },
  { key: 'logger', label: 'Logger' },
]

/* ─── 뱃지 ─── */

/**
 * # StatusBadge
 * ---
 * - 간단설명: HTTP 상태 코드에 따라 색상이 다른 뱃지
 * ---
 * @param status HTTP 상태 코드 (null이면 에러)
 */
function StatusBadge({ status }: { status: number | null }) {
  if (status === null) return <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">ERR</span>
  if (status >= 200 && status < 300) return <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs font-bold text-green-700">{status}</span>
  if (status >= 400 && status < 500) return <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs font-bold text-orange-700">{status}</span>
  if (status >= 500) return <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-bold text-red-700">{status}</span>
  return <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-bold text-gray-700">{status}</span>
}

/**
 * # MethodBadge
 * ---
 * - 간단설명: HTTP 메서드에 따라 색상이 다른 뱃지
 * ---
 * @param method HTTP 메서드
 */
function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-blue-100 text-blue-700',
    POST: 'bg-green-100 text-green-700',
    PUT: 'bg-yellow-100 text-yellow-700',
    PATCH: 'bg-purple-100 text-purple-700',
    DELETE: 'bg-red-100 text-red-700',
  }
  const cls = colors[method] ?? 'bg-gray-100 text-gray-700'
  return <span className={`rounded px-1.5 py-0.5 text-xs font-bold ${cls}`}>{method}</span>
}

/* ─── JSON 뷰어 ─── */

/**
 * # JsonViewer
 * ---
 * - 간단설명: JSON 데이터를 포맷하여 보여주는 블록
 * ---
 * @param label 섹션 라벨
 * @param data 표시할 데이터
 */
function JsonViewer({ label, data }: { label: string; data: unknown }) {
  if (data === undefined || data === null) return null

  let text: string
  try {
    text = typeof data === 'string' ? data : JSON.stringify(data, null, 2)
  } catch {
    text = String(data)
  }

  return (
    <div className="mt-2">
      <p className="mb-1 text-xs font-bold text-gray-500">{label}</p>
      <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600">{text}</pre>
    </div>
  )
}

/* ─── 로그 아이템 ─── */

/**
 * # LogItem
 * ---
 * - 간단설명: 개별 API 로그 항목 (클릭하여 상세 펼치기/접기)
 * ---
 * @param log API 로그 항목
 */
function LogItem({ log }: { log: IApiLogEntry }) {
  const [expanded, setExpanded] = useState(false)

  const time = new Date(log.timestamp)
  const timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`
  const pathOnly = log.url.replace(/^https?:\/\/[^/]+/, '')

  const handleCopy = () => {
    const copyData = JSON.stringify(
      { url: log.url, requestBody: log.request.data ?? null, status: log.status, responseBody: log.response?.data ?? null },
      null,
      2,
    )
    navigator.clipboard.writeText(copyData)
  }

  return (
    <button
      type="button"
      className="mb-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left hover:bg-gray-50"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* 요약 행 */}
      <div className="flex items-center gap-2">
        <MethodBadge method={log.method} />
        <StatusBadge status={log.status} />
        <span className="ml-1 flex-1 truncate text-xs text-gray-500">{pathOnly || log.url}</span>
        <span className="text-[10px] text-gray-400">{log.duration}ms</span>
      </div>

      <div className="mt-1 flex justify-between">
        <span className="text-[10px] text-gray-400">{timeStr}</span>
        <span className="text-[10px] text-gray-400">{expanded ? '접기' : '상세 보기'}</span>
      </div>

      {/* 상세 정보 */}
      {expanded && (
        <div className="mt-3 border-t border-gray-100 pt-3" onClick={(e) => e.stopPropagation()}>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-gray-400">{log.url}</span>
            <button
              type="button"
              className="rounded bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-500 hover:bg-gray-200"
              onClick={handleCopy}
            >
              복사
            </button>
          </div>

          {log.error && (
            <div className="mb-1 mt-1 rounded-lg bg-red-50 p-2">
              <p className="text-xs font-bold text-red-600">Error: {log.error}</p>
            </div>
          )}

          <JsonViewer label="Request Headers" data={log.request.headers} />
          <JsonViewer label="Request Body" data={log.request.data} />
          <JsonViewer label="Response Headers" data={log.response?.headers} />
          <JsonViewer label="Response Body" data={log.response?.data} />
        </div>
      )}
    </button>
  )
}

/* ─── API Log 탭 ─── */

function ApiLogTab() {
  const logs = useApiLogStore((s) => s.logs)
  const clearLogs = useApiLogStore((s) => s.clearLogs)
  const [filter, setFilter] = useState<'all' | 'success' | 'error'>('all')

  const filteredLogs = useCallback(() => {
    if (filter === 'success') return logs.filter((l) => l.status !== null && l.status >= 200 && l.status < 300)
    if (filter === 'error') return logs.filter((l) => l.status === null || l.status! >= 400)
    return logs
  }, [logs, filter])()

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* 필터 + 삭제 */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex gap-1">
          {(['all', 'success', 'error'] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`rounded-full px-3 py-1 text-xs font-semibold ${filter === f ? 'bg-lf-primary text-white' : 'bg-gray-100 text-gray-500'}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? `All (${logs.length})` : f === 'success' ? 'Success' : 'Error'}
            </button>
          ))}
        </div>
        <button type="button" className="text-xs text-gray-400 hover:text-gray-600" onClick={clearLogs}>
          Clear
        </button>
      </div>

      {/* 로그 목록 */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm text-gray-400">로그가 없습니다</p>
          </div>
        ) : (
          filteredLogs.map((log) => <LogItem key={log.id} log={log} />)
        )}
      </div>
    </div>
  )
}

/* ─── Placeholder 탭 ─── */

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-sm text-gray-400">{label} — 준비 중</p>
    </div>
  )
}

/* ─── 메인 페이지 ─── */

/**
 * # DevToolsPage
 * ---
 * - 간단설명: 개발 디버그 도구 팝업 페이지 (API Log / Package Version / Logger 탭)
 * - 제약사항 및 특이사항:
 *   - NEXT_PUBLIC_PROJECT_ENV가 "local"인 경우에만 접근 가능
 *   - DevFab 버튼에서 팝업 형태로 열림
 * ---
 * @example
 * window.open('/dev-tools', '_blank', 'width=720,height=560')
 */
export default function DevToolsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('api-log')

  if (process.env.NEXT_PUBLIC_PROJECT_ENV !== 'local') {
    return <p className="p-8 text-center text-sm text-gray-400">로컬 환경에서만 접근 가능합니다.</p>
  }

  return (
    <div className="flex h-screen flex-col bg-gray-50 font-sans">
      {/* 탭 헤더 */}
      <div className="flex border-b border-gray-200 bg-white">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
              activeTab === key ? 'border-b-2 border-lf-primary text-lf-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => setActiveTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      {activeTab === 'api-log' && <ApiLogTab />}
      {activeTab === 'package-version' && <PlaceholderTab label="Package Version" />}
      {activeTab === 'logger' && <PlaceholderTab label="Logger" />}
    </div>
  )
}
