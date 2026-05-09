import { useEffect, useState } from 'react';
import { Plus, TrendingUp, Bot, Smile, Clock, Zap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';

export default function Dashboard({ isDark }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    openTickets: 0,
    totalChats: 0,
    last7Days: []
  });
  const [tickets, setTickets] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ticketsRes] = await Promise.all([
          API.get('/chat/stats'),
          API.get('/tickets/all')
        ]);

        setStats(statsRes.data || {
          openTickets: 0,
          totalChats: 0,
          last7Days: []
        });

        if (Array.isArray(ticketsRes.data)) {
          setTickets(ticketsRes.data.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Use mock data for demo
        setStats({
          openTickets: 12,
          totalChats: 145,
          last7Days: [
            { day: 'Mon', chats: 45 },
            { day: 'Tue', chats: 52 },
            { day: 'Wed', chats: 48 },
            { day: 'Thu', chats: 61 },
            { day: 'Fri', chats: 55 },
            { day: 'Sat', chats: 67 },
            { day: 'Sun', chats: 72 }
          ]
        });
        setTickets([]);
      } finally {
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'in-progress': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      resolved: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      closed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return colors[status] || colors.open;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      low: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      urgent: 'bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-300'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's what's happening across your support today.
          </p>
        </div>
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          New ticket
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Open tickets"
          value={stats.openTickets || 0}
          icon={TrendingUp}
          color="primary"
        />
        <StatCard
          label="AI resolved (30d)"
          value={stats.totalChats || 0}
          icon={Bot}
          color="blue"
        />
        <StatCard
          label="CSAT"
          value="96%"
          icon={Smile}
          color="primary"
        />
        <StatCard
          label="Avg response"
          value="9m"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Charts & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Chat volume — last 7 days
              </h3>
            </div>
            <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 rounded">
              Realtime
            </span>
          </div>

          {stats.last7Days && stats.last7Days.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="day" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: isDark ? '#F3F4F6' : '#111827'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="chats"
                  stroke="#F97316"
                  dot={{ fill: '#F97316', r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-72 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={20} className="text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI insights
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Password-reset queries are up +24%. Consider adding a new FAQ.
              </p>
            </div>
            <div className="flex gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                CSAT for billing queries rose to 97% — great work!
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                12 tickets are nearing escalation. Review soon.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent tickets
          </h3>
        </div>

        {tickets && tickets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket, idx) => (
                  <tr
                    key={ticket._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-gray-900 dark:text-white">
                      T-{String(idx + 1).padStart(3, '0')}
                    </td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white truncate max-w-xs">
                      {ticket.title}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority?.charAt(0).toUpperCase() +
                          ticket.priority?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          ticket.status
                        )}`}
                      >
                        {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {formatDate(ticket.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tickets yet
          </div>
        )}

        {tickets && tickets.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <button
              onClick={() => navigate('/tickets')}
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              View all
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}