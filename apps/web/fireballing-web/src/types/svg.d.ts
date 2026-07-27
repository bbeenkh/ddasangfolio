/**
 * SVG 파일 모듈 타입 선언
 * - ?react 쿼리를 사용한 SVG import를 React 컴포넌트로 인식
 */

declare module '*.svg' {
  export default string
}

declare module '*.svg?react' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default value
}

declare module '*.png' {
  export default string
}

declare module '*.css' {}
declare module '*.scss' {}
