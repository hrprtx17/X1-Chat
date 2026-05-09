import LandingNav from '../components/LandingNav';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Zap, 
  Shield, 
  BarChart3, 
  Users,
  Globe
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-white">
      <LandingNav />

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-700 mb-6">
                  ✨ Now with AI-Powered Auto-Resolution
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                  One inbox. <br />
                  <span className="text-primary">Infinite leverage.</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
                  X1Chat learns from every conversation, helping your team resolve issues 10x faster with AI-powered insights and automation.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/register" className="btn-primary py-4 px-8 text-lg shadow-lg shadow-primary-500/20 w-full sm:w-auto">
                    Start for Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <button className="btn-secondary py-4 px-8 text-lg w-full sm:w-auto">
                    View Demo
                  </button>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    No credit card required
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    14-day free trial
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-6 mt-16 lg:mt-0 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative z-10"
              >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="mx-auto bg-white px-3 py-1 rounded border border-gray-200 text-[10px] text-gray-400 font-medium">
                      x1chat.app/dashboard
                    </div>
                  </div>
                  <div className="p-4 bg-white aspect-[4/3] flex flex-col gap-4">
                    <div className="h-8 w-1/3 bg-gray-100 rounded-md animate-pulse" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-24 bg-primary-50 rounded-lg border border-primary-100" />
                      <div className="h-24 bg-gray-50 rounded-lg border border-gray-100" />
                      <div className="h-24 bg-gray-50 rounded-lg border border-gray-100" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 p-4">
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-4" />
                      <div className="space-y-3">
                        <div className="h-3 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-full bg-gray-100 rounded" />
                        <div className="h-3 w-3/4 bg-gray-100 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-[200px] animate-bounce-slow">
                   <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                        <Zap size={16} />
                      </div>
                      <p className="text-xs font-bold text-gray-900">AI Resolved</p>
                   </div>
                   <p className="text-[10px] text-gray-500">Resolved a ticket for customer "Sarah J."</p>
                </div>
              </motion.div>
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-200/30 blur-[120px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-primary uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight">Everything you need to scale support.</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Built by support leaders, for support teams. Powerful enough for enterprise, simple enough for startups.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { title: 'Unified Inbox', desc: 'All your customer messages from email, chat, and social in one place.', icon: MessageSquare },
              { title: 'AI Assistant', desc: 'Smart auto-replies and ticket summarization to keep your team focused.', icon: Zap },
              { title: 'Live Insights', desc: 'Real-time dashboards showing your volume, satisfaction, and AI impact.', icon: BarChart3 },
              { title: 'Team Collaboration', desc: 'Private notes, mentions, and shared views for seamless teamwork.', icon: Users },
              { title: 'Secure & Private', desc: 'Enterprise-grade security with SOC2 compliance and data encryption.', icon: Shield },
              { title: 'Global Ready', desc: 'Multi-language support and time-zone management for global teams.', icon: Globe }
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-white">
            <div>
              <p className="text-5xl font-extrabold mb-2">10M+</p>
              <p className="text-primary-100 opacity-80">Tickets Managed</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold mb-2">40%</p>
              <p className="text-primary-100 opacity-80">AI Resolution Rate</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold mb-2">24/7</p>
              <p className="text-primary-100 opacity-80">Active Support</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold mb-2">1,000+</p>
              <p className="text-primary-100 opacity-80">Happy Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900 rounded-3xl p-12 lg:p-20 text-center relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold text-white mb-6">Ready to transform your support?</h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Join the future of customer support. Start your 14-day free trial today.
              </p>
              <Link to="/register" className="btn-primary py-4 px-10 text-lg">
                Get Started Now
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}