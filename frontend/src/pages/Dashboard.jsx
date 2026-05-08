import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MessageSquare, Ticket, Users, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import API from '../utils/axios';
import toast, { Toaster } from 'react-hot-toast';

const COLORS = ['#00D97E', '#00B569', '#5DCAA5', '#9FE1CB', '#00FF94'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'general' });
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/chat/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load stats');
    }
    setLoading(false);
  };

  const fetchFaqs = async () => {
    try {
      const { data } = await API.get('/faqs');
      setFaqs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
      await fetchFaqs();
    };

    loadData();
  }, []);

  const createFaq = async (e) => {
    e.preventDefault();
    try {
      await API.post('/faqs', faqForm);
      toast.success('FAQ created!');
      setFaqForm({ question: '', answer: '', category: 'general' });
      setShowFaqForm(false);
      fetchFaqs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const deleteFaq = async (id) => {
    try {
      await API.delete(`/faqs/${id}`);
      toast.success('FAQ deleted!');
      fetchFaqs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const tabs = ['overview', 'charts', 'faqs'];

  if (loading) {
    return (
      <div className="app-shell min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          {[0,1,2].map(i => (
            <div key={i} className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#131a2f', color: '#fff', border: '1px solid rgba(134,171,255,0.3)' } }} />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Live intelligence across conversations, tickets, and FAQ operations.</p>
        </div>

        <div className="flex gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-indigo-300 to-emerald-200 text-slate-900'
                  : 'glass text-slate-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Chats" value={stats.totalChats} icon={MessageSquare} color="primary" />
              <StatCard label="Total Tickets" value={stats.totalTickets} icon={Ticket} color="blue" />
              <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="purple" />
              <StatCard label="Escalated" value={stats.escalatedChats} icon={AlertTriangle} color="red" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-1 text-sm">Open Tickets</h3>
                <p className="text-3xl font-bold text-primary">{stats.openTickets}</p>
                <p className="text-gray-500 text-xs mt-1">Awaiting resolution</p>
              </div>
              <div className="glass-card p-5">
                <h3 className="text-white font-semibold mb-1 text-sm">Resolved Tickets</h3>
                <p className="text-3xl font-bold text-green-400">{stats.resolvedTickets}</p>
                <p className="text-gray-500 text-xs mt-1">Successfully closed</p>
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-4">Intent Distribution</h3>
              <div className="space-y-3">
                {stats.intentStats?.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-400 text-sm capitalize w-24">{item._id}</span>
                    <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-300 to-emerald-200 rounded-full transition-all duration-1000"
                        style={{ width: `${(item.count / stats.totalChats) * 100}%` }}
                      />
                    </div>
                    <span className="text-slate-500 text-xs w-6">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-6">Chats by Intent</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats.intentStats?.map(i => ({ name: i._id, count: i.count }))}>
                  <XAxis dataKey="name" stroke="#4B5563" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <YAxis stroke="#4B5563" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: '#141b30', border: '1px solid rgba(148,163,255,0.25)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="count" fill="#93a6ff" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card p-6">
              <h3 className="text-white font-semibold mb-6">Tickets by Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.ticketsByStatus?.map(i => ({ name: i._id, value: i.count }))}
                    cx="50%" cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {stats.ticketsByStatus?.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#141b30', border: '1px solid rgba(148,163,255,0.25)', borderRadius: 8, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {stats.last7Days?.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-white font-semibold mb-6">Chats — Last 7 Days</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={stats.last7Days?.map(d => ({ date: d._id, chats: d.count }))}>
                    <XAxis dataKey="date" stroke="#4B5563" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <YAxis stroke="#4B5563" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#141b30', border: '1px solid rgba(148,163,255,0.25)', borderRadius: 8, color: '#fff' }} />
                    <Line type="monotone" dataKey="chats" stroke="#93a6ff" strokeWidth={2} dot={{ fill: '#93a6ff', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'faqs' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center mb-6">
              <p className="text-slate-400 text-sm">{faqs.length} FAQs total</p>
              <button
                onClick={() => setShowFaqForm(!showFaqForm)}
                className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
              >
                <Plus size={15} /> Add FAQ
              </button>
            </div>

            {showFaqForm && (
              <div className="glass-card p-5 mb-6">
                <form onSubmit={createFaq} className="space-y-3">
                  <input
                    placeholder="Question"
                    value={faqForm.question}
                    onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="input-premium px-4 py-3 placeholder-slate-500 text-sm"
                    required
                  />
                  <textarea
                    placeholder="Answer"
                    value={faqForm.answer}
                    onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                    rows={2}
                    className="textarea-premium px-4 py-3 placeholder-slate-500 text-sm resize-none"
                    required
                  />
                  <div className="flex gap-3">
                    <select
                      value={faqForm.category}
                      onChange={e => setFaqForm({ ...faqForm, category: e.target.value })}
                      className="select-premium px-4 py-2.5 text-sm bg-transparent"
                    >
                      <option value="general" className="bg-slate-900">General</option>
                      <option value="billing" className="bg-slate-900">Billing</option>
                      <option value="technical" className="bg-slate-900">Technical</option>
                      <option value="account" className="bg-slate-900">Account</option>
                    </select>
                    <button type="submit" className="btn-primary flex-1 py-2.5 text-sm">Save FAQ</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div
                  key={faq._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex gap-4 surface-hover"
                >
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium mb-1">{faq.question}</p>
                    <p className="text-slate-400 text-xs">{faq.answer}</p>
                    <span className="text-xs text-indigo-100 bg-indigo-400/15 px-2 py-0.5 rounded-lg mt-2 inline-block">{faq.category}</span>
                  </div>
                  <button
                    onClick={() => deleteFaq(faq._id)}
                    className="text-rose-300 hover:text-rose-200 transition p-1"
                  >
                    <Trash2 size={15} />
                  </button>
                </motion.div>
              ))}
              {faqs.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p>No FAQs yet. Add your first FAQ!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}