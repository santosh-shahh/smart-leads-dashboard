interface BadgeProps {
  children: React.ReactNode;
  color?: 'blue' | 'yellow' | 'green' | 'red' | 'purple' | 'gray';
  className?: string;
}

const colorClasses: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-500/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-500/10 dark:text-purple-400 dark:ring-purple-500/20',
  gray: 'bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-500/20',
};

export const statusColorMap: Record<string, 'blue' | 'yellow' | 'green' | 'red'> = {
  New: 'blue',
  Contacted: 'yellow',
  Qualified: 'green',
  Lost: 'red',
};

export const sourceColorMap: Record<string, 'purple' | 'red' | 'green'> = {
  Website: 'purple',
  Instagram: 'red',
  Referral: 'green',
};

export default function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${colorClasses[color]} ${className}`}>
      {children}
    </span>
  );
}
