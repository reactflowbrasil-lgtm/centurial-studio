import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ServiceOrder, STATUS_CONFIG, PRIORITY_CONFIG, PRODUCT_TYPE_CONFIG } from '@/types/database';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Badge } from '@/components/ui/badge';
import { Calendar, Package, ChevronRight, DollarSign } from 'lucide-react';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: ServiceOrder;
  index?: number;
}

export function OrderCard({ order, index = 0 }: OrderCardProps) {
  const navigate = useNavigate();
  const productConfig = PRODUCT_TYPE_CONFIG[order.product_type];
  const isOverdue = order.estimated_delivery && isPast(new Date(order.estimated_delivery)) &&
    order.status !== 'concluido' && order.status !== 'cancelado';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className={`
        bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 border cursor-pointer transition-all
        hover:shadow-md hover:border-primary/30 active:scale-[0.99]
        ${order.priority === 'urgente' ? 'border-l-4 border-l-destructive border-border' : 'border-border'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Product Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-lg sm:text-xl">{productConfig.icon}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-1">
                {order.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  #{order.os_number}
                </Badge>
                {order.clients && (
                  <span className="text-[11px] sm:text-xs text-muted-foreground truncate max-w-[120px] sm:max-w-[180px]">
                    {order.clients.name}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Badges and Info */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2">
            <StatusBadge status={order.status} size="sm" />
            {order.priority !== 'normal' && (
              <PriorityBadge priority={order.priority} size="sm" showIcon={false} />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 mt-2 sm:mt-3 pt-2 border-t border-border/50">
            {/* Delivery Date */}
            <div className={`flex items-center gap-1 text-[10px] sm:text-xs ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
              {order.estimated_delivery ? (
                <>
                  <Calendar className="h-3 w-3" />
                  <span className="hidden xs:inline">
                    {format(new Date(order.estimated_delivery), "dd/MM", { locale: ptBR })}
                  </span>
                  <span className="xs:hidden">
                    {formatDistanceToNow(new Date(order.estimated_delivery), { locale: ptBR, addSuffix: true })}
                  </span>
                  {isOverdue && <span className="text-destructive font-medium">(Atrasado)</span>}
                </>
              ) : (
                <span className="text-muted-foreground/70">Sem previsão</span>
              )}
            </div>

            {/* Price */}
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-primary hidden sm:block" />
              <span className="text-xs sm:text-sm font-semibold text-gradient">
                {formatCurrency(Number(order.total_price))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
