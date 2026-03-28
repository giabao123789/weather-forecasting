export function WeatherSkeleton() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="animate-pulse space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="h-10 w-52 rounded-full bg-white/10" />
            <div className="h-4 w-40 rounded-full bg-white/10" />
          </div>
          <div className="h-24 w-24 rounded-full bg-white/10" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 rounded-2xl border border-white/5 bg-slate-950/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
