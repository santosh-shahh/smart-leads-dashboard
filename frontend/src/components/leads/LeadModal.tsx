import { useState, useEffect } from 'react';
import { useCreateLead, useUpdateLead, useLead } from '../../hooks/useLeads';
import { useToast } from '../ui/Toast';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { Loader2 } from 'lucide-react';

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
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: leadId!, name, email, status: status as any, source: source as any });
        toast('Lead updated successfully', 'success');
      } else {
        await createMutation.mutateAsync({ name, email, status: status as any, source: source as any });
        toast('Lead created successfully', 'success');
      }
      onClose();
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong';
      setError(msg);
      toast(msg, 'error');
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Lead' : 'Add New Lead'}>
      {error && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      {isEditing && isLoadingLead ? (
        <div className="flex justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              required
              className={inputClass}
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
            <input
              type="email"
              required
              className={inputClass}
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
              <select className={`${inputClass} appearance-none cursor-pointer`} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Source</label>
              <select className={`${inputClass} appearance-none cursor-pointer`} value={source} onChange={(e) => setSource(e.target.value)}>
                <option value="Website">Website</option>
                <option value="Instagram">Instagram</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1" disabled={isMutating}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isMutating} className="flex-1">
              {isEditing ? 'Update Lead' : 'Create Lead'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
