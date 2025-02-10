function ISO8601StringToDate(dateString: string): string {
  const date = new Date(dateString);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
}

function deltaToDateString(delta: number): string {
  const day = Math.floor(delta / 86400000);
  const hour = Math.floor((delta % 86400000) / 3600000);
  const minute = Math.floor((delta % 3600000) / 60000);

  if (day > 365) {
    return `${Math.floor(day / 365)}년 전`;
  }
  if (day > 31) {
    return `${Math.floor(day / 30.5)}달 전`;
  }
  if (day > 7) {
    return `${Math.floor(day / 7)}주 전`;
  }
  if (day > 0) {
    return `${day}일 전`;
  }
  if (hour > 0) {
    return `${hour}시간 전`;
  }
  if (minute > 0) {
    return `${minute}분 전`;
  }
  return '방금 전';
}

export {
  ISO8601StringToDate,
  deltaToDateString
}
