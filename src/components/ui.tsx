import type { CSSProperties, ReactNode } from 'react';

export function Card({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

export function StatCard({
  icon,
  label,
  value,
  sub,
  accent = 'lime',
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: string;
  accent?: 'lime' | 'violet' | 'cyan';
}) {
  const ring = {
    lime: 'text-lime-300 bg-lime-400/10',
    violet: 'text-violet-400 bg-violet-500/10',
    cyan: 'text-cyan-400 bg-cyan-500/10',
  }[accent];
  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${ring}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-white/50">{label}</p>
        <p className="text-2xl font-display font-semibold text-white">{value}</p>
        {sub && <p className="text-xs text-white/40 mt-0.5">{sub}</p>}
      </div>
    </Card>
  );
}

export function ProgressBar({
  value,
  className = '',
  color = 'bg-lime-400',
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}>
      <div
        className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Badge({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`chip ${className}`}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-white/40">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-white/50 max-w-sm">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-white/50 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
