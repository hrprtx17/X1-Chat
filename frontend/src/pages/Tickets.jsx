import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  Ticket as TicketIcon,
  X,
  Clock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const endpoint = user?.role === 'admin' ? '/tickets/all' : '/tickets';
      const { data } = await API.get(endpoint, {
        params: {
          search: searchTerm || undefined,
          status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
          priority: priorityFilter === 'All' ? undefined : priorityFilter.toLowerCase(),
        }
      });
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [user?.role, statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    fetchTickets();
  };

  const createTicket = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Please fill in all fields');
      return;
    }
    
    try {
      setCreating(true);
      await API.post('/tickets', form);
      toast.success('Ticket created successfully!');
      setShowModal(false);
      setForm({ title: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    if (!id) return;
    try {
      await API.put(`/tickets/${id}`, { status });
      toast.success(`Status updated to ${status}`);
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n?.[0] ?? '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPriorityBadge = (p = '') => {
    switch (p.toLowerCase()) {
      case 'critical': return 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30';
      case 'high': return 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/10 dark:text-orange-400 dark:border-orange-900/30';
      case 'medium': return 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/30';
      default: return 'bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/10 dark:text-gray-400 dark:border-gray-900/30';
    }
  };

  return (
    <div className="section-spacing fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Support Tickets</h1>
          <p className="text-gray-500 mt-1 font-medium">Track and manage your support requests.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary w-full sm:w-auto">
          <Plus size={18} className="mr-2" />
          Create Ticket
        </button>
      </div>

      {/* Filters Area */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="input-field pl-11 py-3"
            placeholder="Search tickets by subject or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="md:col-span-6 flex gap-3">
          <div className="relative flex-1">
            <select 
              className="input-field appearance-none py-3 font-semibold"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative flex-1">
            <select 
              className="input-field appearance-none py-3 font-semibold"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All Priority</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card">
        {loading ? (
          <div className="py-32 flex justify-center">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <TicketIcon size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">No tickets found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto font-medium">We couldn't find any tickets matching your current filters. Try adjusting them or create a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-5">Ticket Info</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Priority</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {tickets.map((ticket) => (
                  <tr key={ticket?._id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-all cursor-pointer">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{ticket?.title}</span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase">ID: {ticket?._id?.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold border border-gray-200 dark:border-gray-700">
                          {getInitials(ticket?.userId?.name)}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-bold text-gray-900 dark:text-white">{ticket?.userId?.name ?? 'Unknown'}</span>
                           <span className="text-[11px] text-gray-500 font-medium">{ticket?.userId?.email ?? ''}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`badge border ${getPriorityBadge(ticket?.priority)}`}>
                        {ticket?.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {user?.role === 'admin' ? (
                        <div className="relative inline-block group/select">
                          <select 
                            value={ticket?.status} 
                            onChange={(e) => updateStatus(ticket?._id, e.target.value)}
                            className={`appearance-none bg-transparent pr-8 py-1 pl-3 rounded-lg text-xs font-bold uppercase tracking-wide border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all focus:outline-none cursor-pointer ${
                               ticket?.status === 'open' ? 'text-green-600' : ticket?.status === 'pending' ? 'text-yellow-600' : 'text-gray-400'
                            }`}
                          >
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                          </select>
                          <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${ticket?.status === 'open' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : ticket?.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                           <span className="text-xs font-bold uppercase text-gray-600 dark:text-gray-400">{ticket?.status}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">Created</span>
                          <span className="text-[11px] font-medium text-gray-400">{new Date(ticket?.createdAt).toLocaleDateString()}</span>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Create Ticket</h2>
                <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-widest">New support request</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={createTicket} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Summarize your issue..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Provide more context..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                   {['low', 'medium', 'high', 'critical'].map(p => (
                     <button
                       key={p}
                       type="button"
                       onClick={() => setForm({...form, priority: p})}
                       className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                         form.priority === p 
                          ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                       }`}
                     >
                       {p}
                     </button>
                   ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary py-3">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 btn-primary py-3">
                  {creating ? 'Saving...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}