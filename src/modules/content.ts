function trimContent(content: string): string {
  return content.length > 100 ? content.slice(0, 100) + '...' : content;
}

export {
  trimContent
}
