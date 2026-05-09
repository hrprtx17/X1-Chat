import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Users, 
  MessageSquare, 
  Ticket, 
  TrendingUp,
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
        setStats(statsRes?.data || null);

        // Fetch recent tickets
        const ticketsRes = await API.get('/tickets/all');
        setRecentTickets((ticketsRes?.data ?? []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = (stats?.last7Days ?? []).map(d => ({ 
    name: d?._id ?? 'Unknown', 
    chats: d?.count ?? 0 
  }));

  const intentData = (stats?.intentStats ?? []).map(i => ({ 
    name: i?._id ?? 'Unknown', 
    count: i?.count ?? 0 
  }));

  const StatCard = ({ title, value, icon: Icon, color, loading }) => (
    <div className="card p-6 flex flex-col gap-1 transition-all hover:shadow-md border-gray-100 dark:border-gray-800">
      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-20 bg-gray-50 dark:bg-gray-900 rounded"></div>
          <div className="h-8 w-16 bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      ) : (
        <>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
            <Icon size={20} />
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{value}</p>
        </>
      )}
    </div>
  );

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

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Monitoring your customer support performance.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Open Tickets" value={stats?.openTickets ?? 0} icon={Ticket} color="orange" loading={loading} />
        <StatCard title="Total AI Chats" value={stats?.totalChats ?? 0} icon={TrendingUp} color="green" loading={loading} />
        <StatCard title="Escalated" value={stats?.escalatedChats ?? 0} icon={MessageSquare} color="blue" loading={loading} />
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={Users} color="purple" loading={loading} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6 lg:col-span-2 flex flex-col gap-6">
          <h3 className="text-lg font-bold">Chat Volume — Last 7 Days</h3>
          <div className="h-[320px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 500 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="chats" stroke="#F97316" strokeWidth={3} fillOpacity={1} fill="url(#colorChats)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                No chat data available for the last 7 days.
              </div>
            )}
          </div>
        </div>

        <div className="card p-6 flex flex-col gap-6">
          <h3 className="text-lg font-bold">Intent Distribution</h3>
          <div className="h-[220px] w-full">
            {intentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={intentData} layout="vertical" margin={{ left: -20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280', fontWeight: 600 }} width={100} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="count" fill="#F97316" radius={[0, 6, 6, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 font-medium italic bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                No intent data available.
              </div>
            )}
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-100 dark:border-orange-900/30">
            <h4 className="text-sm font-bold text-orange-900 dark:text-orange-200 mb-1">AI Performance</h4>
            <p className="text-xs text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
              {(stats?.escalatedChats ?? 0) > 0 ? (
                `Attention: ${stats.escalatedChats} chats required human intervention. Review escalations to improve AI training.`
              ) : (
                "AI is handling all queries successfully. No escalations required in the current period."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold">Recent Support Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/30 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4">Ticket</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center text-gray-400 italic">
                    <TicketIcon size={32} className="mx-auto mb-3 opacity-20" />
                    No recent tickets.
                  </td>
                </tr>
              ) : (
                recentTickets.map((ticket) => (
                  <tr key={ticket?._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{ticket?.title}</span>
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter mt-0.5">#{ticket?._id?.slice(-8)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold border border-gray-200 dark:border-gray-700">
                          {getInitials(ticket?.userId?.name)}
                        </div>
                        <span className="text-sm font-semibold">{ticket?.userId?.name ?? 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        ticket?.status === 'open' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 
                        ticket?.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : 
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                      }`}>
                        {ticket?.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                      {ticket?.priority}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-400">
                      {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
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