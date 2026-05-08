export default function StatCard({ label, value, suffix = '', icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'text-orange-600 dark:text-orange-200 bg-orange-400/15 border-orange-300/30 dark:bg-orange-500/15 dark:border-orange-400/30',
    blue: 'text-blue-600 dark:text-cyan-200 bg-blue-400/15 border-blue-300/30 dark:bg-cyan-500/15 dark:border-cyan-400/30',
    purple: 'text-purple-600 dark:text-violet-200 bg-purple-400/15 border-purple-300/30 dark:bg-violet-500/15 dark:border-violet-400/30',
    red: 'text-red-600 dark:text-rose-200 bg-red-400/15 border-red-300/30 dark:bg-rose-500/15 dark:border-rose-400/30',
  };

  return (
    <div className="glass-card p-5 surface-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[var(--text-soft)] text-sm">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-[var(--text-main)]">
        {typeof value === 'number' ? value : 0}
        {suffix}
      </div>
    </div>
  );
}