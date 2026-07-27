import { AuthManager } from '@fblg/authmanager'

/**
 * # authManager
 * ---
 * - 간단설명: 앱 전역 인증 토큰 관리 싱글톤 인스턴스
 * - 제약사항: 초기 토큰은 null — AuthManagerSync가 세션 로드 후 setTokens 호출
 */
const authManager = new AuthManager({ accessToken: null, refreshToken: null })

export default authManager
