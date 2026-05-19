import { format } from 'date-fns';
import { Edit, Trash2, ChevronLeft, ChevronRight, Search, Inbox } from 'lucide-react';
import Badge, { statusColorMap, sourceColorMap } from '../ui/Badge';
import Button from '../ui/Button';
import { SkeletonRow } from '../ui/Skeleton';
import type { Lead, LeadsPagination } from '../../types';

interface LeadsTableProps {
  leads: Lead[];
  pagination: LeadsPagination;
  page: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  isAdmin: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function LeadsTable({
  leads, pagination, page, onPageChange,
  isLoading, isError, isAdmin, onEdit, onDelete,
}: LeadsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700/50">
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3.5 text-left text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3.5 text-right text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
            ) : isError ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-3">
                      <Search className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Failed to load leads</p>
                    <p className="text-xs text-gray-500 mt-1">Please check your connection and try again.</p>
                  </div>
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center mb-4">
                      <Inbox className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">No leads found</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Try adjusting your search or filters, or add a new lead.</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id} className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{lead.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={statusColorMap[lead.status] || 'gray'}>{lead.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={sourceColorMap[lead.source] || 'gray'}>{lead.source}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(lead._id)} icon={<Edit className="w-4 h-4" />}>
                        Edit
                      </Button>
                      {isAdmin && (
                        <Button variant="ghost" size="sm" onClick={() => onDelete(lead._id)} icon={<Trash2 className="w-4 h-4 text-red-500" />} className="hover:!bg-red-50 dark:hover:!bg-red-500/10 !text-red-500">
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium text-gray-700 dark:text-gray-300">{(page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{Math.min(page * pagination.limit, pagination.total)}</span> of{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">{pagination.total}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Page numbers */}
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-1 text-gray-400">…</span>}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                );
              })}
            <button
              onClick={() => onPageChange(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
