function trimContent(content: string, len: number): string {
  return content.length > len ? content.slice(0, len) + '...' : content;
}

export {
  trimContent
}
