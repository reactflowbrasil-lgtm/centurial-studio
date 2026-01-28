import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { STATUS_CONFIG, PRODUCT_TYPE_CONFIG, STATUS_WORKFLOW, OsStatus, ServiceOrder } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Plus,
    Loader2,
    User,
    Calendar,
    DollarSign,
    GripVertical,
    AlertTriangle,
    LayoutGrid,
    List,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const KANBAN_STATUSES: OsStatus[] = ['orcamento', 'aprovado', 'arte', 'producao', 'acabamento', 'revisao', 'entrega'];

export default function KanbanViewPage() {
    const navigate = useNavigate();
    const { orders, isLoading, updateStatus } = useServiceOrders();
    const [draggedOrder, setDraggedOrder] = useState<string | null>(null);

    const handleDragStart = (orderId: string) => {
        setDraggedOrder(orderId);
    };

    const handleDragEnd = () => {
        setDraggedOrder(null);
    };

    const handleDrop = async (status: OsStatus) => {
        if (draggedOrder) {
            await updateStatus.mutateAsync({ id: draggedOrder, status });
            setDraggedOrder(null);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const getOrdersByStatus = (status: OsStatus) => {
        return orders.filter(o => o.status === status && o.status !== 'concluido' && o.status !== 'cancelado');
    };

    const getColumnColor = (status: OsStatus) => {
        const colors: Record<OsStatus, string> = {
            orcamento: 'from-yellow-500/20 to-yellow-600/5 border-yellow-500/30',
            aprovado: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
            arte: 'from-purple-500/20 to-purple-600/5 border-purple-500/30',
            producao: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
            acabamento: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
            revisao: 'from-orange-500/20 to-orange-600/5 border-orange-500/30',
            entrega: 'from-green-500/20 to-green-600/5 border-green-500/30',
            concluido: 'from-gray-500/20 to-gray-600/5 border-gray-500/30',
            cancelado: 'from-red-500/20 to-red-600/5 border-red-500/30',
        };
        return colors[status];
    };

    const getStatusDot = (status: OsStatus) => {
        const colors: Record<OsStatus, string> = {
            orcamento: 'bg-yellow-500',
            aprovado: 'bg-emerald-500',
            arte: 'bg-purple-500',
            producao: 'bg-blue-500',
            acabamento: 'bg-cyan-500',
            revisao: 'bg-orange-500',
            entrega: 'bg-green-500',
            concluido: 'bg-gray-500',
            cancelado: 'bg-red-500',
        };
        return colors[status];
    };

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-screen">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="h-[calc(100vh-2rem)] p-6 lg:p-8 flex flex-col">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
                >
                    <div>
                        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
                            <LayoutGrid className="h-8 w-8 text-primary" />
                            Kanban
                        </h1>
                        <p className="text-muted-foreground mt-1">Arraste as ordens entre as colunas para atualizar o status</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => navigate('/orders')}>
                            <List className="h-4 w-4 mr-2" />
                            Lista
                        </Button>
                        <Button
                            onClick={() => navigate('/orders/new')}
                            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nova OS
                        </Button>
                    </div>
                </motion.div>

                {/* Kanban Board */}
                <ScrollArea className="flex-1 -mx-6 px-6">
                    <div className="flex gap-4 pb-4 min-w-max">
                        {KANBAN_STATUSES.map((status, columnIndex) => {
                            const statusOrders = getOrdersByStatus(status);
                            const config = STATUS_CONFIG[status];

                            return (
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: columnIndex * 0.1 }}
                                    className={cn(
                                        'w-[300px] flex-shrink-0 rounded-2xl border bg-gradient-to-b p-4',
                                        getColumnColor(status),
                                        draggedOrder && 'transition-all'
                                    )}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.add('ring-2', 'ring-primary');
                                    }}
                                    onDragLeave={(e) => {
                                        e.currentTarget.classList.remove('ring-2', 'ring-primary');
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.classList.remove('ring-2', 'ring-primary');
                                        handleDrop(status);
                                    }}
                                >
                                    {/* Column Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className={cn('w-3 h-3 rounded-full', getStatusDot(status))} />
                                            <h3 className="font-semibold text-foreground">{config.label}</h3>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {statusOrders.length}
                                        </Badge>
                                    </div>

                                    {/* Column Cards */}
                                    <div className="space-y-3 min-h-[200px]">
                                        <AnimatePresence>
                                            {statusOrders.map((order, index) => (
                                                <KanbanCard
                                                    key={order.id}
                                                    order={order}
                                                    index={index}
                                                    onDragStart={() => handleDragStart(order.id)}
                                                    onDragEnd={handleDragEnd}
                                                    formatCurrency={formatCurrency}
                                                    onClick={() => navigate(`/orders/${order.id}`)}
                                                />
                                            ))}
                                        </AnimatePresence>

                                        {statusOrders.length === 0 && (
                                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                                                <p className="text-sm">Nenhuma OS</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </AppLayout>
    );
}

interface KanbanCardProps {
    order: ServiceOrder;
    index: number;
    onDragStart: () => void;
    onDragEnd: () => void;
    formatCurrency: (value: number) => string;
    onClick: () => void;
}

function KanbanCard({ order, index, onDragStart, onDragEnd, formatCurrency, onClick }: KanbanCardProps) {
    const productConfig = PRODUCT_TYPE_CONFIG[order.product_type];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onClick}
            className="group cursor-grab active:cursor-grabbing"
        >
            <Card className="p-3 hover:shadow-elevated transition-all duration-200 border-border/60 hover:border-primary/30 bg-card/90 backdrop-blur-sm">
                <div className="flex items-start gap-2">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm">{productConfig.icon}</span>
                            <p className="font-medium text-sm truncate">{order.title}</p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                #{order.os_number}
                            </Badge>
                            {order.priority === 'urgente' && (
                                <span className="flex items-center gap-1 text-destructive">
                                    <AlertTriangle className="h-3 w-3" />
                                    Urgente
                                </span>
                            )}
                        </div>

                        <div className="space-y-1 text-xs text-muted-foreground">
                            {order.clients && (
                                <div className="flex items-center gap-1.5">
                                    <User className="h-3 w-3" />
                                    <span className="truncate">{order.clients.name}</span>
                                </div>
                            )}
                            {order.estimated_delivery && (
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {formatDistanceToNow(new Date(order.estimated_delivery), { locale: ptBR, addSuffix: true })}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                            <span className="text-xs text-muted-foreground">
                                {order.quantity}x
                            </span>
                            <span className="font-semibold text-sm text-foreground">
                                {formatCurrency(Number(order.total_price))}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
