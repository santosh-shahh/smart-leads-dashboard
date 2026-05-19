import { useLeadStats } from '../../hooks/useLeads';
import { Skeleton } from '../ui/Skeleton';

const STATUS_COLORS: Record<string, { stroke: string; bg: string }> = {
  New: { stroke: '#6366f1', bg: 'bg-indigo-500' },
  Contacted: { stroke: '#f59e0b', bg: 'bg-amber-500' },
  Qualified: { stroke: '#10b981', bg: 'bg-emerald-500' },
  Lost: { stroke: '#ef4444', bg: 'bg-red-500' },
};

export default function LeadsByStatusChart() {
  const { data: stats, isLoading } = useLeadStats();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="flex justify-center"><Skeleton className="w-40 h-40 rounded-full" /></div>
      </div>
    );
  }

  const total = stats?.total || 1;
  const statuses = Object.entries(stats?.byStatus || {});
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Leads by Status</h3>
      <div className="flex flex-col items-center gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle cx="80" cy="80" r={radius} fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-700" strokeWidth="16" />
            {statuses.map(([status, count]) => {
              const pct = (count as number) / total;
              const dash = pct * circumference;
              const currentOffset = offset;
              offset += dash;
              return (
                <circle
                  key={status}
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke={STATUS_COLORS[status]?.stroke || '#9ca3af'}
                  strokeWidth="16"
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-currentOffset}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  className="transition-all duration-700"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.total}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full">
          {statuses.map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[status]?.bg || 'bg-gray-400'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400 flex-1">{status}</span>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{count as number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
