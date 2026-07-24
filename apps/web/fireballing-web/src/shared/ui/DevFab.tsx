'use client'

/**
 * # DevFab
 * ---
 * - 간단설명: 로컬 환경에서만 노출되는 디버그용 FAB 버튼, 클릭 시 /dev-tools 팝업 오픈
 * - 제약사항 및 특이사항:
 *   - NEXT_PUBLIC_PROJECT_ENV가 "local"인 경우에만 렌더링
 *   - 우측 하단 고정 위치
 * ---
 * @example
 * <DevFab />
 */
export default function DevFab() {
  if (process.env.NEXT_PUBLIC_PROJECT_ENV !== 'local') return null

  const handleClick = () => {
    window.open('/dev-tools', '_blank', 'width=720,height=560')
  }

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg hover:bg-gray-700 active:scale-95 transition-transform"
      aria-label="Dev Tools"
      title="Dev Tools"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    </button>
  )
}
