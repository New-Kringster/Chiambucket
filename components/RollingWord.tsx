'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

interface RollingWordProps {
  words: string[];
  interval?: number;
  startDelay?: number;
  ariaLabel?: string;
}

/** Smoothly cycles through `words` as a gradient `<em>`: spring-eased width,
 *  blurred cross-fade. Drives the "Creating with [Intention/Purpose/...]" rolls
 *  and any other `.hp-roll` usage; surrounding `em` rules supply the gradient/font. */
export default function RollingWord({ words, interval = 2800, startDelay = 0, ariaLabel }: RollingWordProps) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number | string>('auto');
  const measureRef = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = measureRef.current?.children[index] as HTMLElement | undefined;
    if (node) setWidth(node.getBoundingClientRect().width);
  }, [index]);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    let id: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    }, startDelay);
    return () => { clearTimeout(start); if (id) clearInterval(id); };
  }, [words.length, interval, startDelay, reduceMotion]);

  return (
    <motion.span
      className="hp-roll"
      animate={{ width }}
      transition={{ type: 'spring', stiffness: 170, damping: 24, mass: 0.8 }}
      aria-label={ariaLabel ?? words[0]}
    >
      <span ref={measureRef} className="hp-roll-measure" aria-hidden="true">
        {words.map((w) => <em key={w}>{w}</em>)}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.em
          key={words[index]}
          aria-hidden="true"
          initial={reduceMotion ? false : { y: 16, opacity: 0, filter: 'blur(7px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={reduceMotion ? undefined : { y: -16, opacity: 0, filter: 'blur(7px)' }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.em>
      </AnimatePresence>
    </motion.span>
  );
}
