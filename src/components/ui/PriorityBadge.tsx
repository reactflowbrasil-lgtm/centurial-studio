import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PRIORITY_CONFIG, PriorityLevel } from '@/types/database';
import { AlertTriangle, ArrowUp, Minus, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

const PRIORITY_STYLES: Record<PriorityLevel, {
  bg: string;
  text: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  baixa: {
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-700',
    icon: ArrowDown,
  },
  normal: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Minus,
  },
  alta: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
    icon: ArrowUp,
  },
  urgente: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertTriangle,
  },
};

export function PriorityBadge({ priority, className, showIcon = true, size = 'md' }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const styles = PRIORITY_STYLES[priority];
  const Icon = styles.icon;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full border transition-all',
        styles.bg,
        styles.text,
        styles.border,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        priority === 'urgente' && 'animate-pulse',
        className
      )}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
      {config.label}
    </motion.span>
  );
}
