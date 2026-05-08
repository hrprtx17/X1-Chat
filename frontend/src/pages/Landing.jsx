import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, BarChart3, Zap, Shield, Clock, ArrowRight, Bot, Users } from 'lucide-react';
import LandingNav from '../components/LandingNav';
import Footer from '../components/Footer';
import CountUp from 'react-countup';

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

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="app-shell min-h-screen">
      <LandingNav />

      <section className="relative px-6 pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-400/20 rounded-full blur-[130px]" />
          <div className="absolute top-36 left-10 w-[350px] h-[350px] bg-cyan-300/15 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-cyan-100 mb-8 border border-cyan-100/20">
              <Zap size={14} />
              Premium AI Customer Operations Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Customer support,
              <span className="gradient-text block mt-1">engineered for scale.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
              X1Chat blends AI chat, intelligent ticketing, and operational analytics into one seamless support workspace for modern teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-base py-3 px-8 flex items-center gap-2 justify-center"
              >
                Launch Workspace
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="glass text-white text-base py-3 px-8 rounded-xl hover:border-indigo-200/30 transition-all flex items-center gap-2 justify-center"
              >
                Sign In
              </button>
            </div>

            <p className="text-slate-500 text-sm mt-4">No credit card required - ready in minutes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-14 glass-card p-5 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="glass rounded-xl p-4 border border-white/10">
                  <p className="text-3xl font-semibold text-white mb-1">
                    <CountUp end={s.value} duration={2.5} />
                    {s.suffix}
                  </p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-white mb-4">Built for modern support organizations</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">A cohesive toolkit for AI-first conversations, human escalation, and performance visibility.</p>
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
                  <div className="w-11 h-11 bg-indigo-300/10 border border-indigo-200/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-300/20 transition-all">
                    <Icon size={20} className="text-indigo-200" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="howitworks" className="px-6 pb-24">
        <div className="max-w-5xl mx-auto glass-card p-8 md:p-10">
          <h3 className="text-2xl font-semibold text-white mb-8">From setup to live support in three steps</h3>
          <div className="grid md:grid-cols-3 gap-5">
            {steps.map((step) => (
              <div key={step.num} className="glass rounded-2xl p-5 border border-white/10">
                <p className="text-cyan-200 text-xs font-semibold mb-2">{step.num}</p>
                <h4 className="text-white font-medium mb-2">{step.title}</h4>
                <p className="text-sm text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="px-6 pb-24">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">A support stack customers can feel</h3>
          <p className="text-slate-400 max-w-2xl mx-auto">Replace fragmented workflows with one elegant workspace for AI chat, human ops, and measurable performance.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}