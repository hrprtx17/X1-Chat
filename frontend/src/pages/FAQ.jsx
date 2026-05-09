import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Plus, Search, ChevronDown, ChevronUp, Edit2, Trash2,
  HelpCircle, X, MessageSquare, Sparkles, Zap, 
  ArrowRight, Filter, AlertCircle, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 300, damping: 30 } 
  }
};

export default function FAQ() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [form, setForm] = useState({ question: '', answer: '', category: 'General' });

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/faqs');
      setFaqs(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaqs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await API.put(`/faqs/${editingFaq._id}`, form);
        toast.success('FAQ updated successfully');
      } else {
        await API.post('/faqs', form);
        toast.success('FAQ created successfully');
      }
      setShowModal(false);
      setEditingFaq(null);
      setForm({ question: '', answer: '', category: 'General' });
      fetchFaqs();
    } catch (err) {
      toast.error('Operation failed. Please try again.');
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await API.delete(`/faqs/${id}`);
      toast.success('FAQ removed');
      fetchFaqs();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-spacing pb-20 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <HelpCircle size={20} className="text-primary" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Help Center</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium ml-13">
            Instant answers to common queries about X1 Chat.
          </p>
        </motion.div>

        {isAdmin && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button 
              onClick={() => {
                setEditingFaq(null);
                setForm({ question: '', answer: '', category: 'General' });
                setShowModal(true);
              }} 
              className="btn-primary px-6 py-3.5 flex items-center gap-2 group whitespace-nowrap"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              Add Resource
            </button>
          </motion.div>
        )}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-center">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            className="w-full px-11 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            placeholder="Search for articles, categories, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4 min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Indexing knowledge base...</p>
            </motion.div>
          ) : filteredFaqs.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card py-32 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center mb-6">
                <Search size={32} className="text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">No results found</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed font-medium">
                We couldn't find anything matching "{searchTerm}". Try broadening your search or creating a support ticket.
              </p>
            </motion.div>
          ) : (
            <motion.div key="list" variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-3">
              {filteredFaqs.map((faq) => (
                <motion.div 
                  key={faq._id} 
                  variants={itemVariants}
                  className={`card overflow-hidden transition-all duration-300 ${expandedId === faq._id ? 'ring-2 ring-primary/20 shadow-xl shadow-primary/5' : 'hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <button
                    onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                       <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-lg self-start sm:self-center whitespace-nowrap">
                         {faq.category}
                       </span>
                       <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                         {faq.question}
                       </span>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      {isAdmin && (
                        <div className="hidden md:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => {
                              setEditingFaq(faq);
                              setForm({ question: faq.question, answer: faq.answer, category: faq.category });
                              setShowModal(true);
                            }}
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => deleteFaq(faq._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${expandedId === faq._id ? 'bg-primary text-white rotate-180' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedId === faq._id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-8 pb-8 pt-2">
                          <div className="h-px w-full bg-gray-100 dark:bg-gray-800 mb-6" />
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-sm">
                              {faq.answer}
                            </p>
                          </div>
                          {isAdmin && (
                             <div className="flex md:hidden items-center gap-6 mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <button onClick={() => {
                                  setEditingFaq(faq);
                                  setForm({ question: faq.question, answer: faq.answer, category: faq.category });
                                  setShowModal(true);
                                }} className="text-xs font-black text-primary uppercase tracking-widest">Edit Entry</button>
                                <button onClick={() => deleteFaq(faq._id)} className="text-xs font-black text-red-500 uppercase tracking-widest">Delete Entry</button>
                             </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CTA Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-12">
        <div className="p-10 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent border border-primary/10 rounded-[3rem] relative group overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Sparkles size={120} className="text-primary" />
           </div>
           
           <div className="flex items-center gap-6 text-center md:text-left z-10">
              <div className="w-16 h-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 relative">
                 <Zap size={30} fill="currentColor" />
                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white dark:border-[#0D0D10] rounded-full" />
              </div>
              <div className="space-y-1">
                 <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Need dedicated support?</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Our agents are standing by to assist you 24/7</p>
              </div>
           </div>
           
           <button 
             onClick={() => navigate('/chat')} 
             className="btn-primary px-10 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center gap-3 z-10"
           >
             Message X1 Chat <ArrowRight size={18} />
           </button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0D0D10] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {editingFaq ? 'Modify Article' : 'New Article'}
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Update knowledge base content</p>
                </div>
                <button onClick={() => setShowModal(false)} className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category Label</label>
                  <div className="relative group">
                    <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text" required className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. Billing, Technical, Accounts"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Question</label>
                  <div className="relative group">
                    <Info className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="text" required className="w-full pl-14 pr-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="e.g. How do I reset my password?"
                      value={form.question}
                      onChange={(e) => setForm({ ...form, question: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Answer</label>
                  <textarea
                    required rows={5} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Provide a comprehensive explanation..."
                    value={form.answer}
                    onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest">Discard</button>
                  <button type="submit" className="flex-[2] py-4 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-0.5 transition-all">Publish Resource</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

