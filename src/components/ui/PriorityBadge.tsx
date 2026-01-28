import { motion } from 'framer-motion';
import { PRIORITY_CONFIG, PriorityLevel } from '@/types/database';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
}

const PRIORITY_ICONS = {
  baixa: ArrowDown,
  normal: Minus,
  alta: ArrowUp,
  urgente: AlertCircle,
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = PRIORITY_ICONS[priority];
  
  return (
    <motion.span
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium',
        config.color
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </motion.span>
  );
}
