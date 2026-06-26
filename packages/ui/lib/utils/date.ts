import dayjs from 'dayjs';

export const today = new Date();

/**
 * 날짜 변환 함수
 * 기본 변환 "YYYY-MM-DD"
 */
export const formatedDate = (date: Date | null, format = 'YYYY-MM-DD') => {
  if (!date) return '';

  return dayjs(date).format(format);
};
