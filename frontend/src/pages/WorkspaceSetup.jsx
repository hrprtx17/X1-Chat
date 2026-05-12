import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Briefcase, Globe, Sparkles, ArrowRight, FileText } from 'lucide-react';

const STORAGE_KEY = 'x1-workspace';

export default function WorkspaceSetup() {
  const navigate = useNavigate();
  const [workspaceName, setWorkspaceName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        navigate('/workspace');
      }
    } catch (err) {
      console.error('Workspace init error:', err);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!workspaceName.trim() || !websiteUrl.trim()) {
      toast.error('Please enter a workspace name and website URL.');
      return;
    }

    setLoading(true);
    const workspace = {
      name: workspaceName.trim(),
      website: websiteUrl.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
      toast.success('Workspace created successfully!');
      navigate('/workspace');
    } catch (err) {
      console.error('Failed to save workspace:', err);
      toast.error('Unable to save workspace details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#07070a] flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-4xl rounded-[2rem] bg-white dark:bg-[#111118] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-0 md:gap-8">
          <div className="p-10 md:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.35em] text-primary/80">Workspace Builder</p>
                <h1 className="mt-2 text-3xl font-black text-gray-900 dark:text-white">Create your AI workspace</h1>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl leading-7">
              Set up a dedicated workspace for your support chatbot. Add your site, upload knowledge, and deploy a web integration in minutes.
            </p>

            <div className="mt-10 space-y-8">
              <div className="rounded-3xl bg-primary/5 dark:bg-white/5 p-6 border border-primary/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary"><Globe size={24} /></div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Workspace details</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">The workspace name and website URL will be used to personalize your chatbot and deploy experience.</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="label">Workspace Name</label>
                  <input
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    placeholder="Example: Acme Support"
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="label">Website URL</label>
                  <input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://www.example.com"
                    className="input-field"
                  />
                </div>

                <div className="space-y-2">
                  <label className="label">Workspace description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what your bot should help with, e.g. support, onboarding, product questions."
                    className="input-field min-h-[140px] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3.5 text-sm font-bold"
                >
                  {loading ? 'Creating workspace…' : 'Create workspace and continue'}
                </button>
              </form>
            </div>
          </div>

          <div className="relative bg-gradient-to-b from-primary/10 to-transparent p-10 md:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="rounded-3xl border border-primary/15 bg-white dark:bg-[#10101a] p-6 shadow-xl shadow-primary/5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Launch checklist</p>
                    <h2 className="mt-3 text-xl font-black text-gray-900 dark:text-white">Your bot-ready workspace</h2>
                  </div>
                  <div className="w-11 h-11 rounded-3xl bg-primary/5 text-primary flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                  <p>1. Give your workspace a memorable name.</p>
                  <p>2. Add your website URL so the bot can match your brand.</p>
                  <p>3. Describe the intended use case for natural responses.</p>
                </div>
              </div>

              <div className="rounded-3xl bg-white dark:bg-[#0F1017] border border-gray-100 dark:border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-primary/10 text-primary rounded-3xl flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900 dark:text-white">Feed data to the bot</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Later you can upload docs, FAQs, and guides to train your assistant.</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-dashed border-gray-200 dark:border-white/10 p-5 text-sm text-gray-500 dark:text-gray-400">
                  Upload files or paste knowledge snippets once your workspace is ready.
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-3xl bg-gradient-to-br from-white to-primary/5 p-6 border border-primary/20">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Deploy faster</p>
              <p className="mt-3 font-black text-lg text-gray-900 dark:text-white">Get your website assistant live.</p>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">You will be able to deploy embed code or connect a widget to your site after setup.</p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary text-white px-4 py-2 text-xs font-black uppercase tracking-[0.3em]">
                <ArrowRight size={14} /> Live in minutes
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
