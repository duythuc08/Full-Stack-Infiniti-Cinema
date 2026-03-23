export default function MovieLoading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="w-full h-[500px] lg:h-[600px] bg-muted animate-pulse" />

      {/* Info skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1920px] mx-auto flex gap-6">
        <div className="hidden sm:block w-48 sm:w-56 lg:w-72 flex-none">
          <div className="aspect-[2/3] bg-muted animate-pulse rounded-xl" />
        </div>
        <div className="flex-1 space-y-4 py-4">
          <div className="h-9 w-3/4 bg-muted animate-pulse rounded-xl" />
          <div className="h-5 w-1/3 bg-muted animate-pulse rounded-xl" />
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-7 w-20 bg-muted animate-pulse rounded-full" />
            <div className="h-7 w-16 bg-muted animate-pulse rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded-lg" />
            <div className="h-4 w-4/6 bg-muted animate-pulse rounded-lg" />
          </div>
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-36 bg-muted animate-pulse rounded-xl" />
            <div className="h-11 w-28 bg-muted animate-pulse rounded-xl" />
          </div>
        </div>
      </div>

      {/* Cast skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-[1920px] mx-auto">
        <div className="h-7 w-32 bg-muted animate-pulse rounded-xl mb-6" />
        <div className="flex gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 flex-none w-28">
              <div className="w-24 h-24 rounded-full bg-muted animate-pulse" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
