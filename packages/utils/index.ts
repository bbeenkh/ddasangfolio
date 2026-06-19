import dayjs from "dayjs"

/**
 * 현재 날짜 획득 (dayjs)
 * @returns 
 */
export function getCurDate() {
  return dayjs().toDate();
}