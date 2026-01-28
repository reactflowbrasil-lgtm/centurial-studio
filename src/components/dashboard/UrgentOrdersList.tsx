import { motion } from 'framer-motion';
import { ServiceOrder, PRIORITY_CONFIG, PriorityLevel } from '@/types/database';
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
            className="bg-gradient-to-br from-destructive/5 via-card to-card rounded-2xl p-6 shadow-soft border border-destructive/20 h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                        <Flame className="h-4 w-4 text-destructive animate-pulse" />
                    </div>
                    <h3 className="font-display font-semibold text-lg">Prioridades</h3>
                </div>
                {allPriorityOrders.length > 0 && (
                    <Badge variant="destructive" className="animate-pulse">
                        {allPriorityOrders.length}
                    </Badge>
                )}
            </div>

            {allPriorityOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <AlertTriangle className="h-10 w-10 mb-3 opacity-30" />
                    </motion.div>
                    <p className="text-sm font-medium">Nenhuma OS urgente</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Tudo sob controle! 🎉</p>
                </div>
            ) : (
                <ScrollArea className="h-[220px] -mx-2 px-2">
                    <div className="space-y-3">
                        {allPriorityOrders.map((order, index) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/orders/${order.id}`)}
                                className={`
                  p-3 rounded-xl border cursor-pointer transition-all
                  hover:shadow-md hover:scale-[1.02]
                  ${order.priority === 'urgente'
                                        ? 'bg-destructive/5 border-destructive/30 hover:border-destructive/50'
                                        : 'bg-orange-500/5 border-orange-500/30 hover:border-orange-500/50'}
                `}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            {order.priority === 'urgente' ? (
                                                <span className="text-destructive text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                                                    <Flame className="h-3 w-3" />
                                                    Urgente
                                                </span>
                                            ) : (
                                                <span className="text-orange-600 text-xs font-bold uppercase tracking-wide">
                                                    Alta
                                                </span>
                                            )}
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                                #{order.os_number}
                                            </Badge>
                                        </div>
                                        <p className="font-medium text-sm text-foreground truncate">
                                            {order.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {order.estimated_delivery ? (
                                                <span>
                                                    Entrega {formatDistanceToNow(new Date(order.estimated_delivery), {
                                                        locale: ptBR,
                                                        addSuffix: true
                                                    })}
                                                </span>
                                            ) : (
                                                <span>Sem prazo definido</span>
                                            )}
                                        </div>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-2" />
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
                    className="w-full mt-3 text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/orders')}
                >
                    Ver todas as ordens
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            )}
        </motion.div>
    );
}
