import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  MoreVertical, 
  MessageSquare,
  Clock,
  User,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/api/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error(err);
        // Fallback for demo
        setTickets([
          { id: 'T-1001', subject: 'Cannot access my billing panel', customer: 'Sarah Jenkins', status: 'Open', priority: 'High', updated: '10m ago' },
          { id: 'T-1002', subject: 'How to export chat logs?', customer: 'Mike Ross', status: 'Pending', priority: 'Medium', updated: '1h ago' },
          { id: 'T-1003', subject: 'Feature request: Dark mode for widget', customer: 'Harvey Specter', status: 'Closed', priority: 'Low', updated: '2h ago' },
          { id: 'T-1004', subject: 'Slow loading times in dashboard', customer: 'Louis Litt', status: 'Open', priority: 'Medium', updated: '4h ago' },
          { id: 'T-1005', subject: 'API returns 500 error on /users', customer: 'Rachel Zane', status: 'Open', priority: 'Critical', updated: '5h ago' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (p) => {
    switch (p.toLowerCase()) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'low': return 'text-gray-700 bg-gray-100 border-gray-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (s) => {
    switch (s.toLowerCase()) {
      case 'open': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and respond to customer inquiries.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" />
          New Ticket
        </button>
      </div>

      {/* Filters & Search */}
      <div className="card p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search tickets or customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-40">
            <select 
              className="input-field appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option>All</option>
              <option>Open</option>
              <option>Pending</option>
              <option>Closed</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <button className="btn-secondary px-3">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Updated</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">Loading tickets...</td>
                </tr>
              ) : filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">No tickets found.</td>
                </tr>
              ) : filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{ticket.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{ticket.subject}</span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <MessageSquare size={12} />
                        <span>2 messages</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                        {ticket.customer[0]}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{ticket.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                      <span className="text-gray-700 dark:text-gray-300">{ticket.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      {ticket.updated}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-white border border-transparent hover:border-gray-100">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-800/30">
          <p className="text-xs text-gray-500">Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">{filteredTickets.length}</span> of <span className="font-medium text-gray-900 dark:text-white">{filteredTickets.length}</span> results</p>
          <div className="flex items-center gap-2">
            <button className="btn-secondary py-1 px-3 text-xs opacity-50 cursor-not-allowed">Previous</button>
            <button className="btn-secondary py-1 px-3 text-xs">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}