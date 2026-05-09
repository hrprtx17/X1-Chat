import { Zap, GitBranch, ExternalLink, Link as LinkIcon } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#howitworks' },
        { label: 'Testimonials', href: '#testimonials' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Security', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-200 dark:border-white/10 py-16 px-6 bg-white dark:bg-[#060608]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap size={16} className="text-white fill-white" />
              </div>
              <span className="font-black text-gray-900 dark:text-white text-lg tracking-tight">X1Chat</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 font-medium">
              AI-powered customer support platform for modern, fast-moving teams.
            </p>
            <div className="flex gap-3">
              {[GitBranch, ExternalLink, LinkIcon].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 border border-gray-200 dark:border-white/10 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-gray-900 dark:text-white text-sm font-bold mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm font-medium text-gray-500 hover:text-primary dark:hover:text-primary transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">© {year} X1Chat. All rights reserved.</p>
          <p className="text-gray-500 text-sm font-medium">Built with ❤️ for support teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}