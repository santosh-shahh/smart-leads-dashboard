import { useLeadStats } from '../../hooks/useLeads';
import { Skeleton } from '../ui/Skeleton';

const SOURCE_COLORS: Record<string, string> = {
  Website: 'from-violet-500 to-indigo-500',
  Instagram: 'from-pink-500 to-rose-500',
  Referral: 'from-emerald-500 to-teal-500',
};

export default function LeadsBySourceChart() {
  const { data: stats, isLoading } = useLeadStats();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}
        </div>
      </div>
    );
  }

  const sources = Object.entries(stats?.bySource || {});
  const max = Math.max(...sources.map(([, v]) => v as number), 1);

  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-6">Leads by Source</h3>
      <div className="space-y-5">
        {sources.map(([source, count]) => {
          const pct = ((count as number) / max) * 100;
          return (
            <div key={source}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">{source}</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{count as number}</span>
              </div>
              <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${SOURCE_COLORS[source] || 'from-gray-400 to-gray-500'} transition-all duration-700 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
