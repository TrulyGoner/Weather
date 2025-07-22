export default function ForecastCardSkeleton() {
    return (
      <div className="forecast-card bg-white rounded-xl p-4 card-shadow animate-pulse">
        <div className="h-4 w-2/5 bg-gray-200 rounded mb-1"></div> {/* Date */}
        <div className="flex items-center space-x-2">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div> {/* Emoji */}
          <div className="h-5 w-16 bg-gray-200 rounded"></div> {/* Temp range */}
        </div>
        <div className="h-3 w-1/2 bg-gray-200 rounded mt-2"></div> {/* Description */}
      </div>
    );
  }