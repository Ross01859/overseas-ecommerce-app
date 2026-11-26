const shapes = {
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.7" />
      <path d="m16 16 4.8 4.8" />
    </>
  ),
  bag: (
    <>
      <path d="M4.5 7.5h15l1.1 13h-17z" />
      <path d="M8.5 9V6a3.5 3.5 0 0 1 7 0v3" />
    </>
  ),
  heart: (
    <path d="M20.7 4.9a5 5 0 0 0-7.1 0L12 6.5l-1.6-1.6a5 5 0 0 0-7.1 7L12 20.5l8.7-8.6a5 5 0 0 0 0-7z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  x: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4 12 5 5L20 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  box: (
    <>
      <path d="m12 2 9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5" />
    </>
  ),
  flower: (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx="12"
          cy="6.5"
          rx="2.7"
          ry="5"
          transform={"rotate(" + i * 45 + " 12 12)"}
          fill="currentColor"
          stroke="none"
        />
      ))}
      <circle
        cx="12"
        cy="12"
        r="2.5"
        fill="var(--paper, white)"
        stroke="none"
      />
    </>
  ),
};
export function Icon({ name, size = 20, filled = false }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {shapes[name]}
    </svg>
  );
}
