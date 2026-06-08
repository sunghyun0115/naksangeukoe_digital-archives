import { CollectionStatus } from '../types';
import { cn } from '../lib/utils';
import { CheckCircle2, AlertCircle, HelpCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: CollectionStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    '확인됨': { icon: CheckCircle2, color: 'text-stone-900 bg-stone-100 border-stone-300' },
    '확인 필요': { icon: AlertCircle, color: 'text-stone-600 bg-stone-50 border-stone-200' },
    '미수집': { icon: HelpCircle, color: 'text-stone-400 bg-stone-50 border-stone-200' },
    '수집 불가': { icon: XCircle, color: 'text-stone-500 bg-stone-100 border-stone-200' },
  };

  const { icon: Icon, color } = config[status];

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
      color,
      className
    )}>
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}
