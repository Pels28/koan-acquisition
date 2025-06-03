const ReportSkeleton = () => (
    <div className="min-h-screen bg-white p-8 font-montserrat">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
        {/* Header Skeleton */}
        <div className="mb-8 border-b-2 border-gray-200 pb-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <div className="h-12 w-12 bg-gray-200 rounded mr-4 animate-pulse"></div>
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
  
        {/* Title Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-3/4 mx-auto bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-1/2 mx-auto mt-2 bg-gray-200 rounded animate-pulse"></div>
        </div>
  
        {/* Summary Card Skeleton */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i}>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1"></div>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Section A Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="grid grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i}>
                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mr-2"></div>
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Continue with other sections similarly... */}
      </div>
    </div>
  );

  export default ReportSkeleton