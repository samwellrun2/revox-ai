export default function DashboardLoading() {
  return (
    <div className="max-w-4xl animate-pulse">
      <div className="h-7 w-48 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-72 bg-gray-100 rounded mb-8" />
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-6">
          <div className="h-10 w-48 bg-gray-100 rounded-xl" />
          <div className="h-48 bg-gray-100 rounded-card border-2 border-dashed border-gray-200" />
          <div className="h-12 bg-gray-100 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
        <div>
          <div className="h-32 bg-gray-100 rounded-card" />
        </div>
      </div>
    </div>
  );
}
