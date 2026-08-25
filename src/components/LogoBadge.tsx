/**
 * Rotating circular seal — bilingual text wrapped around an anchor mark.
 * Purely decorative; respects prefers-reduced-motion via .animate-spin-slow.
 */
export default function LogoBadge({ size = 132 }: { size?: number }) {
  const text = "ELVORA SHIPPING · إلفورا للشحن · DUBAI · U.A.E. · ";
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="animate-spin-slow h-full w-full">
        <defs>
          <path id="badge-curve" d="M 100,100 m -76,0 a 76,76 0 1,1 152,0 a 76,76 0 1,1 -152,0" />
        </defs>
        <text className="font-mono" fontSize="11" letterSpacing="1.6" fill="var(--accent)">
          <textPath href="#badge-curve" startOffset="0" textLength="470">
            {text}
          </textPath>
        </text>
      </svg>
      {/* static center mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-[54%] w-[54%] flex-col items-center justify-center rounded-full border border-border bg-primary text-primary-foreground">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 2v11M12 13c-4 0-7 2-7 5 2 1.5 4.5 2 7 2s5-.5 7-2c0-3-3-5-7-5Z" strokeLinejoin="round" />
            <path d="M6 8l6-3 6 3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mt-0.5 font-display text-[0.6rem] tracking-[0.28em]">EST.</span>
        </div>
      </div>
    </div>
  );
}
