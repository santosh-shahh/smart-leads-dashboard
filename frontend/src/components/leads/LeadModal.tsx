import { useState, useEffect } from 'react';
import { useCreateLead, useUpdateLead, useLead } from '../../hooks/useLeads';
import { X, Loader2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

export default function LeadModal({ isOpen, onClose, leadId }: LeadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('New');
  const [source, setSource] = useState('Website');
  const [error, setError] = useState('');

  const isEditing = !!leadId;

  const { data: leadData, isLoading: isLoadingLead } = useLead(leadId || '');
  const createMutation = useCreateLead();
  const updateMutation = useUpdateLead();

  useEffect(() => {
    if (isEditing && leadData) {
      setName(leadData.name);
      setEmail(leadData.email);
      setStatus(leadData.status);
      setSource(leadData.source);
    } else if (!isEditing) {
      setName('');
      setEmail('');
      setStatus('New');
      setSource('Website');
    }
  }, [isEditing, leadData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: leadId!, name, email, status: status as any, source: source as any });
      } else {
        await createMutation.mutateAsync({ name, email, status: status as any, source: source as any });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100 dark:border-gray-700">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                {isEditing ? 'Edit Lead' : 'Add New Lead'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {isEditing && isLoadingLead ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
                    <select
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                    >
                      <option value="Website">Website</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Referral">Referral</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isMutating}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {isMutating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Lead'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
