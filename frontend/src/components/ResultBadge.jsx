import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function ResultBadge({ result, size = 'sm' }) {
  const map = {
    POSITIVE: { cls: 'badge-positive', icon: XCircle, label: 'POSITIVE' },
    NEGATIVE: { cls: 'badge-negative', icon: CheckCircle, label: 'NEGATIVE' },
    INCONCLUSIVE: { cls: 'badge-inconclusive', icon: AlertTriangle, label: 'INCONCLUSIVE' },
  };

  const cfg = map[result] || map.INCONCLUSIVE;
  const Icon = cfg.icon;
  const iconSize = size === 'lg' ? 16 : 12;

  return (
    <span className={cfg.cls} style={size === 'lg' ? { padding: '6px 16px', fontSize: 13 } : {}}>
      <Icon size={iconSize} />
      {cfg.label}
    </span>
  );
}
