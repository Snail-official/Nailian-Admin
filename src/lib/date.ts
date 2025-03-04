/**
 * UTC 날짜를 한국 시간(KST)으로 변환하여 포맷팅합니다.
 * @param date 변환할 날짜 (Date 객체 또는 ISO 문자열)
 * @param format 포맷 옵션 ('datetime' | 'date' | 'time')
 * @returns 포맷팅된 날짜 문자열
 */
export function formatToKST(
  date: Date | string | number,
  format: 'datetime' | 'date' | 'time' = 'datetime'
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Seoul',
    hour12: false,
  };
  
  if (format === 'datetime' || format === 'date') {
    options.year = 'numeric';
    options.month = '2-digit';
    options.day = '2-digit';
  }
  
  if (format === 'datetime' || format === 'time') {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return new Intl.DateTimeFormat('ko-KR', options).format(dateObj);
}