import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  MoreVertical, 
  MessageSquare,
  Clock,
  Ticket as TicketIcon,
  X
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
    e.preventDefault();
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
      toast.success('Ticket created!');
      setShowModal(false);
      setForm({ title: '', description: '', priority: 'medium' });
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setCreating(false);
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await API.delete(`/tickets/${id}`);
      toast.success('Ticket deleted');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to delete ticket');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tickets/${id}`, { status });
      toast.success('Status updated');
      fetchTickets();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getPriorityColor = (p = '') => {
    switch (p.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (s = '') => {
    switch (s.toLowerCase()) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
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
    <div className="p-8 max-w-7xl mx-auto fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and respond to customer inquiries.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus size={18} className="mr-2" />
          New Ticket
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-36">
            <select 
              className="input-field appearance-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="relative w-full md:w-36">
            <select 
              className="input-field appearance-none"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <button onClick={fetchTickets} className="btn-secondary px-3">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <TicketIcon size={48} className="mx-auto mb-4 opacity-10" />
            <p className="text-lg font-medium">No tickets found</p>
            <p className="text-sm">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {tickets.map((ticket) => (
                  <tr key={ticket._id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {ticket.title}
                        </span>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{ticket.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                          {(ticket.userId?.name ?? 'User').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">
                          {ticket.userId?.name ?? ticket.userId?.email ?? 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getPriorityColor(ticket.priority)}`}>
                        {(ticket.priority ?? 'medium').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        {user?.role === 'admin' ? (
                          <select 
                            value={ticket.status} 
                            onChange={(e) => updateStatus(ticket._id, e.target.value)}
                            className="bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none"
                          >
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="closed">Closed</option>
                          </select>
                        ) : (
                          <span className="text-gray-700 dark:text-gray-300 capitalize">{ticket.status ?? 'open'}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(ticket.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => deleteTicket(ticket._id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-md transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Ticket</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={createTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="What can we help you with?"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Describe your issue in detail..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                <select
                  className="input-field"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={creating} className="flex-1 btn-primary">
                  {creating ? 'Creating...' : 'Create Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}