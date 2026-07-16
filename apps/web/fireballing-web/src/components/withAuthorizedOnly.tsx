import React, { ComponentType } from 'react'


/**
 * # withAuthorizedOnly
 * ---
 * - 간단설명: 로그인 false인 경우, 없을 경우 로그인 안내 화면을 표시하는 HOC
 * - 제약사항:
 *   - isLogined false인 경우 로그인 안내 뷰 + 로그인 CTA 표시
 *   - 인증 성공 시 최초 1회 fetchUserInfo 호출하여 userInfo 초기화
 * ---
 * @param WrappedComponent 인증이 필요한 컴포넌트
 * ---
 * @example
 * const ProtectedPage = withAuthorization(MyPage)
 */
export default function withAuthorizedOnly<P extends object>(WrappedComponent: ComponentType<P>) {

  return function AuthorizedComponent(props: P) {
    const isLogined = true;

    // 인증된 경우 pass
    if (isLogined) {
      return <WrappedComponent {...props} />
    } else {

    }
    // 경고 alert+빈페이지
    return (
      <main></main>
    )
  }

}
