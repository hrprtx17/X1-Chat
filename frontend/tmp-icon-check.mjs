import * as icons from 'lucide-react';
const want = ['BarChart3','ArrowRight','Bot','Shield','Clock','TrendingUp'];
console.log(want.map(n => [n, n in icons, typeof icons[n], icons[n] ? (icons[n].$$typeof ? 'forwardRef' : 'unknown') : 'none']));
