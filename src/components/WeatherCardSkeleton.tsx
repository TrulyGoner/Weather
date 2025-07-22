import { Skeleton } from '@skeletonlabs/skeleton';

export default function WeatherCardSkeleton() {
    return (
      <div className="weather-card bg-white rounded-2xl p-6 card-shadow animate-pulse">
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-2"></div> {/* Title */}
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-4"></div> {/* Time */}
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div> {/* Emoji */}
          <div className="h-12 w-16 bg-gray-200 rounded"></div> {/* Temperature */}
        </div>
        <div className="h-5 w-2/5 bg-gray-200 rounded mt-3"></div> {/* Description */}
      </div>
    );
  }