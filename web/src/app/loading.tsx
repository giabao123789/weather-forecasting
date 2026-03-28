export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-8 py-10 text-center shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-accent" />
        <div className="space-y-1">
          <p className="font-medium text-white">Loading interface...</p>
          <p className="text-sm text-muted">Preparing the weather experience.</p>
        </div>
      </div>
    </div>
  );
}
