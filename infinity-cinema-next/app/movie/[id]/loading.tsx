export default function MovieLoading() {
  return (
    <div className="min-h-screen">
      <div className="w-full h-[500px] lg:h-[600px] bg-zinc-900 animate-pulse" />
      <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-[1920px] mx-auto space-y-4">
        <div className="h-8 w-1/3 bg-zinc-800 rounded animate-pulse" />
        <div className="h-4 w-1/4 bg-zinc-800 rounded animate-pulse" />
        <div className="h-24 w-full bg-zinc-800 rounded animate-pulse" />
      </div>
    </div>
  );
}
