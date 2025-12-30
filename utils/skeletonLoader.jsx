import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonMultiText() {
  return (
    <div className="flex flex-col w-full h-full space-y-3 p-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index % 3 === 0 ? "w-5/6" : index % 5 === 0 ? "w-4/6" : "w-full"}`}
        />
      ))}
    </div>
  );
}

export function SkeletonBlock() {
  return (
    <div className="flex w-full min-h-[10vh] mb-4">
      <Skeleton className="w-full rounded-sm"/>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col w-full h-full space-y-3 p-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <Skeleton 
        key={index}
        className="h-20 w-full" />
      ))}
    </div>
  )
}

export function SkeletonFieldValue() {
  return (
    <div className="absolute inset-0 flex items-center px-2">
      <Skeleton className="h-3 w-[40vw] rounded-xs bg-stone-300" />
    </div>
  )
}

export function SkeletonControllerFieldValue() {
  return (
    <div className="absolute inset-0 flex items-center px-2 pointer-events-none">
      <Skeleton className="h-3 w-[20vw] rounded-xs bg-stone-300" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-muted">
            {Array.from({ length: 8 }).map((_, i) => (
              <th key={i} className="p-2">
                <Skeleton className="h-4 w-[80px]" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <td key={colIndex} className="p-2 text-center">
                  <Skeleton className="h-4 w-[80px]" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

