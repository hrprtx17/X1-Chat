export default function TicketCard({ ticket }) {
  const statusConfig = {
    open: { label: 'Open', class: 'bg-emerald-300/10 text-emerald-200 border-emerald-200/20' },
    'in-progress': { label: 'In Progress', class: 'bg-cyan-300/10 text-cyan-200 border-cyan-200/20' },
    resolved: { label: 'Resolved', class: 'bg-slate-300/10 text-slate-200 border-slate-200/20' },
    closed: { label: 'Closed', class: 'bg-rose-300/10 text-rose-200 border-rose-200/20' },
  };

  const priorityConfig = {
    high: 'text-rose-300',
    medium: 'text-amber-300',
    low: 'text-emerald-300',
  };

  const s = statusConfig[ticket.status] || statusConfig.open;

  return (
    <div className="glass-card p-5 surface-hover">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-white font-medium text-sm leading-snug">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-lg border whitespace-nowrap ${s.class}`}>
          {s.label}
        </span>
      </div>
      <p className="text-slate-400 text-xs mb-4 line-clamp-2">{ticket.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${priorityConfig[ticket.priority]}`}>
          {ticket.priority} priority
        </span>
        <span className="text-slate-500 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}