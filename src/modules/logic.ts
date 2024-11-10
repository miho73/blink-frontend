function NOT(a: undefined | boolean): boolean {
  return !a;
}

function XOR(a: undefined | boolean, b: undefined | boolean): boolean {
  const c = a || false;
  const d = b || false;
  return (c || d) && !(c && d);
}

function NXOR(a: undefined | boolean, b: undefined | boolean): boolean {
  const c = a || false;
  const d = b || false;
  return NOT((c || d) && !(c && d));
}

export {
  XOR,
  NOT,
  NXOR
}
