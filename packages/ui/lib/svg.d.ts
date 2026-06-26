/**
 * svg Import 시 타입 정의
 */

declare module '*.svg' {
  export default string;
}

declare module '*.svg?react' {
  const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default value;
}

declare module '*.png' {
  export default string;
}
