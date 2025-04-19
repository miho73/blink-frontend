function trimContent(content: string, len: number): string {
  return content.length > len ? content.slice(0, len) + '...' : content;
}

function numberLeftPad(num: number, len: number): string {
  return num.toString().padStart(len, '0');
}

export {
  trimContent, numberLeftPad
}
