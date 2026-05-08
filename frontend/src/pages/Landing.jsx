import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Ticket, BarChart3, Zap, Shield, Clock, ArrowRight, Bot, Users, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-dark">
      <LandingNav />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-primary mb-8 border border-primary/20">
              <Zap size={14} />
              Powered by Groq LLaMA AI
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Customer Support
              <br />
              <span className="gradient-text">Reimagined with AI</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              X1Chat gives your business a 24/7 AI support assistant that resolves queries instantly,
              manages tickets smartly, and provides real-time analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary text-base py-3 px-8 flex items-center gap-2 justify-center"
              >
                Start for Free
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="glass text-white text-base py-3 px-8 rounded-xl hover:border-primary/30 transition-all flex items-center gap-2 justify-center"
              >
                Sign In
              </button>
            </div>

            <p className="text-gray-600 text-sm mt-4">No credit card required • Free to use</p>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need</h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">Built for businesses that want intelligent, scalable customer support</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-11 h-11 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="howitworks" className="py-24 px-6 border-t border-[#00D97E]/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400 text-lg">Get started in minutes, not weeks</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 glass border border-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-sm">
                  <span className="text-primary font-bold text-lg">{s.num}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-24 px-6 border-t border-[#00D97E]/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Built for results</h2>
            <p className="text-gray-400 text-lg">Real impact for real businesses</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center"
              >
                <div className="text-4xl font-bold gradient-text mb-2">
                  <CountUp end={s.value} duration={2} suffix={s.suffix} />
                </div>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-[#00D97E]/5">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 glow"
          >
            <Zap size={40} className="text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8">Join businesses using X1Chat to deliver better customer support with AI</p>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary text-base py-3 px-10 flex items-center gap-2 mx-auto"
            >
              Start for Free <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}