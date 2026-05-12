import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { UploadCloud, Layers, Globe, Terminal, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'x1-workspace';

export default function Workspace() {
  const navigate = useNavigate();
  const [workspace] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [dataset, setDataset] = useState('');
  const [deployDomain, setDeployDomain] = useState('');
  const [savedData, setSavedData] = useState(false);
  const [deployed, setDeployed] = useState(false);

  useEffect(() => {
    if (!workspace) {
      navigate('/workspace-setup');
    }
  }, [navigate, workspace]);

  const handleScoreData = () => {
    if (!dataset.trim()) {
      toast.error('Enter data or upload content to feed the chatbot.');
      return;
    }
    setSavedData(true);
    toast.success('Data saved to your workspace.');
    setDataset('');
  };

  const handleDeploy = () => {
    if (!deployDomain.trim()) {
      toast.error('Enter the website URL or domain for deployment.');
      return;
    }
    setDeployed(true);
    toast.success(`Deployment started for ${deployDomain.trim()}.`);
  };

  const handleChat = () => {
    navigate('/chat');
  };

  if (!workspace) {
    return null;
  }

  return (
    <div className="py-10 px-4 md:px-8 xl:px-12 bg-[var(--bg-alt)] min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-8">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400 dark:text-gray-500">Workspace home</p>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">{workspace.name}</h1>
            <p className="max-w-2xl text-sm text-gray-500 dark:text-gray-400">{workspace.description || 'Your workspace is ready. Feed knowledge, test the chatbot, and deploy your website assistant from here.'}</p>
          </div>
          <button onClick={handleChat} className="btn-primary px-6 py-3.5 text-sm font-bold">
            Open Chat Workspace
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white dark:bg-[#0F111B] border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/20 dark:shadow-none p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">Feed your chatbot</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paste knowledge snippets or upload files to train your assistant.</p>
                </div>
                <UploadCloud className="text-primary" size={24} />
              </div>

              <div className="space-y-4">
                <textarea
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  placeholder="Paste FAQs, product details, support guidelines, or any knowledge content here..."
                  className="input-field min-h-[220px] resize-none"
                />
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                    <p className="font-black uppercase tracking-[0.2em]">Data source</p>
                    <p>Upload a .txt/.md file or enter text directly. This is a placeholder experience until backend ingestion is supported.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <label className="cursor-pointer inline-flex items-center justify-center rounded-2xl border border-gray-200 dark:border-white/10 px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                      <span>Upload file</span>
                      <input
                        type="file"
                        accept=".txt,.md,.pdf"
                        className="hidden"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (e) => setDataset(String(e.target.result));
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                    <button onClick={handleScoreData} className="btn-primary px-5 py-3 text-sm font-bold">
                      Save Data
                    </button>
                  </div>
                </div>
                {savedData && (
                  <div className="rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-4 text-sm text-emerald-700 dark:text-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} /> Data is ready in your workspace.
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white dark:bg-[#0F111B] border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/20 dark:shadow-none p-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">Deploy website assistant</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connect the bot to your site with a deployment URL or embed snippet.</p>
                </div>
                <Layers className="text-primary" size={24} />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="label">Website or deployment domain</label>
                  <input
                    value={deployDomain}
                    onChange={(e) => setDeployDomain(e.target.value)}
                    placeholder="https://www.yoursite.com"
                    className="input-field"
                  />
                </div>
                <button onClick={handleDeploy} className="btn-primary px-6 py-3.5 text-sm font-bold">
                  {deployed ? 'Deployment running' : 'Deploy to site'}
                </button>
                {deployed && (
                  <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-700 dark:text-slate-200">
                    <p className="font-bold">Deployment scheduled</p>
                    <p className="mt-1">Your website assistant is being deployed to <span className="font-semibold">{deployDomain}</span>.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-[2rem] bg-white dark:bg-[#0F111B] border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-200/20 dark:shadow-none p-8">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <p className="text-sm font-black text-gray-900 dark:text-white">Workspace details</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Track your workspace configuration and quick actions.</p>
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <p className="font-black text-gray-800 dark:text-white">Workspace</p>
                  <p>{workspace.name}</p>
                </div>
                <div>
                  <p className="font-black text-gray-800 dark:text-white">Website</p>
                  <p>{workspace.website}</p>
                </div>
                <div>
                  <p className="font-black text-gray-800 dark:text-white">Created</p>
                  <p>{new Date(workspace.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] bg-primary/10 border border-primary/20 p-6 text-sm text-gray-900 dark:text-white">
              <p className="text-xs uppercase tracking-[0.3em] font-black text-primary">Next steps</p>
              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Terminal size={18} className="text-primary mt-1" />
                  <p>Connect your website with the widget snippet after deployment.</p>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowUpRight size={18} className="text-primary mt-1" />
                  <p>Open chat to start testing your assistant against live queries.</p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
