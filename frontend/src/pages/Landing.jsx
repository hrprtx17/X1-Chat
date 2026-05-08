import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, BarChart3, Zap, Shield, Clock, ArrowRight, Bot, Users, Sparkles } from 'lucide-react';
import LandingNav from '../components/LandingNav';
import Footer from '../components/Footer';

const features = [
  { icon: Bot, title: 'AI-Powered Chatbot', desc: 'Groq LLaMA AI handles customer queries instantly with smart intent detection and contextual responses.' },
  { icon: Ticket, title: 'Smart Ticket System', desc: 'Automatically escalate complex issues into support tickets with priority management and status tracking.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time insights into chat volume, intent breakdown, ticket status and customer satisfaction metrics.' },
  { icon: Shield, title: 'Secure & Private', desc: 'JWT authentication, bcrypt password hashing, and protected API routes keep your data safe.' },
  { icon: Clock, title: '24/7 Availability', desc: 'AI never sleeps. Provide instant support to customers at any hour without extra staffing costs.' },
  { icon: Users, title: 'Multi-User Support', desc: 'Separate user and admin roles with dedicated dashboards and access controls.' },
];

const steps = [
  { num: '01', title: 'Register your account', desc: 'Sign up in seconds. No credit card required.' },
  { num: '02', title: 'Configure your FAQs', desc: 'Add your common questions so AI responds accurately.' },
  { num: '03', title: 'Start supporting customers', desc: 'Share your link and let AI handle the queries.' },
];

const stats = [
  { value: 90, suffix: '%', label: 'Queries auto-resolved' },
  { value: 24, suffix: '/7', label: 'Always available' },
  { value: 3, suffix: 'x', label: 'Faster response time' },
  { value: 60, suffix: '%', label: 'Cost reduction' },
];

const testimonials = [
  {
    name: 'Support Lead',
    company: 'Modern eCommerce',
    quote: 'We reduced repetitive tickets instantly. The AI answers feel consistent, and escalations are clean.',
  },
  {
    name: 'Ops Manager',
    company: 'SaaS Startup',
    quote: 'The workflow is fast: chat → escalation → visibility. It feels like a real product, not a demo.',
  },
  {
    name: 'Founder',
    company: 'D2C Brand',
    quote: 'Clean UI, quick setup, and our customers get help immediately. Exactly what we wanted.',
  },
];

function usePremiumTyping(phrases, opts) {
  const { typeMs = 46, pauseMs = 1200, fadeMs = 260 } = opts || {};
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [opacity, setOpacity] = useState(1);
  const [phase, setPhase] = useState('typing'); // typing | hold | fade

  useEffect(() => {
    const safePhrases = Array.isArray(phrases) && phrases.length ? phrases : ['modern businesses'];
    const current = safePhrases[idx % safePhrases.length];

    if (phase === 'typing') {
      const id = window.setTimeout(() => {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setPhase('hold');
      }, typeMs);
      return () => window.clearTimeout(id);
    }

    if (phase === 'hold') {
      const id = window.setTimeout(() => {
        setOpacity(0);
        setPhase('fade');
      }, pauseMs);
      return () => window.clearTimeout(id);
    }

    if (phase === 'fade') {
      const id = window.setTimeout(() => {
        setText('');
        setOpacity(1);
        setIdx((v) => (v + 1) % safePhrases.length);
        setPhase('typing');
      }, fadeMs);
      return () => window.clearTimeout(id);
    }
  }, [fadeMs, idx, pauseMs, phase, phrases, text.length, typeMs]);

  return { text, opacity };
}

