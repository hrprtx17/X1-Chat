import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import TicketCard from '../components/TicketCard';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTickets = useCallback(async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get('/tickets', { params });
      setTickets(data);
    } catch (err) { console.log(err); }
  }, [search, statusFilter]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchTickets(); }, [fetchTickets]);

  const createTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/tickets', form);
      toast.success('Ticket created!');
      setForm({ title: '', description: '', priority: 'medium' });
      setShowForm(false);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    }
    setLoading(false);
  };

  return (
    <div className="app-shell min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#131a2f', color: '#fff', border: '1px solid rgba(134,171,255,0.3)' } }} />
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-white tracking-tight">Support Tickets</h1>
            <p className="text-slate-400 text-sm mt-1">{tickets.length} total tickets in workspace</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
          >
            <Plus size={16} />
            New Ticket
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold">Create New Ticket</h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={createTicket} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ticket title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="input-premium px-4 py-3 placeholder-slate-500 text-sm"
                    required
                  />
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="textarea-premium px-4 py-3 placeholder-slate-500 text-sm resize-none"
                    required
                  />
                  <div className="flex gap-3">
                    <select
                      value={form.priority}
                      onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="select-premium px-4 py-3 text-sm bg-transparent"
                    >
                      <option value="low" className="bg-slate-900">Low Priority</option>
                      <option value="medium" className="bg-slate-900">Medium Priority</option>
                      <option value="high" className="bg-slate-900">High Priority</option>
                    </select>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-sm disabled:opacity-50">
                      {loading ? 'Creating...' : 'Create Ticket'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-premium pl-9 pr-4 py-2.5 placeholder-slate-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="select-premium px-4 py-2.5 text-sm bg-transparent"
          >
            <option value="" className="bg-slate-900">All Status</option>
            <option value="open" className="bg-slate-900">Open</option>
            <option value="in-progress" className="bg-slate-900">In Progress</option>
            <option value="resolved" className="bg-slate-900">Resolved</option>
            <option value="closed" className="bg-slate-900">Closed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tickets.length === 0 ? (
            <div className="col-span-2 xl:col-span-3 text-center py-16 text-slate-500 glass-card">
              <Filter size={40} className="mx-auto mb-3 opacity-30" />
              <p>No tickets found. Create your first ticket!</p>
            </div>
          ) : (
            tickets.map((ticket, i) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}