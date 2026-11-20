import { Fragment, type ReactNode } from 'react';

/** fill() for copy whose placeholders hold markup: fillNode('{n} of 5', { n: <b>3</b> }) -> [<b>3</b>, ' of 5']. */
export function fillNode(s: string, vars: Record<string, ReactNode>): ReactNode {
  return s.split(/(\{\w+\})/).map((part, i) => {
    const k = part.slice(1, -1);
    return /^\{\w+\}$/.test(part) && k in vars ? <Fragment key={i}>{vars[k]}</Fragment> : part;
  });
}
