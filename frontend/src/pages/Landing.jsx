import LandingNav from '../components/LandingNav';
import Footer from '../components/Footer';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight, CheckCircle2, MessageSquare, Zap, Shield,
  BarChart3, Users, Globe, ChevronDown, Star, Play,
  TrendingUp, Clock, Award, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TYPING_WORDS = ['resolved.', 'automated.', 'simplified.', 'perfected.'];

function TypingWord() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[index];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
      {displayed}
      <span className="animate-pulse text-primary ml-1">|</span>
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

function Section({ children, className = '', id = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  return (
    <motion.section id={id} ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={`py-24 md:py-32 ${className}`}>
      {children}
    </motion.section>
  );
}

const features = [
  { title: 'Unified Inbox', desc: 'Consolidate email, chat, and social media tickets into a single, lightning-fast workspace.', icon: MessageSquare },
  { title: 'AI Co-Pilot', desc: 'Instantly generate accurate replies and summarize long threads using GPT-4.', icon: Zap },
  { title: 'Actionable Insights', desc: 'Real-time analytics on resolution times, CSAT, and team performance.', icon: BarChart3 },
  { title: 'Automated Workflows', desc: 'Route tickets, assign tags, and escalate priority issues automatically.', icon: TrendingUp },
  { title: 'Enterprise Security', desc: 'Bank-grade encryption, SOC2 compliance, and role-based access control.', icon: Shield },
  { title: 'Global Translation', desc: 'Support customers worldwide with real-time, highly accurate translation.', icon: Globe },
];

const faqs = [
  { q: "How long does it take to set up?", a: "Most teams are fully onboarded and seeing value within 15 minutes. We integrate seamlessly with your existing tools." },
  { q: "Does the AI learn from our past tickets?", a: "Yes. X1 Chat ingests your historical data, knowledge base, and brand guidelines to ensure responses are accurate and on-brand." },
  { q: "Can we still use human agents?", a: "Absolutely. X1 Chat handles the repetitive queries and seamlessly hands off complex issues to your human team with full context." },
  { q: "Is our data secure and private?", a: "Security is our top priority. We use AES-256 encryption, are SOC2 compliant, and never use your private data to train public models." },
];

export default function Landing({ isDark, toggleTheme }) {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-white dark:bg-[#060608] text-gray-900 dark:text-white selection:bg-primary/30 overflow-x-hidden">
      <LandingNav isDark={isDark} toggleTheme={toggleTheme} />

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
        {/* Modern SaaS Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.08)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.15)_0%,transparent_50%)]" />
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 blur-[120px] rounded-[100%] pointer-events-none opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col items-center">
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-md mb-8 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">Introducing X1 Chat 2.0</span>
              <ArrowRight size={14} className="text-gray-400" />
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] mb-8 text-gray-900 dark:text-white">
              Customer support, <br />
              <TypingWord />
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
              X1 Chat resolves 60% of your customer inquiries instantly using advanced AI, 
              giving your human team the focus they need for what truly matters.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link to="/register" className="btn-primary py-4 px-8 text-base w-full sm:w-auto shadow-xl shadow-primary/20">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button 
                onClick={() => document.getElementById('howitworks')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2.5 px-8 py-4 text-base font-semibold text-gray-700 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 dark:text-white transition-all shadow-sm w-full sm:w-auto"
              >
                <ChevronDown size={16} className="text-gray-400" />
                How It Works
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-primary" /> No credit card</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-primary" /> Instant setup</div>
            </motion.div>
          </motion.div>

          {/* Abstract Dashboard Preview (Linear style) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22,1,0.36,1] }}
            className="mt-20 w-full max-w-5xl mx-auto perspective-[2000px]"
          >
            <div className="relative rounded-2xl md:rounded-[32px] border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#0D0D10]/80 backdrop-blur-2xl shadow-2xl dark:shadow-[0_40px_80px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent dark:from-white/5 dark:to-transparent pointer-events-none" />
              {/* Fake Mac Titlebar */}
              <div className="h-12 border-b border-gray-200 dark:border-white/10 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                {/* Skeleton UI elements to look like a premium dashboard */}
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-1/3 bg-gray-100 dark:bg-white/5 rounded-lg" />
                  <div className="h-64 w-full bg-gradient-to-br from-gray-50 to-white dark:from-white/5 dark:to-transparent border border-gray-200 dark:border-white/5 rounded-xl flex flex-col p-6 gap-4">
                     <div className="flex gap-4 items-end h-full pt-10">
                        <div className="w-full bg-primary/20 rounded-t-md h-[40%]" />
                        <div className="w-full bg-primary/40 rounded-t-md h-[60%]" />
                        <div className="w-full bg-primary/60 rounded-t-md h-[80%]" />
                        <div className="w-full bg-primary/80 rounded-t-md h-[100%]" />
                        <div className="w-full bg-primary rounded-t-md h-[90%]" />
                     </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-24 w-full bg-orange-50 dark:bg-primary/10 border border-orange-100 dark:border-primary/20 rounded-xl flex items-center px-5">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Zap size={20} /></div>
                    <div className="ml-4"><div className="h-4 w-16 bg-primary/20 rounded mb-2"/><div className="h-6 w-24 bg-primary/40 rounded"/></div>
                  </div>
                  <div className="h-24 w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-5">
                     <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"/>
                     <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"/>
                  </div>
                  <div className="h-24 w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-5">
                     <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"/>
                     <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"/>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Logo Cloud ─────────────────────────────────────────────── */}
      <section className="py-10 border-b border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-transparent">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-8 uppercase tracking-widest">Trusted by innovative teams worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['Acme Corp', 'GlobalTech', 'Nexus', 'Starlight', 'Quantum'].map(name => (
              <span key={name} className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento Features ─────────────────────────────────────────── */}
      <Section id="features" className="bg-gray-50/30 dark:bg-[#08080A]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Built for speed & scale</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
              Everything you need to deliver exceptional support at scale, wrapped in a beautiful, lightning-fast interface.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                className={`group relative overflow-hidden rounded-3xl bg-white dark:bg-[#111115] border border-gray-200 dark:border-white/10 p-8 hover:shadow-xl transition-all duration-300
                  ${i === 0 || i === 3 ? 'md:col-span-2' : 'md:col-span-1'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed mt-auto">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <Section id="howitworks" className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#060608]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} className="text-center mb-20">
            <span className="text-primary text-xs font-bold uppercase tracking-widest mb-3 block">Workflow</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Up and running in minutes</h2>
          </motion.div>
          <div className="space-y-6">
            {[
              { step: '01', title: 'Connect your channels', desc: 'Integrate email, chat, and social in minutes with zero-code connectors.' },
              { step: '02', title: 'AI learns your brand', desc: 'Train the AI on your docs and past tickets for accurate, on-brand replies.' },
              { step: '03', title: 'Watch tickets resolve', desc: 'Sit back as X1 Chat auto-resolves up to 60% of queries instantly.' },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp}
                className="group relative rounded-3xl p-8 border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111115] hover:border-primary/30 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-2xl font-black text-gray-300 dark:text-gray-700 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                  {s.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Stats / Impact ────────────────────────────────────────────── */}
      <Section className="border-y border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#08080A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
             { value: '10M+', label: 'Tickets Managed' },
             { value: '60%', label: 'AI Resolution Rate' },
             { value: '< 2m', label: 'Avg Response Time' },
             { value: '99.9%', label: 'Uptime SLA' }
          ].map((s, i) => (
            <motion.div key={i} variants={fadeUp}>
              <p className="text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">{s.value}</p>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── Testimonials (Bento Style) ───────────────────────────────── */}
      <Section id="testimonials" className="bg-white dark:bg-[#060608]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeUp} className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Loved by world-class teams</h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah K.', role: 'Head of Support, Skyline', quote: 'X1 Chat cut our first-response time from 4 hours to 8 minutes. Absolutely game-changing for our small team.' },
              { name: 'Marcus Chen', role: 'Director of Ops, TechFlow', quote: 'Resolution time dropped 65% in month one. The AI is eerily good at knowing exactly what customers need without any human intervention.' },
              { name: 'Priya R.', role: 'CX Lead, Apex SaaS', quote: 'Finally a support tool that feels like it was built in 2026. Fast, beautiful, and insanely powerful.' }
            ].map((t, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-gray-50 dark:bg-[#111115] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-lg shadow-gray-200/50 dark:shadow-none">
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => <Star key={idx} size={16} className="fill-primary text-primary" />)}
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium leading-relaxed mb-8">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-primary/30">
                    {t.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <Section id="faq" className="border-t border-gray-200 dark:border-white/10 bg-gray-50/30 dark:bg-[#08080A]">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-6">Frequently Asked Questions</h2>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={fadeUp} className="border border-gray-200 dark:border-white/10 rounded-2xl bg-white dark:bg-[#111115] overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-bold text-gray-900 dark:text-white">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-400" />}
                </button>
                <div className={`px-6 pb-6 text-gray-600 dark:text-gray-400 font-medium leading-relaxed transition-all ${openFaq === i ? 'block' : 'hidden'}`}>
                  {faq.a}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <Section className="bg-white dark:bg-[#060608]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div variants={fadeUp} className="relative rounded-[40px] overflow-hidden text-center py-24 px-8 border border-primary/20 bg-primary/5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/20 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-5xl sm:text-6xl font-black tracking-tighter mb-6 text-gray-900 dark:text-white">
                Ready to transform support?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
                Join thousands of teams delivering superhuman support at a fraction of the cost.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="btn-primary py-4 px-10 text-lg shadow-2xl shadow-primary/30 w-full sm:w-auto">
                  Get Started for Free
                </Link>
                <Link to="/register" className="py-4 px-10 text-lg font-bold text-center text-gray-900 dark:text-white bg-white dark:bg-[#111115] border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors w-full sm:w-auto">
                  Sign Up Now
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      <Footer />
    </div>
  );
}