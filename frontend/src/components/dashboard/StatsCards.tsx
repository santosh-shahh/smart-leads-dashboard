import { useLeadStats } from '../../hooks/useLeads';
import { SkeletonCard } from '../ui/Skeleton';
import { Users, UserPlus, Trophy, TrendingUp } from 'lucide-react';

const cards = [
  { key: 'total', label: 'Total Leads', icon: Users, gradient: 'from-violet-500 to-indigo-500', bgLight: 'bg-violet-50 dark:bg-violet-500/10' },
  { key: 'new', label: 'New Leads', icon: UserPlus, gradient: 'from-blue-500 to-cyan-500', bgLight: 'bg-blue-50 dark:bg-blue-500/10' },
  { key: 'qualified', label: 'Qualified', icon: Trophy, gradient: 'from-emerald-500 to-teal-500', bgLight: 'bg-emerald-50 dark:bg-emerald-500/10' },
  { key: 'conversion', label: 'Conversion Rate', icon: TrendingUp, gradient: 'from-amber-500 to-orange-500', bgLight: 'bg-amber-50 dark:bg-amber-500/10' },
];

export default function StatsCards() {
  const { data: stats, isLoading } = useLeadStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const values: Record<string, string | number> = {
    total: stats?.total ?? 0,
    new: stats?.byStatus?.New ?? 0,
    qualified: stats?.byStatus?.Qualified ?? 0,
    conversion: `${stats?.conversionRate ?? 0}%`,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="group bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.label}</span>
              <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                <Icon className={`w-5 h-5 bg-gradient-to-r ${card.gradient} bg-clip-text`} style={{ color: `var(--tw-gradient-from)` }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {values[card.key]}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {card.key === 'conversion' ? 'Of total leads' : 'All time'}
            </p>
          </div>
        );
      })}
    </div>
  );
}
