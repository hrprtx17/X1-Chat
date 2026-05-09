import { useState, useEffect, useMemo } from 'react';
import API from '../utils/axios';
import { 
  Users, MessageSquare, Ticket, TrendingUp, Ticket as TicketIcon, 
  ArrowUpRight, Activity, Calendar, Zap, Sparkles, Clock, ChevronRight,
  BarChart3, PieChart, LineChart, Globe, RefreshCcw
} from 'lucide-react';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const STATUS_CONFIG = {
  open: { 
    class: 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
    dot: 'bg-emerald-500'
  },
  pending: { 
    class: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    dot: 'bg-amber-500'
  },
  closed: { 
    class: 'bg-gray-50 text-gray-600 border-gray-100 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700/50',
    dot: 'bg-gray-400'
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-3 rounded-xl shadow-2xl">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-primary flex items-center gap-2">
          <Zap size={12} fill="currentColor" /> {payload[0].value} X1 Chats
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const statsRes = await API.get('/chat/stats');
        setStats(statsRes?.data || null);
        const ticketsRes = await API.get('/tickets/all');
        setRecentTickets((ticketsRes?.data ?? []).slice(0, 5));
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = useMemo(() => (stats?.last7Days ?? []).map((d) => ({ 
    name: d?._id ? new Date(d._id).toLocaleDateString(undefined, { weekday: 'short' }) : '', 
    chats: d?.count ?? 0 
  })), [stats]);

  const intentData = useMemo(() => (stats?.intentStats ?? []).map((i) => ({ 
    name: i?._id ?? '', 
    count: i?.count ?? 0 
  })), [stats]);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').filter(Boolean).map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);
  };

  const statCards = useMemo(() => [
    { title: 'Open Tickets', value: stats?.openTickets ?? 0, icon: Ticket, bg: 'bg-orange-500/10', text: 'text-orange-600', trend: '+12.5%', isUp: true, desc: 'Requires attention' },
    { title: 'Total X1 Chats', value: stats?.totalChats ?? 0, icon: Sparkles, bg: 'bg-blue-500/10', text: 'text-blue-600', trend: '+8.2%', isUp: true, desc: 'Self-resolved queries' },
    { title: 'Escalations', value: stats?.escalatedChats ?? 0, icon: MessageSquare, bg: 'bg-emerald-500/10', text: 'text-emerald-600', trend: '-2.4%', isUp: false, desc: 'Human interventions' },
    { title: 'New Users', value: stats?.totalUsers ?? 0, icon: Users, bg: 'bg-purple-500/10', text: 'text-purple-600', trend: '+5.1%', isUp: true, desc: 'Platform growth' },
  ], [stats]);

  if (loading && !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Activity size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary opacity-50" />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse">Initializing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="section-spacing pb-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BarChart3 size={20} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">X1 Intelligence Overview</h1>
          </div>
          <div className="flex items-center gap-4 ml-13">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Welcome back, <span className="text-primary font-bold">{user?.name?.split(' ')[0]}</span>.
            </p>
            <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-1.5 text-gray-400 text-xs font-bold">
              <Calendar size={12} />
              {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Live Operations</span>
          </div>
          <button className="p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-400 hover:text-primary transition-all active:scale-95">
            <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
          </button>
        </motion.div>
      </div>

      {/* Stat Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((s, i) => (
          <motion.div key={s.title} variants={fadeUp(i * 0.05)} className="card-hover p-6 flex flex-col justify-between group relative overflow-hidden">
             {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} opacity-20 blur-[40px] -mr-8 -mt-8 rounded-full group-hover:scale-150 transition-transform duration-700`} />
            
            <div className="flex items-start justify-between mb-8">
              <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                <s.icon size={22} className={s.text} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black ${s.isUp ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                {s.isUp ? <TrendingUp size={10} /> : <TrendingUp size={10} className="rotate-180" />}
                {s.trend}
              </div>
            </div>

            <div className="space-y-1 relative">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.title}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{s.value}</h3>
              </div>
              <p className="text-[10px] font-bold text-gray-400/60 mt-2">{s.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div {...fadeUp(0.3)} className="card xl:col-span-2 p-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div className="space-y-1">
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Inquiry Volume</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Chat interactions over the last 7 days</p>
            </div>
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              {['Area', 'Bar'].map((t) => (
                <button key={t} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Area' ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-[320px] w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.04} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 700 }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#F97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area 
                  type="monotone" 
                  dataKey="chats" 
                  stroke="#F97316" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorChats)" 
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Insight Panel */}
        <motion.div {...fadeUp(0.4)} className="space-y-6">
          <div className="card p-8 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Intent Analysis</h3>
                <PieChart size={18} className="text-gray-300" />
              </div>
              
              <div className="space-y-5">
                {(stats?.intentStats ?? []).slice(0, 4).map((intent, i) => (
                  <div key={intent._id} className="space-y-2">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                      <span className="text-gray-500 dark:text-gray-400">{intent._id || 'Unknown'}</span>
                      <span className="text-gray-900 dark:text-white">{intent.count}</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(intent.count / stats.totalChats) * 100}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-blue-500' : 'bg-purple-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 p-5 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent border border-primary/10 rounded-[2rem] relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={40} className="text-primary" />
              </div>
              <h4 className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                <Zap size={14} fill="currentColor" /> X1 Performance
              </h4>
              <p className="text-xs font-bold text-gray-600 dark:text-gray-300 leading-relaxed">
                {(stats?.escalatedChats ?? 0) === 0 
                  ? "Perfect resolution rate this period. All inquiries were handled autonomously by X1 Chat."
                  : `Current resolution rate is ${Math.round(((stats.totalChats - stats.escalatedChats) / stats.totalChats) * 100)}%. ${stats.escalatedChats} tickets required human review.`}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Tickets Table */}
      <motion.div {...fadeUp(0.5)} className="space-y-4">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                 <TicketIcon size={16} className="text-primary" />
              </div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Recent Support Activity</h3>
           </div>
           <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
             View All Requests <ChevronRight size={14} />
           </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subject</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Priority</th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-400">
                        <Clock size={32} strokeWidth={1} />
                        <p className="text-sm font-bold uppercase tracking-widest">No recent tickets recorded</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentTickets.map((ticket, i) => (
                    <motion.tr 
                      key={ticket?._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.05 }}
                      className="group hover:bg-gray-50/50 dark:hover:bg-primary/5 transition-colors cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-500 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                            {getInitials(ticket?.userId?.name)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{ticket?.userId?.name ?? 'Unknown'}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">#{ticket?._id?.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 line-clamp-1 group-hover:text-primary transition-colors">{ticket?.title}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_CONFIG[ticket?.status]?.class}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${STATUS_CONFIG[ticket?.status]?.dot}`} />
                          {ticket?.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-xl">
                          {ticket?.priority}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-300">
                          {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}
                        </p>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}