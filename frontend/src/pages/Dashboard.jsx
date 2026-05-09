import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Users, 
  MessageSquare, 
  Ticket, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Plus,
  Ticket as TicketIcon
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch stats
        const statsRes = await API.get('/chat/stats');
        setStats(statsRes.data);

        // Fetch recent tickets (admin only or user's own)
        const ticketsRes = await API.get(user?.role === 'admin' ? '/tickets/all' : '/tickets');
        setRecentTickets((ticketsRes.data ?? []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user?.role]);

  const chartData = stats?.last7Days?.map(d => ({ 
    name: d._id, 
    chats: d.count 
  })) ?? [];

  const intentData = stats?.intentStats?.map(i => ({ 
    name: i._id, 
    count: i.count 
  })) ?? [];

  const StatCard = ({ title, value, icon: Icon, color, loading }) => (
    <div className="card p-6">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-20 bg-gray-100 dark:bg-gray-900 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
              <Icon size={20} />
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </>
      )}
    </div>
  );

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

  if (loading && !stats) return <LoadingSpinner />;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name?.split(' ')?.filter(Boolean)?.[0] ?? 'User'} 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your support channels today.</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} className="mr-2" />
          New Ticket
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Open Tickets" 
          value={stats?.openTickets ?? 0} 
          icon={Ticket} 
          color="orange" 
          loading={loading}
        />
        <StatCard 
          title="Total AI Chats" 
          value={stats?.totalChats ?? 0} 
          icon={TrendingUp} 
          color="green" 
          loading={loading}
        />
        <StatCard 
          title="Escalated" 
          value={stats?.escalatedChats ?? 0} 
          icon={MessageSquare} 
          color="blue" 
          loading={loading}
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers ?? 0} 
          icon={Users} 
          color="purple" 
          loading={loading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-8">Chat Volume — Last 7 Days</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="chats" 
                    stroke="#F97316" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorChats)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No chat data available for the last 7 days.
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Intent Distribution</h3>
          <div className="h-[200px] w-full mb-6">
            {intentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                    width={80}
                  />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No intent data available.
              </div>
            )}
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">AI Support Insights</h4>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
              <p className="text-xs text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
                {stats?.escalatedChats > 0 ? (
                  `⚠️ ${stats.escalatedChats} chats were escalated. Consider reviewing the most frequent issues.`
                ) : stats?.openTickets > 0 ? (
                  `🎫 ${stats.openTickets} tickets are currently open and awaiting response.`
                ) : stats?.totalChats === 0 ? (
                  "💬 No chats yet. Integrate the widget to start assisting customers."
                ) : (
                  "✅ Everything looks good! AI is successfully handling customer queries."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tickets</h3>
          <button className="text-primary text-sm font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <TicketIcon size={40} />
                      <p className="text-sm">No recent tickets found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                recentTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.title ?? 'No Subject'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                          {(ticket.userId?.name ?? 'User').split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ticket.userId?.name ?? 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        ticket.status === 'open' ? 'bg-green-100 text-green-700' : 
                        ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.status ?? 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium ${
                        ticket.priority === 'high' || ticket.priority === 'critical' ? 'text-red-600' : 
                        ticket.priority === 'medium' ? 'text-orange-600' : 
                        'text-gray-500'
                      }`}>
                        {ticket.priority ?? 'low'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}