import { useState, useEffect, useMemo } from 'react';
import API from '../utils/axios';
import {
  Search, Plus, ChevronDown, Ticket as TicketIcon, X, Clock,
  Filter, MoreHorizontal, ArrowUpDown, RefreshCcw, User as UserIcon,
  AlertCircle, CheckCircle2, Timer
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const PRIORITY_CONFIG = {
  critical: { class: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30', label: 'Critical' },
  high: { class: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30', label: 'High' },
  medium: { class: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30', label: 'Medium' },
  low: { class: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/50', label: 'Low' },
};

const STATUS_CONFIG = {
  open: { 
    icon: CheckCircle2, 
    class: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
    dot: 'bg-emerald-500'
  },
  pending: { 
    icon: Timer, 
    class: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    dot: 'bg-amber-500'
  },
  closed: { 
    icon: AlertCircle, 
    class: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/50',
    dot: 'bg-gray-400'
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

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
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [user?.role, statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => { if (e) e.preventDefault(); fetchTickets(); };

  const createTicket = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Please fill in all fields'); return; }
    try {
      setCreating(true);
      await API.post('/tickets', form);
      toast.success('Ticket created successfully');
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
      toast.success(`Ticket marked as ${status}`);
      fetchTickets();
    } catch { toast.error('Failed to update status'); }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="section-spacing pb-20 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TicketIcon size={20} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">X1 Support</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium ml-13">
            {user?.role === 'admin' ? 'Manage global support requests' : 'Track and manage your requests'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => fetchTickets()}
            className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-primary transition-all active:scale-95"
            title="Refresh"
          >
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-primary px-6 py-3.5 flex items-center gap-2 group whitespace-nowrap"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            New Request
          </button>
        </motion.div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center">
        <div className="flex-1">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              className="w-full px-11 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Search by ID, subject, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => { setSearchTerm(''); setTimeout(fetchTickets, 0); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </form>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100/50 dark:bg-gray-800/40 rounded-2xl border border-gray-200/50 dark:border-gray-700/30">
            <Filter size={14} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Filters:</span>
            
            <div className="flex items-center gap-2 py-1">
              {['Status', 'Priority'].map((type) => {
                const value = type === 'Status' ? statusFilter : priorityFilter;
                const setter = type === 'Status' ? setStatusFilter : setPriorityFilter;
                const options = type === 'Status' 
                  ? ['All', 'Open', 'Pending', 'Closed'] 
                  : ['All', 'Low', 'Medium', 'High', 'Critical'];
                
                return (
                  <div key={type} className="relative">
                    <select
                      className="appearance-none bg-white dark:bg-gray-900 px-4 py-1.5 pr-8 rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                    >
                      {options.map(o => <option key={o}>{o === 'All' ? type : o}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card p-32 flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <TicketIcon size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-50" />
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Syncing requests...</p>
            </motion.div>
          ) : tickets.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card py-32 flex flex-col items-center justify-center text-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-6 relative group">
                <TicketIcon size={32} className="text-gray-300 dark:text-gray-600 transition-transform group-hover:rotate-12" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary font-black text-[10px]">?</div>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">No matches found</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                We couldn't find any tickets matching your current search criteria. Try clearing filters or create a new support request.
              </p>
              <button 
                onClick={() => { setSearchTerm(''); setStatusFilter('All'); setPriorityFilter('All'); setTimeout(fetchTickets, 0); }}
                className="mt-8 text-xs font-black text-primary uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Desktop Table View */}
              <div className="hidden lg:block card overflow-visible">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ticket Details</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status & Priority</th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {tickets.map((ticket) => (
                      <motion.tr 
                        key={ticket?._id} 
                        variants={itemVariants}
                        className="group hover:bg-gray-50/50 dark:hover:bg-primary/5 transition-all duration-300"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-start gap-4">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${STATUS_CONFIG[ticket?.status]?.dot}`} />
                            <div>
                              <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{ticket?.title}</p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">#{ticket?._id?.slice(-8)}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-gray-800" />
                                <span className="text-[10px] font-bold text-gray-400">Support Request</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden shadow-sm">
                              {getInitials(ticket?.userId?.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{ticket?.userId?.name ?? 'Unknown'}</p>
                              <p className="text-[11px] font-medium text-gray-400 truncate">{ticket?.userId?.email ?? ''}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            {user?.role === 'admin' ? (
                              <div className="relative group/select">
                                <select
                                  value={ticket?.status}
                                  onChange={(e) => updateStatus(ticket?._id, e.target.value)}
                                  className={`appearance-none px-4 py-1.5 pr-9 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 ${STATUS_CONFIG[ticket?.status]?.class}`}
                                >
                                  <option value="open">Open</option>
                                  <option value="pending">Pending</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-60 pointer-events-none" size={12} />
                              </div>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[ticket?.status]?.class}`}>
                                {ticket?.status}
                              </span>
                            )}
                            <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${PRIORITY_CONFIG[ticket?.priority]?.class}`}>
                              {ticket?.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 text-gray-400">
                              <Clock size={12} />
                              <span className="text-xs font-bold text-gray-900 dark:text-gray-300">
                                {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {tickets.map((ticket) => (
                  <motion.div
                    key={ticket?._id}
                    variants={itemVariants}
                    className="card p-6 space-y-5 active:scale-[0.98] transition-transform"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[ticket?.status]?.dot}`} />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">#{ticket?._id?.slice(-8)}</span>
                        </div>
                        <h4 className="text-base font-bold text-gray-900 dark:text-white leading-snug">{ticket?.title}</h4>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${PRIORITY_CONFIG[ticket?.priority]?.class}`}>
                          {ticket?.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
                      <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-xs font-black text-gray-400 shadow-sm">
                        {getInitials(ticket?.userId?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{ticket?.userId?.name}</p>
                        <p className="text-[10px] font-medium text-gray-500 truncate">{ticket?.userId?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                        <Clock size={12} />
                        {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                      
                      {user?.role === 'admin' ? (
                        <select
                          value={ticket?.status}
                          onChange={(e) => updateStatus(ticket?._id, e.target.value)}
                          className={`appearance-none px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[ticket?.status]?.class}`}
                        >
                          <option value="open">Open</option>
                          <option value="pending">Pending</option>
                          <option value="closed">Closed</option>
                        </select>
                      ) : (
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[ticket?.status]?.class}`}>
                          {ticket?.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal-bg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0D0D10] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Create Request</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Submit a new support ticket</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={createTicket} className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Issue Subject</label>
                  <div className="relative group">
                    <TicketIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text" required className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. Account access issues..."
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea
                    required rows={4} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Please provide as much detail as possible..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 text-center block">Select Priority Level</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['low', 'medium', 'high', 'critical'].map((p) => (
                      <button
                        key={p} type="button"
                        onClick={() => setForm({ ...form, priority: p })}
                        className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                          form.priority === p
                            ? PRIORITY_CONFIG[p].class + ' ring-2 ring-primary/20 shadow-lg'
                            : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit" 
                    disabled={creating} 
                    className="flex-[2] py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
                  >
                    {creating ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}