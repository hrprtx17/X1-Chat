export default function TicketCard({ ticket }) {
  const statusConfig = {
    open: { label: 'Open', class: 'bg-orange-200/35 text-[var(--text-main)] border-orange-300/40' },
    'in-progress': { label: 'In Progress', class: 'bg-amber-200/30 text-[var(--text-main)] border-amber-300/35' },
    resolved: { label: 'Resolved', class: 'bg-black/5 text-[var(--text-main)] border-black/10' },
    closed: { label: 'Closed', class: 'bg-rose-200/30 text-[var(--text-main)] border-rose-300/35' },
  };

  const priorityConfig = {
    high: 'text-rose-600',
    medium: 'text-orange-700',
    low: 'text-emerald-700',
  };

  const s = statusConfig[ticket.status] || statusConfig.open;

  return (
    <div className="glass-card p-5 surface-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-[var(--text-main)] font-medium text-sm leading-snug">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-lg border whitespace-nowrap ${s.class}`}>
          {s.label}
        </span>
      </div>
      <p className="text-[var(--text-soft)] text-xs mb-4 line-clamp-2">{ticket.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${priorityConfig[ticket.priority]}`}>
          {ticket.priority} priority
        </span>
        <span className="text-[var(--text-soft)] text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}