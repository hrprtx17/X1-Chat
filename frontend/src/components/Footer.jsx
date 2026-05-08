import { Zap, GitBranch, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-orange-200/40 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center">
                <Zap size={16} className="text-amber-950" />
              </div>
              <span className="font-semibold text-[var(--text-main)] text-lg tracking-tight">X1Chat</span>
            </div>
            <p className="text-[var(--text-soft)] text-sm leading-relaxed">
              AI-powered customer support platform for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-[var(--text-main)] font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-[var(--text-soft)]">
              <li><a href="#testimonials" className="hover:text-[var(--text-main)] transition">Testimonials</a></li>
              <li><a href="#features" className="hover:text-[var(--text-main)] transition">Features</a></li>
              <li><a href="#assistant" className="hover:text-[var(--text-main)] transition">Assistant</a></li>
              <li><a href="#howitworks" className="hover:text-[var(--text-main)] transition">How it works</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--text-main)] font-medium mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-[var(--text-soft)]">
              <li><span className="hover:text-[var(--text-main)] transition cursor-pointer">About</span></li>
              <li><span className="hover:text-[var(--text-main)] transition cursor-pointer">Blog</span></li>
              <li><span className="hover:text-[var(--text-main)] transition cursor-pointer">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[var(--text-main)] font-medium mb-4 text-sm">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:text-[var(--text-main)] transition">
                <GitBranch size={16} />
              </a>
              <a href="https://twitter.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:text-[var(--text-main)] transition">
                <ExternalLink size={16} />
              </a>
              <a href="https://linkedin.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-[var(--text-soft)] hover:text-[var(--text-main)] transition">
                <LinkIcon size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-orange-200/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-soft)] text-sm">© 2026 X1Chat. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-[var(--text-soft)]">
            <span className="hover:text-[var(--text-main)] cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-[var(--text-main)] cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}