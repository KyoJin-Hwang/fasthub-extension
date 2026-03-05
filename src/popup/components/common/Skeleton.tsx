export function RepositoryListSkeleton() {
  return (
    <div className="divide-y">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
          <div className="flex gap-4">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PullRequestListSkeleton() {
  return (
    <div className="divide-y">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
          <div className="flex gap-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function IssueListSkeleton() {
  return <PullRequestListSkeleton />;
}
