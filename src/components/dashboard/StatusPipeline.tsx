import { motion } from 'framer-motion';
import { STATUS_WORKFLOW, STATUS_CONFIG } from '@/types/database';
import { ChevronRight } from 'lucide-react';

interface StatusPipelineProps {
  byStatus: Record<string, number>;
}

export function StatusPipeline({ byStatus }: StatusPipelineProps) {
  const totalOrders = Object.values(byStatus).reduce((sum, count) => sum + count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="font-display font-semibold text-base sm:text-lg">Pipeline de Produção</h3>
        <span className="text-xs sm:text-sm text-muted-foreground">{totalOrders} ordens no fluxo</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
        {STATUS_WORKFLOW.filter(s => s !== 'cancelado').map((status, index) => {
          const config = STATUS_CONFIG[status];
          const count = byStatus[status] || 0;
          const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;

          return (
            <motion.div
              key={status}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center"
            >
              <div
                className={`
                  flex flex-col items-center px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl min-w-[60px] sm:min-w-[80px] transition-all
                  ${count > 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}
                `}
              >
                <span className="text-lg sm:text-2xl font-display font-bold text-foreground">{count}</span>
                <span className="text-[9px] sm:text-[10px] text-muted-foreground text-center whitespace-nowrap mt-0.5">
                  {config.label}
                </span>
                {count > 0 && (
                  <div className="w-full h-1 bg-muted rounded-full mt-1.5 sm:mt-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                )}
              </div>
              {index < STATUS_WORKFLOW.length - 2 && (
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/50 flex-shrink-0 mx-0.5" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
