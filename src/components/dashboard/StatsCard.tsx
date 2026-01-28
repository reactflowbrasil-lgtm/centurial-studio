import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

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

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  variant = 'default' 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 shadow-soft transition-shadow hover:shadow-elevated',
        variant === 'default' && 'bg-card border border-border',
        variant === 'primary' && 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground',
        variant === 'accent' && 'bg-gradient-to-br from-accent to-accent/80 text-accent-foreground'
      )}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
      
      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            variant === 'default' ? 'text-muted-foreground' : 'text-current/80'
          )}>
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-display font-bold tracking-tight">{value}</h3>
            {trend && (
              <span className={cn(
                'text-xs font-medium px-1.5 py-0.5 rounded-full',
                trend.positive ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600'
              )}>
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className={cn(
              'text-xs',
              variant === 'default' ? 'text-muted-foreground' : 'text-current/70'
            )}>
              {description}
            </p>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3',
          variant === 'default' ? 'bg-primary/10' : 'bg-white/20'
        )}>
          <Icon className={cn(
            'h-6 w-6',
            variant === 'default' ? 'text-primary' : 'text-current'
          )} />
        </div>
      </div>
    </motion.div>
  );
}
