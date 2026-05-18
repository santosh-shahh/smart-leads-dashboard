import { useState } from 'react';
import { useLeads, useDeleteLead } from '../hooks/useLeads';
import { useDebounce } from '../hooks/useDebounce';
import { useAuthStore } from '../store/useAuthStore';
import LeadModal from '../components/leads/LeadModal';
import api from '../api/client';
import { Search, Plus, Download, Trash2, Edit, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [sort, setSort] = useState('latest');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useLeads({
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
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. Make sure you are an Admin.');
    }
  };

  const openEditModal = (id: string) => {
    setEditingLeadId(id);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingLeadId(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Qualified': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Dashboard</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage and track your leads efficiently.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {user?.role === 'Admin' && (
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          )}
          <button
            onClick={openCreateModal}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        
        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
          value={sourceFilter}
          onChange={(e) => { setSourceFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
        >
          <option value="latest">Sort: Latest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                    <p className="mt-2 text-sm text-gray-500">Loading leads...</p>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-red-500">
                    Error loading leads. Please try again.
                  </td>
                </tr>
              ) : data?.leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium">No leads found</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                data?.leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-bold">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openEditModal(lead._id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors" title="Edit">
                        <Edit className="w-5 h-5 inline" />
                      </button>
                      {user?.role === 'Admin' && (
                        <button onClick={() => handleDelete(lead._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5 inline" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(page - 1) * 10 + 1}</span> to <span className="font-medium">{Math.min(page * 10, data.pagination.total)}</span> of <span className="font-medium">{data.pagination.total}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Page {page} of {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <LeadModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          leadId={editingLeadId} 
        />
      )}
    </div>
  );
}
