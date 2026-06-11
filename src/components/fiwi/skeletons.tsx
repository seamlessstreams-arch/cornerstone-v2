// ══════════════════════════════════════════════════════════════════════════════
// FiWi TV — loading skeletons
// ══════════════════════════════════════════════════════════════════════════════

export function RowSkeleton({ title, wide = false }: { title?: string; wide?: boolean }) {
  return (
    <section>
      <div className="mb-2 px-4 sm:px-8">
        <div className="fiwi-skeleton h-5 w-44 rounded" />
      </div>
      <div className="fiwi-rail flex gap-3 overflow-hidden px-4 sm:px-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`shrink-0 ${wide ? "w-[230px] aspect-video" : "w-[150px] sm:w-[170px] aspect-[2/3]"} fiwi-skeleton rounded-lg`} />
        ))}
      </div>
    </section>
  );
}

export function HeroSkeleton() {
  return <div className="fiwi-skeleton h-[62vh] min-h-[420px] w-full" />;
}

export function GridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 sm:grid-cols-4 sm:px-8 md:grid-cols-6">
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="fiwi-skeleton aspect-[2/3] rounded-lg" />
      ))}
    </div>
  );
}
