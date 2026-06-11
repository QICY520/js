/** 通用骨架屏块 */
function Bone({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-cream-200 via-cream-100 to-cream-200 rounded-lg ${className}`}
    />
  )
}

export function AuthPageSkeleton() {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-center px-8 max-w-lg mx-auto w-full">
      <div className="text-center mb-10 space-y-3">
        <Bone className="h-8 w-32 mx-auto rounded-full" />
        <Bone className="h-4 w-48 mx-auto" />
      </div>
      <div className="rounded-3xl bg-white p-6 space-y-4 shadow-sm">
        <Bone className="h-10 w-full" />
        <Bone className="h-12 w-full" />
        <Bone className="h-12 w-full" />
        <Bone className="h-12 w-full rounded-full mt-4" />
      </div>
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
      <Bone className="h-10 w-full rounded-2xl" />
      <Bone className="h-40 w-full rounded-2xl" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Bone key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Bone key={i} className="h-48 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export function ListPageSkeleton({ rows = 3 }) {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white p-4 space-y-3 shadow-sm">
          <Bone className="h-4 w-2/3" />
          <Bone className="h-16 w-full" />
          <Bone className="h-8 w-1/2 ml-auto" />
        </div>
      ))}
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="flex min-h-[60vh]">
      <div className="w-24 shrink-0 bg-cream-100 p-2 space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bone key={i} className="h-10 w-full rounded-lg" />
        ))}
      </div>
      <div className="flex-1 p-3 space-y-3">
        <Bone className="h-6 w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Bone key={i} className="h-36 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Bone
