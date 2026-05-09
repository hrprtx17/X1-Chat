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
  Plus
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartData = [
    { name: 'Mon', volume: 40, resolved: 24 },
    { name: 'Tue', volume: 55, resolved: 38 },
    { name: 'Wed', volume: 48, resolved: 42 },
    { name: 'Thu', volume: 70, resolved: 55 },
    { name: 'Fri', volume: 62, resolved: 48 },
    { name: 'Sat', volume: 35, resolved: 30 },
    { name: 'Sun', volume: 45, resolved: 38 },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/chat/stats');
        setStats(res.data);
      } catch (err) {
        // Fallback or error
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="card p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600 dark:bg-${color}-900/20 dark:text-${color}-400`}>
          <Icon size={20} />
        </div>
        <div className={`flex items-center text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
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
          value={stats?.openTickets || '24'} 
          change={12} 
          icon={Ticket} 
          color="orange" 
        />
        <StatCard 
          title="AI Resolved" 
          value={stats?.aiResolved || '142'} 
          change={28} 
          icon={TrendingUp} 
          color="green" 
        />
        <StatCard 
          title="Avg. Response" 
          value="1.2m" 
          change={-5} 
          icon={MessageSquare} 
          color="blue" 
        />
        <StatCard 
          title="Total Users" 
          value={stats?.totalUsers || '1,284'} 
          change={8} 
          icon={Users} 
          color="purple" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Chat Volume — Last 7 Days</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
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
                  dataKey="volume" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorVolume)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">AI Insights</h3>
          <div className="space-y-6">
            {[
              { label: 'Most Common Issue', value: 'Password reset', icon: '🔑', percentage: 24 },
              { label: 'Resolution Rate', value: '82%', icon: '📈', percentage: 82 },
              { label: 'CSAT Score', value: '4.8/5', icon: '⭐', percentage: 96 },
              { label: 'Active Bots', value: '12', icon: '🤖', percentage: 100 }
            ].map((insight, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>{insight.icon}</span>
                    <span>{insight.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{insight.value}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${insight.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
            <p className="text-xs text-orange-800 dark:text-orange-300 font-medium leading-relaxed">
              💡 Pro Tip: Customers are asking about the new billing feature. Consider updating your FAQ.
            </p>
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
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { name: 'Alex Rivera', email: 'alex@example.com', sub: 'Login issues with OAuth', status: 'Open', priority: 'High', time: '2m ago' },
                { name: 'Sarah Chen', email: 'sarah@example.com', sub: 'Billing discrepancy', status: 'Pending', priority: 'Medium', time: '15m ago' },
                { name: 'Marcus Bell', email: 'marcus@example.com', sub: 'API Documentation link broken', status: 'Closed', priority: 'Low', time: '1h ago' }
              ].map((ticket, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {ticket.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{ticket.name}</p>
                        <p className="text-xs text-gray-500">{ticket.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{ticket.sub}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 
                      ticket.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium ${
                      ticket.priority === 'High' ? 'text-red-600' : 
                      ticket.priority === 'Medium' ? 'text-orange-600' : 
                      'text-gray-500'
                    }`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">{ticket.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}