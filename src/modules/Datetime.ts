function ISO8601StringToDate(dateString: string): string {
  const date = new Date(dateString);

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;
}

export {
  ISO8601StringToDate
}
