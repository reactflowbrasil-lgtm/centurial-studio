import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'primary' | 'accent';
}

export function StatsCard({ title, value, icon: Icon, description, trend, variant = 'default' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-card rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-soft border transition-all hover:shadow-md',
        variant === 'primary' && 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20',
        variant === 'accent' && 'bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20',
        variant === 'default' && 'border-border'
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
            {title}
          </p>
          <p className={cn(
            'font-display font-bold mt-1 truncate',
            typeof value === 'string' && value.length > 10
              ? 'text-lg sm:text-2xl'
              : 'text-xl sm:text-3xl'
          )}>
            {value}
          </p>
          {description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 line-clamp-1">{description}</p>
          )}
        </div>
        <div className={cn(
          'w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0',
          variant === 'primary' && 'bg-primary/20 text-primary',
          variant === 'accent' && 'bg-accent/20 text-accent',
          variant === 'default' && 'bg-muted text-muted-foreground'
        )}>
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
      </div>

      {trend && (
        <div className={cn(
          'flex items-center gap-1 mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium',
          trend.positive ? 'text-green-600' : 'text-red-500'
        )}>
          {trend.positive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>+{trend.value} este mês</span>
        </div>
      )}
    </motion.div>
  );
}
