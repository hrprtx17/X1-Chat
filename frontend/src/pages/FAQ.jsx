import { useState, useEffect } from 'react';
import API from '../utils/axios';
import { 
  Plus, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Edit2, 
  Trash2,
  HelpCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaq) {
        await API.put(`/faqs/${editingFaq._id}`, form);
        toast.success('FAQ updated');
      } else {
        await API.post('/faqs', form);
        toast.success('FAQ created');
      }
      setShowModal(false);
      setEditingFaq(null);
      setForm({ question: '', answer: '', category: 'General' });
      fetchFaqs();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteFaq = async (id) => {
    if (!window.confirm('Delete this FAQ?')) return;
    try {
      await API.delete(`/faqs/${id}`);
      toast.success('FAQ deleted');
      fetchFaqs();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="section-spacing fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">Help & FAQs</h1>
          <p className="text-gray-500 mt-1 font-medium">Quick answers to common questions about X1Chat.</p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => {
              setEditingFaq(null);
              setForm({ question: '', answer: '', category: 'General' });
              setShowModal(true);
            }} 
            className="btn-primary w-full sm:w-auto"
          >
            <Plus size={18} className="mr-2" />
            Add Question
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative group max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="input-field pl-12 py-4 text-base shadow-sm border-gray-100 dark:border-gray-800"
          placeholder="Search for answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* FAQ List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="flex gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="card p-12 text-center bg-gray-50/50 dark:bg-gray-900/30">
            <HelpCircle size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No results found</h3>
            <p className="text-gray-500 mt-1 font-medium">Try different keywords or contact our support team.</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq._id} className={`card transition-all duration-200 border-gray-100 dark:border-gray-800 ${expandedId === faq._id ? 'ring-2 ring-primary/5 shadow-md' : ''}`}>
              <button
                onClick={() => setExpandedId(expandedId === faq._id ? null : faq._id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">{faq.category}</span>
                   <span className="text-base font-bold text-gray-900 dark:text-white">{faq.question}</span>
                </div>
                <div className="flex items-center gap-4">
                  {isAdmin && (
                    <div className="hidden sm:flex items-center gap-2 mr-4" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => {
                          setEditingFaq(faq);
                          setForm({ question: faq.question, answer: faq.answer, category: faq.category });
                          setShowModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteFaq(faq._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                  {expandedId === faq._id ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
                </div>
              </button>
              {expandedId === faq._id && (
                <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                      {faq.answer}
                    </p>
                  </div>
                  {isAdmin && (
                     <div className="flex sm:hidden items-center gap-4 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <button onClick={() => {
                          setEditingFaq(faq);
                          setForm({ question: faq.question, answer: faq.answer, category: faq.category });
                          setShowModal(true);
                        }} className="text-sm font-bold text-primary">Edit</button>
                        <button onClick={() => deleteFaq(faq._id)} className="text-sm font-bold text-red-600">Delete</button>
                     </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-950/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-gray-900/30">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {editingFaq ? 'Edit FAQ' : 'Add FAQ'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Category</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g. Billing, Technical"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Question</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="What is the question?"
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Answer</label>
                <textarea
                  required
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Provide a detailed answer..."
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary py-3">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="card p-8 bg-primary/5 border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
               <MessageSquare size={24} />
            </div>
            <div>
               <h4 className="text-lg font-bold">Still need help?</h4>
               <p className="text-sm text-gray-500 font-medium">Our support team is here to assist you 24/7.</p>
            </div>
         </div>
         <button onClick={() => navigate('/chat')} className="btn-primary px-8">Contact Support</button>
      </div>
    </div>
  );
}
