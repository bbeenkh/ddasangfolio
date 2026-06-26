interface ITruncateString {
  value: string;
  limit?: number;
  attach?: string;
}
/**
 * 문자열이 n글자 이상일 때 문자열 자른 후 반환
 * @param {string} value 사용할 문자열
 * @param {number} limit 글자 수 제한
 * @param {string} attach 뒤에 붙일 문자
 */
export const truncateString = ({
  value,
  limit = 3,
  attach = '...',
}: ITruncateString) => {
  return value.length > limit ? value.slice(0, limit) + attach : value;
};
