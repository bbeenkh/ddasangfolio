import useApiLogStore, { type IApiLogEntry } from '@/shared/model/apiLogStore'

/**
 * # devFetch
 * ---
 * - 간단설명: fetch 래퍼, 요청/응답을 apiLogStore에 자동 기록
 * - 제약사항 및 특이사항:
 *   - NEXT_PUBLIC_PROJECT_ENV가 "local"이 아니면 일반 fetch와 동일
 *   - 응답 body를 clone하여 로그에 기록 (원본 Response는 그대로 반환)
 * ---
 * @param input fetch 입력 (URL 또는 Request)
 * @param init fetch 옵션
 * @example
 * const res = await devFetch('/api/users', { method: 'GET' })
 */
export default async function devFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  if (process.env.NEXT_PUBLIC_PROJECT_ENV !== 'local') {
    return fetch(input, init)
  }

  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
  const method = (init?.method ?? 'GET').toUpperCase()
  const start = Date.now()

  let requestData: unknown = undefined
  if (init?.body) {
    try {
      requestData = JSON.parse(init.body as string)
    } catch {
      requestData = init.body
    }
  }

  const headersObj: Record<string, string> = {}
  if (init?.headers) {
    const h = new Headers(init.headers)
    h.forEach((v, k) => { headersObj[k] = v })
  }

  try {
    const res = await fetch(input, init)
    const duration = Date.now() - start

    let responseData: unknown = undefined
    const resHeaders: Record<string, string> = {}
    res.headers.forEach((v, k) => { resHeaders[k] = v })

    try {
      const clone = res.clone()
      responseData = await clone.json()
    } catch {
      /* 응답이 JSON이 아닌 경우 무시 */
    }

    const log: IApiLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      method,
      url,
      status: res.status,
      duration,
      timestamp: Date.now(),
      request: { headers: headersObj, data: requestData },
      response: { headers: resHeaders, data: responseData },
    }

    useApiLogStore.getState().addLog(log)
    return res
  } catch (err) {
    const duration = Date.now() - start

    const log: IApiLogEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      method,
      url,
      status: null,
      duration,
      timestamp: Date.now(),
      error: err instanceof Error ? err.message : String(err),
      request: { headers: headersObj, data: requestData },
    }

    useApiLogStore.getState().addLog(log)
    throw err
  }
}
