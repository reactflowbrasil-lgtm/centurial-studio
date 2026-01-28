import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG, OsStatus } from '@/types/database';

interface StatusBadgeProps {
  status: OsStatus;
  className?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

const STATUS_COLORS: Record<OsStatus, { bg: string; text: string; border: string; dot: string }> = {
  orcamento: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-800 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
  },
  aprovado: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  arte: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-800 dark:text-purple-300',
    border: 'border-purple-200 dark:border-purple-800',
    dot: 'bg-purple-500',
  },
  producao: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-800 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  acabamento: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-800 dark:text-cyan-300',
    border: 'border-cyan-200 dark:border-cyan-800',
    dot: 'bg-cyan-500',
  },
  revisao: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-800 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
  },
  entrega: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-800 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
  },
  concluido: {
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    text: 'text-gray-800 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-700',
    dot: 'bg-gray-500',
  },
  cancelado: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-800 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
};

export function StatusBadge({ status, className, size = 'md', showDot = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const colors = STATUS_COLORS[status];

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-all',
        colors.bg,
        colors.text,
        colors.border,
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', colors.dot)} />
      )}
      {config.label}
    </motion.span>
  );
}
