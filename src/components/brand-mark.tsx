export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect x="2" y="2" width="28" height="28" rx="8" className="fill-pine" />
      <path
        d="M16 7.5c-4.2 3.2-7 6.8-7 10.4 0 3.4 2.8 6.1 7 6.1s7-2.7 7-6.1c0-3.6-2.8-7.2-7-10.4Z"
        className="fill-pine-fg"
      />
      <path
        d="M16 12.2c-1.9 1.5-3.1 3.1-3.1 4.7 0 1.6 1.3 2.8 3.1 2.8s3.1-1.2 3.1-2.8c0-1.6-1.2-3.2-3.1-4.7Z"
        className="fill-pine"
      />
    </svg>
  );
}
