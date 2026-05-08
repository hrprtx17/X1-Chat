import { useState, useEffect } from 'react';
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

  useEffect(() => { fetchTickets(); }, [search, statusFilter]);

  const fetchTickets = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await API.get('/tickets', { params });
      setTickets(data);
    } catch (err) { console.log(err); }
  };

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
    <div className="min-h-screen bg-dark">
      <Toaster position="top-center" toastOptions={{ style: { background: '#0D0D14', color: '#fff', border: '1px solid rgba(0,217,126,0.2)' } }} />
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
            <p className="text-gray-500 text-sm mt-1">{tickets.length} tickets total</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
          >
            <Plus size={16} />
            New Ticket
          </button>
        </div>

        {/* Create Form */}
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
                  <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white transition">
                    <X size={18} />
                  </button>
                </div>
                <form onSubmit={createTicket} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ticket title"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/40"
                    required
                  />
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full glass rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/40 resize-none"
                    required
                  />
                  <div className="flex gap-3">
                    <select
                      value={form.priority}
                      onChange={e => setForm({ ...form, priority: e.target.value })}
                      className="glass rounded-xl px-4 py-3 text-white text-sm focus:outline-none bg-transparent"
                    >
                      <option value="low" className="bg-dark-card">Low Priority</option>
                      <option value="medium" className="bg-dark-card">Medium Priority</option>
                      <option value="high" className="bg-dark-card">High Priority</option>
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

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="glass rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none bg-transparent"
          >
            <option value="" className="bg-dark-card">All Status</option>
            <option value="open" className="bg-dark-card">Open</option>
            <option value="in-progress" className="bg-dark-card">In Progress</option>
            <option value="resolved" className="bg-dark-card">Resolved</option>
            <option value="closed" className="bg-dark-card">Closed</option>
          </select>
        </div>

        {/* Tickets List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.length === 0 ? (
            <div className="col-span-2 text-center py-16 text-gray-600">
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