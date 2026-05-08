export default function TicketCard({ ticket }) {
  const statusConfig = {
    open: { label: 'Open', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
    'in-progress': { label: 'In Progress', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    resolved: { label: 'Resolved', class: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
    closed: { label: 'Closed', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
  };

  const priorityConfig = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-green-400',
  };

  const s = statusConfig[ticket.status] || statusConfig.open;

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="text-white font-medium text-sm leading-snug">{ticket.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-lg border whitespace-nowrap ${s.class}`}>
          {s.label}
        </span>
      </div>
      <p className="text-gray-500 text-xs mb-4 line-clamp-2">{ticket.description}</p>
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${priorityConfig[ticket.priority]}`}>
          {ticket.priority} priority
        </span>
        <span className="text-gray-600 text-xs">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}