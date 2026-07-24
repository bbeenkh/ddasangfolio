import { create } from 'zustand'

/**
 * API 로그 항목
 * - id = 고유 식별자
 * - method = HTTP 메서드
 * - url = 요청 URL
 * - status = 응답 상태 코드 (에러 시 null)
 * - duration = 요청 소요 시간 (ms)
 * - timestamp = 요청 시각
 * - error = 에러 메시지 (있을 경우)
 */
export interface IApiLogEntry {
  /** 고유 식별자 */
  id: string
  /** HTTP 메서드 */
  method: string
  /** 요청 URL */
  url: string
  /** 응답 상태 코드 (에러 시 null) */
  status: number | null
  /** 요청 소요 시간 (ms) */
  duration: number
  /** 요청 시각 */
  timestamp: number
  /** 에러 메시지 */
  error?: string
  /** 요청 정보 */
  request: {
    headers?: Record<string, string>
    params?: Record<string, string>
    data?: unknown
  }
  /** 응답 정보 */
  response?: {
    headers?: Record<string, string>
    data?: unknown
  }
}

interface IApiLogStore {
  logs: IApiLogEntry[]
  addLog: (log: IApiLogEntry) => void
  clearLogs: () => void
}

const MAX_LOGS = 100

/**
 * # useApiLogStore
 * ---
 * - 간단설명: API 요청/응답 로그를 저장하는 zustand 스토어
 * - 제약사항 및 특이사항:
 *   - 최대 100개 로그 보관
 *   - 개발 환경 디버깅 전용
 * ---
 * @example
 * const logs = useApiLogStore((s) => s.logs)
 */
const useApiLogStore = create<IApiLogStore>((set) => ({
  logs: [],
  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs].slice(0, MAX_LOGS),
    })),
  clearLogs: () => set({ logs: [] }),
}))

export default useApiLogStore
