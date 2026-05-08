import { Zap, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[#00D97E]/10 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-dark" />
              </div>
              <span className="font-bold text-white text-lg">X1Chat</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              AI-powered customer support platform for modern businesses.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Product</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#features" className="hover:text-primary transition">Features</a></li>
              <li><a href="#howitworks" className="hover:text-primary transition">How it works</a></li>
              <li><a href="#stats" className="hover:text-primary transition">Stats</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="hover:text-primary transition cursor-pointer">About</span></li>
              <li><span className="hover:text-primary transition cursor-pointer">Blog</span></li>
              <li><span className="hover:text-primary transition cursor-pointer">Careers</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4 text-sm">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition">
                <Github size={16} />
              </a>
              <a href="https://twitter.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition">
                <Twitter size={16} />
              </a>
              <a href="https://linkedin.com" className="w-9 h-9 glass rounded-lg flex items-center justify-center text-gray-400 hover:text-primary transition">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#00D97E]/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">© 2025 X1Chat. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-600">
            <span className="hover:text-gray-400 cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer transition">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}