export default function Landing() {
  const navigate = useNavigate();
  const chatbotPills = ['Order status and delivery', 'Refund and billing requests', 'Account login issues', 'Subscription upgrades'];
  const typingPhrases = useMemo(
    () => [
      'modern businesses.',
      'fast growing startups.',
      'high-volume support teams.',
      'scaling online businesses.',
      'teams that move fast.',
    ],
    []
  );
  const { text: typedSuffix, opacity: typedOpacity } = usePremiumTyping(typingPhrases, {
    typeMs: 44,
    pauseMs: 1200,
    fadeMs: 240,
  });

  return (
    <div className="app-shell min-h-screen">
      <LandingNav />

      <section className="relative px-6 pt-10 sm:pt-14 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[820px] h-[820px] bg-orange-300/30 rounded-full blur-[140px]" />
          <div className="absolute top-24 left-6 w-[320px] h-[320px] bg-amber-200/45 rounded-full blur-[110px]" />
          <div className="absolute top-10 right-6 w-[260px] h-[260px] bg-orange-200/35 rounded-full blur-[110px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs sm:text-sm text-[var(--brand)] mb-6 border border-orange-200/50">
                <Zap size={14} />
                AI support, designed for modern teams
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-7xl font-semibold text-[var(--text-main)] mb-5 leading-tight tracking-tight">
                <span className="block">
                  <span className="gradient-text">AI customer support built for </span>
                  <span
                    className="gradient-text inline-flex items-center"
                    style={{ opacity: typedOpacity, transition: 'opacity 260ms ease' }}
                  >
                    {typedSuffix}
                    <span className="ml-1 w-[10px] h-[1.05em] bg-[var(--brand)]/70 inline-block rounded-sm cursor-blink" />
                  </span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-[var(--text-soft)] mb-8 leading-relaxed">
                Resolve common questions instantly, escalate intelligently, and see everything clearly—without bloated workflows.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary text-base py-3 px-8 flex items-center gap-2 justify-center tap"
                >
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => document.getElementById('assistant')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="glass text-[var(--text-main)] text-base py-3 px-8 rounded-xl hover:border-orange-300/60 transition-all flex items-center gap-2 justify-center tap"
                >
                  See the AI Assistant
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-[var(--text-soft)]">
                <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Fast setup</span>
                <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Secure auth</span>
                <span className="inline-flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" /> Tickets + analytics</span>
              </div>
            </div>

            <div className="mt-10 sm:mt-12">
              <div className="glass-card p-4 sm:p-6 md:p-7">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-200/40 border border-orange-300/35 flex items-center justify-center">
                      <Sparkles size={16} className="text-[var(--brand)]" />
                    </div>
                    <div>
                      <p className="text-[var(--text-main)] font-semibold text-sm">Ask X1Chat</p>
                      <p className="text-[var(--text-soft)] text-xs">Try a prompt—see how the assistant responds</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full border border-orange-200/60 text-[var(--text-soft)] bg-white/50">Live preview</span>
                </div>

                <div className="glass rounded-2xl border border-orange-200/55 px-4 py-4 flex items-center gap-3">
                  <input
                    readOnly
                    value="Customer says they can’t login. Ask questions, suggest fixes, then escalate if needed."
                    className="flex-1 bg-transparent text-sm text-[var(--text-main)] focus:outline-none"
                  />
                  <button className="btn-primary text-sm px-4 py-2 tap">Send</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {stats.map((s) => (
                    <div key={s.label} className="glass rounded-xl p-4 border border-orange-200/40">
                      <p className="text-2xl md:text-3xl font-semibold text-[var(--text-main)] mb-1">
                        {s.value}{s.suffix}
                      </p>
                      <p className="text-xs text-[var(--text-soft)]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      <section id="testimonials" className="px-6 pb-20 sm:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)] mb-3">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--text-main)]">Loved by modern support teams</h2>
            <p className="text-[var(--text-soft)] mt-3 max-w-2xl mx-auto">A clean, fast support workspace with AI that feels helpful—not noisy.</p>
          </div>

          <div className="glass-card p-4 sm:p-5 overflow-hidden">
            <motion.div
              className="flex gap-4 will-change-transform"
              initial={{ x: 0 }}
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={`${t.name}-${i}`}
                  className="glass-card p-6 surface-hover flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px]"
                >
                  <p className="text-[var(--text-main)] leading-relaxed">“{t.quote}”</p>
                  <div className="mt-4 pt-4 border-t border-orange-200/40">
                    <p className="text-sm font-semibold text-[var(--text-main)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-soft)]">{t.company}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section id="assistant" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto glass-card p-7 md:p-10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)] mb-3">AI assistant experience</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-[var(--text-main)] mb-4">A chatbot workspace your team will enjoy using.</h2>
            <p className="text-[var(--text-soft)] mb-8">Inspired by modern app builders, crafted uniquely for support teams. Type naturally, get instant answers, and escalate in one click.</p>
          </div>

          <div className="glass rounded-3xl border border-orange-200/50 p-5 md:p-6">
            <div className="rounded-2xl bg-white/70 dark:bg-black/20 border border-orange-100/60 px-4 py-4 flex items-center gap-3">
              <Sparkles size={16} className="text-[var(--brand)]" />
              <input
                readOnly
                value="A customer says they were charged twice. Help me resolve this."
                className="flex-1 bg-transparent text-sm text-[var(--text-main)] focus:outline-none"
              />
              <button className="btn-primary text-sm px-4 py-2">Send</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {chatbotPills.map((pill) => (
                <span key={pill} className="text-xs px-3 py-1.5 rounded-full border border-orange-200/70 text-[var(--text-soft)] bg-white/60">
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-6 border-y border-orange-200/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-[var(--text-main)] mb-4">Built for modern support organizations</h2>
            <p className="text-[var(--text-soft)] text-lg max-w-xl mx-auto">A cohesive toolkit for AI-first conversations, human escalation, and performance visibility.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 surface-hover group"
                >
                  <div className="w-11 h-11 bg-orange-200/35 border border-orange-300/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200/50 transition-all">
                    <Icon size={20} className="text-[var(--brand)]" />
                  </div>
                  <h3 className="text-[var(--text-main)] font-semibold mb-2">{f.title}</h3>
                  <p className="text-[var(--text-soft)] text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="howitworks" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto glass-card p-8 md:p-10">
          <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-8">From setup to live support in three steps</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step) => (
              <div key={step.num} className="glass rounded-2xl p-5 border border-orange-200/45">
                <p className="text-[var(--brand)] text-xs font-semibold mb-2">{step.num}</p>
                <h4 className="text-[var(--text-main)] font-medium mb-2">{step.title}</h4>
                <p className="text-sm text-[var(--text-soft)]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}