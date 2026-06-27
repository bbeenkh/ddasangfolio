/**
 * # UserProfile
 * ---
 * - 간단설명: 사용자 기본 프로필 정보 인터페이스
 * - id: Supabase Auth의 user.id
 * - email: 사용자 이메일
 * - name: 사용자 이름 (user_metadata.name)
 * - profileImage: 프로필 이미지 URL (user_metadata.avatar_url)
 */
export interface UserProfile {
  /** Supabase Auth user ID */
  id: string
  /** 사용자 이메일 */
  email: string
  /** 사용자 이름 */
  name: string | null
  /** 프로필 이미지 URL */
  profileImage: string | null
}
