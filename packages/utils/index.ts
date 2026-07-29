import dayjs from "dayjs"
import { isNil, isNaN } from 'lodash-es';

/**
 * 현재 날짜 획득 (dayjs)
 * @returns 
 */
export function getCurDate() {
  return '수정됨';
}

/**
 * # getSafeNumber
 * ---
 * - 간단설명: 안전하게 숫자를 반환하는 유틸 (null, undefined, NaN → 0)
 * - 제약사항 및 특이사항:
 *   - string 타입 입력 시 Number()로 변환 시도
 *   - 숫자 변환 불가한 값(obj, null, undefined etc)은 0 반환
 * ---
 * @param num - 변환할 숫자 값 (number | string | null | undefined)
 * ---
 * @example
 * getSafeNumber(null)      // 0
 * getSafeNumber("123")     // 123
 * getSafeNumber("abc")     // 0
 */
export function getSafeNumber(num: number | string | null | undefined) {

  if (isNil(num)) {
    return 0;
  }

  const _num = Number(num);
  if (isNaN(_num)) {
    return 0;
  }

  return _num;
}

/**
 * # getFormattedNumberStr
 * ---
 * - 간단설명: 숫자에 접두사/접미사를 붙여 포맷된 문자열을 반환
 * - 제약사항 및 특이사항:
 *   - num이 null/undefined이면 placeholder 값 반환 (기본 0)
 * ---
 * @param num - 포맷할 숫자 값
 * @param options - 포맷 옵션
 * @param options.placeholder - 숫자 없을 때 대체 값 (기본: 0)
 * @param options.suffix - 숫자 뒤에 붙일 문자열 (예: "원", "%")
 * @param options.prefix - 숫자 앞에 붙일 문자열 (예: "₩", "$")
 * ---
 * @example
 * getFormattedNumberStr(1000, { suffix: "원" })        // "1000원"
 * getFormattedNumberStr(null, { placeholder: 0 })      // 0
 * getFormattedNumberStr(50, { prefix: "$", suffix: "%" }) // "$50%"
 */
export function getFormattedNumberStr(num: number | null | undefined, options: {
  placeholder?: number;
  suffix?: string;
  prefix?: string;
} = {
    placeholder: 0,
  }) {
  if (isNil(num)) {
    return options.placeholder ?? '';
  }
  return `${options.prefix ?? ''}${num}${options.suffix ?? ''}`
}