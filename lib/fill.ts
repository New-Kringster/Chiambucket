/** Fills {name} placeholders in a copy string: fill('{n} points', { n: 4 }) -> '4 points'. */
export function fill(s: string, vars: Record<string, string | number>): string {
  return s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}
