export default function SectionShell({ id, eyebrow, title, desc, children }) {
  return (
    <section id={id} className="relative mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {(eyebrow || title || desc) && (
        <div className="mb-10 max-w-2xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              {eyebrow}
            </div>
          )}
          {title && (
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
          {desc && <p className="mt-3 text-white/70">{desc}</p>}
        </div>
      )}

      {children}
    </section>
  );
}
