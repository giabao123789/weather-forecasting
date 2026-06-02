export function WeatherSkeleton() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.18)] backdrop-blur-xl">
      <div className="animate-pulse space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="h-10 w-48 rounded-full bg-white/10" />
            <div className="h-4 w-40 rounded-full bg-white/10" />
          </div>
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-accent/20 via-white/10 to-accent-soft/20" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-[1.75rem] border border-white/5 bg-slate-950/40"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
