import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ServiceOrder, PRODUCT_TYPE_CONFIG } from '@/types/database';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, User } from 'lucide-react';

interface OrderCardProps {
  order: ServiceOrder;
  index: number;
}

export function OrderCard({ order, index }: OrderCardProps) {
  const navigate = useNavigate();
  const productConfig = PRODUCT_TYPE_CONFIG[order.product_type];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate(`/orders/${order.id}`)}
      className="cursor-pointer"
    >
      <Card className="p-4 hover:shadow-elevated transition-all duration-300 border-border/60 hover:border-primary/30">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{productConfig.icon}</span>
              <h3 className="font-semibold text-foreground truncate">{order.title}</h3>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                OS #{order.os_number}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {order.clients && (
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {order.clients.name}
                </span>
              )}
              {order.estimated_delivery && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(order.estimated_delivery), { 
                    locale: ptBR, 
                    addSuffix: true 
                  })}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={order.status} />
              <PriorityBadge priority={order.priority} />
            </div>
          </div>

          <div className="text-right">
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(Number(order.total_price))}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.quantity}x {formatCurrency(Number(order.unit_price))}
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
