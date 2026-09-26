/* Braven's signature mark, traced from /images/logo.webp as two pen strokes
   so it can take any ink colour and stay crisp at nav size. */
export default function Mark({ className = '' }: { className?: string }) {
  return (
    <svg className={`pr-mark ${className}`} viewBox="0 0 656 462" aria-hidden="true" focusable="false">
      <path pathLength={1} d="M44 362 C 36 360, 40 350, 46 330 C 80 220, 170 60, 250 44 C 270 40, 283 50, 283 95 C 283 170, 278 260, 282 330 C 285 385, 300 398, 320 394 C 360 386, 420 300, 590 112" />
      <path pathLength={1} d="M383 229 C 440 258, 500 315, 556 385" />
    </svg>
  );
}
