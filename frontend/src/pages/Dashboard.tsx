import { useState } from 'react';
import { useLeads, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/ui/Toast';
import StatsCards from '../components/dashboard/StatsCards';
import LeadsByStatusChart from '../components/dashboard/LeadsByStatusChart';
import LeadsBySourceChart from '../components/dashboard/LeadsBySourceChart';
import FilterBar from '../components/dashboard/FilterBar';
import LeadsTable from '../components/dashboard/LeadsTable';
import LeadModal from '../components/leads/LeadModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Button from '../components/ui/Button';
import api from '../api/client';
import { Plus, Download } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  // Filters & pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sort, setSort] = useState('latest');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading, isError } = useLeads({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
    source: sourceFilter,
    sort,
  });

  const deleteMutation = useDeleteLead();

  const handleExport = async () => {
    try {
      const response = await api.get('/leads/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast('CSV exported successfully', 'success');
    } catch {
      toast('Export failed. Make sure you are an Admin.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast('Lead deleted successfully', 'success');
    } catch {
      toast('Failed to delete lead', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and track your leads pipeline.</p>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button variant="secondary" onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              Export
            </Button>
          )}
          <Button onClick={() => { setEditingLeadId(null); setIsModalOpen(true); }} icon={<Plus className="w-4 h-4" />}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LeadsByStatusChart />
        <LeadsBySourceChart />
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        onSearchChange={handleFilterChange(setSearch)}
        statusFilter={statusFilter}
        onStatusChange={handleFilterChange(setStatusFilter)}
        sourceFilter={sourceFilter}
        onSourceChange={handleFilterChange(setSourceFilter)}
        sort={sort}
        onSortChange={handleFilterChange(setSort)}
      />

      {/* Table */}
      <LeadsTable
        leads={data?.leads || []}
        pagination={data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 }}
        page={page}
        onPageChange={setPage}
        isLoading={isLoading}
        isError={isError}
        isAdmin={isAdmin}
        onEdit={(id) => { setEditingLeadId(id); setIsModalOpen(true); }}
        onDelete={(id) => setDeleteTarget(id)}
      />

      {/* Lead Modal */}
      {isModalOpen && (
        <LeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          leadId={editingLeadId}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message="This will permanently remove this lead and all associated data. This action cannot be undone."
        confirmText="Delete Lead"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
