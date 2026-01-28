import { motion } from 'framer-motion';
import { STATUS_CONFIG, STATUS_WORKFLOW, OsStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface StatusPipelineProps {
  byStatus: Record<string, number>;
}

export function StatusPipeline({ byStatus }: StatusPipelineProps) {
  const totalOrders = Object.values(byStatus).reduce((sum, count) => sum + count, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl p-6 shadow-soft border border-border"
    >
      <h3 className="font-display font-semibold text-lg mb-6">Pipeline de Produção</h3>
      
      <div className="relative">
        {/* Pipeline line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
        
        {/* Status nodes */}
        <div className="relative flex justify-between">
          {STATUS_WORKFLOW.slice(0, -1).map((status, index) => {
            const config = STATUS_CONFIG[status];
            const count = byStatus[status] || 0;
            const hasOrders = count > 0;
            
            return (
              <motion.div
                key={status}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all',
                    hasOrders 
                      ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                      : 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {count}
                </div>
                <span className={cn(
                  'text-[10px] mt-2 text-center max-w-[60px] leading-tight',
                  hasOrders ? 'text-foreground font-medium' : 'text-muted-foreground'
                )}>
                  {config.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total em produção
        </span>
        <span className="font-display font-bold text-2xl text-foreground">
          {totalOrders} OS
        </span>
      </div>
    </motion.div>
  );
}
