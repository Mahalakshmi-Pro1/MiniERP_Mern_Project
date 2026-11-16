import { ArrowUpRight } from 'lucide-react';
export default function StatCard({label,value,caption,icon:Icon,tone='blue'}) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><div className={`stat-icon ${tone}`}><Icon size={20}/></div></div><div className="stat-value">{value}</div><div className="stat-caption"><span className="caption-dot"/> {caption}<ArrowUpRight size={14}/></div></article>;
}