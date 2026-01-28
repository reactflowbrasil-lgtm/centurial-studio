import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { STATUS_CONFIG, STATUS_WORKFLOW, OsStatus, PRIORITY_CONFIG } from '@/types/database';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, GripVertical, Loader2, AlertTriangle, Calendar, ArrowLeft, List } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function KanbanView() {
    const { orders, isLoading, updateStatus } = useServiceOrders();
    const navigate = useNavigate();
    const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const handleDragStart = (orderId: string) => {
        setDraggedOrder(orderId);
    };

    const handleDragEnd = () => {
        setDraggedOrder(null);
    };

    const handleDrop = async (status: OsStatus) => {
        if (draggedOrder) {
            const order = orders.find(o => o.id === draggedOrder);
            if (order && order.status !== status) {
                await updateStatus.mutateAsync({ id: draggedOrder, status });
            }
        }
        setDraggedOrder(null);
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-[calc(100vh-4rem)] lg:h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    // Filter out non-active statuses for Kanban
    const kanbanStatuses = STATUS_WORKFLOW.filter(s => s !== 'cancelado' && s !== 'concluido');

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] lg:h-screen flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-shrink-0 pb-4 sm:pb-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/orders')}
                                className="sm:hidden"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Kanban</h1>
                                <p className="text-sm text-muted-foreground mt-1 hidden sm:block">
                                    Arraste os cards para atualizar o status
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/orders')}
                            >
                                <List className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Lista</span>
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => navigate('/orders/new')}
                                className="flex-1 sm:flex-initial bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
                            >
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Nova OS</span>
                                <span className="sm:hidden">Nova</span>
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Column Indicators */}
                    <div className="flex gap-1.5 mt-4 sm:hidden justify-center overflow-x-auto py-1">
                        {STATUS_WORKFLOW.filter(s => s !== 'cancelado').map((status, idx) => (
                            <div
                                key={status}
                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === 0 ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/20'
                                    }`}
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Kanban Board - Horizontal scroll with snap on mobile */}
                <div className="flex-1 overflow-x-auto overflow-y-hidden -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory scroll-smooth">
                    <div className="flex gap-4 h-full min-w-max pb-4">
                        {kanbanStatuses.map((status, columnIndex) => {
                            const config = STATUS_CONFIG[status];
                            const columnOrders = orders.filter(o => o.status === status);

                            return (
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: columnIndex * 0.1 }}
                                    className="w-[calc(100vw-2rem)] sm:w-[300px] lg:w-[320px] flex-shrink-0 flex flex-col bg-muted/30 rounded-xl border border-border snap-center"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handleDrop(status)}
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card/50 rounded-t-xl">
                                        <div className="flex items-center gap-2">
                                            <StatusBadge status={status} size="sm" showDot={false} />
                                            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                                                {columnOrders.length}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cards Container */}
                                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
                                        {columnOrders.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                                                <p className="text-xs sm:text-sm">Nenhuma OS</p>
                                            </div>
                                        ) : (
                                            columnOrders.map((order, index) => (
                                                <motion.div
                                                    key={order.id}
                                                    layoutId={order.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    draggable
                                                    onDragStart={() => handleDragStart(order.id)}
                                                    onDragEnd={handleDragEnd}
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                    className={`
                            bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 border border-border cursor-pointer
                            hover:shadow-md hover:border-primary/30 transition-all
                            active:scale-[0.98] touch-manipulation
                            ${draggedOrder === order.id ? 'opacity-50 scale-95' : ''}
                            ${order.priority === 'urgente' ? 'border-l-4 border-l-destructive' : ''}
                          `}
                                                >
                                                    {/* Card Header */}
                                                    <div className="flex items-start justify-between gap-2 mb-2">
                                                        <div className="flex items-center gap-1.5">
                                                            <GripVertical className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/50 flex-shrink-0" />
                                                            <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0">
                                                                #{order.os_number}
                                                            </Badge>
                                                        </div>
                                                        {order.priority === 'urgente' && (
                                                            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-destructive animate-pulse flex-shrink-0" />
                                                        )}
                                                    </div>

                                                    {/* Card Title */}
                                                    <h4 className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 mb-2">
                                                        {order.title}
                                                    </h4>

                                                    {/* Client */}
                                                    {order.clients && (
                                                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate mb-2">
                                                            {order.clients.name}
                                                        </p>
                                                    )}

                                                    {/* Footer */}
                                                    <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-border/50">
                                                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground">
                                                            {order.estimated_delivery && (
                                                                <>
                                                                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                                                    <span className="truncate max-w-[80px]">
                                                                        {formatDistanceToNow(new Date(order.estimated_delivery), {
                                                                            locale: ptBR,
                                                                            addSuffix: true
                                                                        })}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs font-semibold text-primary">
                                                            {formatCurrency(Number(order.total_price))}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}

                        {/* Completed Column - Visual only */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: kanbanStatuses.length * 0.1 }}
                            className="w-[calc(100vw-2rem)] sm:w-[300px] lg:w-[320px] flex-shrink-0 flex flex-col bg-green-500/5 rounded-xl border border-green-500/20 snap-center"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop('concluido')}
                        >
                            <div className="flex items-center justify-between p-3 sm:p-4 border-b border-green-500/20 bg-green-500/10 rounded-t-xl">
                                <div className="flex items-center gap-2">
                                    <StatusBadge status="concluido" size="sm" showDot={false} />
                                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                                        {orders.filter(o => o.status === 'concluido').length}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 sm:space-y-3">
                                {orders.filter(o => o.status === 'concluido').slice(0, 5).map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.7 }}
                                        onClick={() => navigate(`/orders/${order.id}`)}
                                        className="bg-card/50 rounded-lg p-3 border border-border/50 cursor-pointer hover:opacity-100 transition-opacity"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1.5 py-0">
                                                #{order.os_number}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-foreground/70 line-clamp-1">{order.title}</p>
                                    </motion.div>
                                ))}
                                {orders.filter(o => o.status === 'concluido').length > 5 && (
                                    <p className="text-[10px] sm:text-xs text-center text-muted-foreground py-2">
                                        +{orders.filter(o => o.status === 'concluido').length - 5} mais
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
