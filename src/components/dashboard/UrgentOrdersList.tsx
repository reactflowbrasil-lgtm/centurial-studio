import { motion } from 'framer-motion';
import { ServiceOrder } from '@/types/database';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Clock, ArrowRight, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface UrgentOrdersListProps {
    orders: ServiceOrder[];
}

export function UrgentOrdersList({ orders }: UrgentOrdersListProps) {
    const navigate = useNavigate();

    const urgentOrders = orders
        .filter(o => o.priority === 'urgente' && o.status !== 'concluido' && o.status !== 'cancelado')
        .slice(0, 5);

    const highPriorityOrders = orders
        .filter(o => o.priority === 'alta' && o.status !== 'concluido' && o.status !== 'cancelado')
        .slice(0, 3);

    const allPriorityOrders = [...urgentOrders, ...highPriorityOrders];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-destructive/5 via-card to-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft border border-destructive/20 h-full"
        >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive animate-pulse" />
                    </div>
                    <h3 className="font-display font-semibold text-base sm:text-lg">Prioridades</h3>
                </div>
                {allPriorityOrders.length > 0 && (
                    <Badge variant="destructive" className="animate-pulse text-[10px] sm:text-xs">
                        {allPriorityOrders.length}
                    </Badge>
                )}
            </div>

            {allPriorityOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-muted-foreground">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 mb-2 sm:mb-3 opacity-30" />
                    </motion.div>
                    <p className="text-xs sm:text-sm font-medium">Nenhuma OS urgente</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">Tudo sob controle! 🎉</p>
                </div>
            ) : (
                <ScrollArea className="h-[180px] sm:h-[220px] -mx-2 px-2">
                    <div className="space-y-2 sm:space-y-3">
                        {allPriorityOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className={`
                  p-2.5 sm:p-3 rounded-lg sm:rounded-xl border cursor-pointer transition-all
                  hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                  ${order.priority === 'urgente'
                                        ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50'
                                        : 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50'}
                `}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                                            {order.priority === 'urgente' ? (
                                                <span className="text-destructive text-[10px] sm:text-xs font-bold uppercase tracking-wide flex items-center gap-0.5 sm:gap-1">
                                                    <Flame className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                    Urgente
                                                </span>
                                            ) : (
                                                <span className="text-orange-600 text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                                                    Alta
                                                </span>
                                            )}
                                            <Badge variant="outline" className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0">
                                                #{order.os_number}
                                            </Badge>
                                        </div>
                                        <p className="font-medium text-xs sm:text-sm text-foreground truncate">
                                            {order.title}
                                        </p>
                                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5 text-[10px] sm:text-xs text-muted-foreground">
                                            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            {order.estimated_delivery ? (
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(order.estimated_delivery), {
                                                        locale: ptBR,
                                                        addSuffix: true
                                                    })}
                                                </span>
                                            ) : (
                                                <span>Sem prazo</span>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-1 sm:mt-2" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {allPriorityOrders.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 sm:mt-3 text-xs sm:text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/orders')}
                >
                    Ver todas
                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1.5 sm:ml-2" />
                </Button>
            )}
        </motion.div>
    );
}
