import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, ToggleRight, HelpCircle, Search } from 'lucide-react';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function FAQ() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', isActive: true });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const isAdmin = user?.role === 'admin';

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/faqs', {
        params: {
          search: searchTerm || undefined,
          category: categoryFilter === 'All' ? undefined : categoryFilter.toLowerCase(),
        }
      });
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, [categoryFilter]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchFAQs();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form?.question?.trim() || !form?.answer?.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await API.put(`/faqs/${editingId}`, form);
        toast.success('FAQ updated!');
      } else {
        await API.post('/faqs', form);
        toast.success('FAQ created!');
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ question: '', answer: '', category: 'general', isActive: true });
      fetchFAQs();
    } catch (error) {
      console.error('Save FAQ error:', error);
      toast.error(error.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq) => {
    if (!faq) return;
    setForm({
      question: faq?.question ?? '',
      answer: faq?.answer ?? '',
      category: faq?.category ?? 'general',
      isActive: faq?.isActive !== false
    });
    setEditingId(faq?._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm('Delete this FAQ?')) return;

    try {
      await API.delete(`/faqs/${id}`);
      toast.success('FAQ deleted!');
      fetchFAQs();
    } catch (error) {
      console.error('Delete FAQ error:', error);
      toast.error('Failed to delete FAQ');
    }
  };

  const handleToggleActive = async (faq) => {
    if (!faq?._id) return;
    try {
      await API.put(`/faqs/${faq._id}`, { isActive: !faq?.isActive });
      toast.success(`FAQ ${!faq?.isActive ? 'activated' : 'deactivated'}`);
      fetchFAQs();
    } catch (error) {
      console.error('Toggle FAQ error:', error);
      toast.error('Failed to update FAQ status');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ question: '', answer: '', category: 'general', isActive: true });
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-64">
      <div className="flex gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} 
            className="w-2 h-2 bg-primary rounded-full animate-bounce" 
            style={{ animationDelay: `${i * 150}ms` }} 
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Manage frequently asked questions and automated responses.</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus size={18} className="mr-2" />
            Add FAQ
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select 
            className="input-field w-full md:w-40"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All</option>
            <option value="general">General</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
          </select>
        </div>
      </div>

      {/* FAQs List */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (faqs ?? []).length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <HelpCircle size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium">No FAQs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Question & Answer</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  {isAdmin && <th className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-gray-300">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {(faqs ?? []).map((faq) => (
                  <tr key={faq?._id ?? Math.random()} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 dark:text-white mb-1">{faq?.question ?? 'No Question'}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2">{faq?.answer ?? ''}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                        {faq?.category ?? 'general'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => isAdmin && handleToggleActive(faq)}
                        disabled={!isAdmin}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          faq?.isActive !== false
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } ${!isAdmin && 'cursor-default'}`}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full ${faq?.isActive !== false ? 'bg-green-600' : 'bg-gray-500'}`} />
                        {faq?.isActive !== false ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(faq)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(faq?._id)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="What is the common question?"
                  value={form?.question ?? ''}
                  onChange={e => setForm({ ...form, question: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Answer</label>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Provide a clear, helpful answer..."
                  value={form?.answer ?? ''}
                  onChange={e => setForm({ ...form, answer: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select
                    className="input-field"
                    value={form?.category ?? 'general'}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="general">General</option>
                    <option value="billing">Billing</option>
                    <option value="technical">Technical</option>
                    <option value="account">Account</option>
                  </select>
                </div>
                <div className="flex items-end pb-2">
                   <button 
                    type="button"
                    onClick={() => setForm({...form, isActive: !form?.isActive})}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                      form?.isActive ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                   >
                     <ToggleRight size={20} className={form?.isActive ? 'text-green-600' : 'text-gray-400'} />
                     <span className="text-xs font-bold uppercase">{form?.isActive ? 'Active' : 'Draft'}</span>
                   </button>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
