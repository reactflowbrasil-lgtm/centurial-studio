import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { STATUS_CONFIG, PRODUCT_TYPE_CONFIG, STATUS_WORKFLOW, OsStatus } from '@/types/database';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    ArrowLeft,
    Calendar,
    User,
    DollarSign,
    Package,
    FileText,
    MoreVertical,
    Edit,
    Trash2,
    CheckCircle,
    AlertTriangle,
    Loader2,
    History,
    ArrowRightCircle,
    Check,
    Palette,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders, isLoading, updateStatus, deleteOrder, updateChecklist } = useServiceOrders();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const order = orders.find(o => o.id === id);

    const PRODUCTION_STAGES = [
        'Arte Iniciada',
        'Arte Aprovada pelo Designer',
        'Arquivos de Impressão Prontos',
        'Conferência de Medidas',
        'Enviado para Produção'
    ];

    const handleStatusChange = async (newStatus: OsStatus) => {
        if (!order) return;
        setIsUpdatingStatus(true);
        try {
            await updateStatus.mutateAsync({ id: order.id, status: newStatus });
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const toggleStep = async (step: string) => {
        if (!order) return;
        const currentChecklist = order.production_checklist || [];
        const newChecklist = currentChecklist.includes(step)
            ? currentChecklist.filter(s => s !== step)
            : [...currentChecklist, step];

        await updateChecklist.mutateAsync({ id: order.id, checklist: newChecklist });
    };

    const handleDelete = async () => {
        if (!order) return;
        setIsDeleting(true);
        try {
            await deleteOrder.mutateAsync(order.id);
            navigate('/orders');
        } finally {
            setIsDeleting(false);
        }
    };

    const getNextStatus = (currentStatus: OsStatus): OsStatus | null => {
        const currentIndex = STATUS_WORKFLOW.indexOf(currentStatus);
        if (currentIndex < STATUS_WORKFLOW.length - 1 && currentStatus !== 'cancelado') {
            return STATUS_WORKFLOW[currentIndex + 1];
        }
        return null;
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
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

    if (!order) {
        return (
            <AppLayout>
                <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] lg:h-screen gap-4 p-4">
                    <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30" />
                    <p className="text-muted-foreground text-base sm:text-lg text-center">Ordem de serviço não encontrada</p>
                    <Button onClick={() => navigate('/orders')}>Voltar para Ordens</Button>
                </div>
            </AppLayout>
        );
    }

    const productConfig = PRODUCT_TYPE_CONFIG[order.product_type];
    const nextStatus = getNextStatus(order.status);

    return (
        <AppLayout>
            <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    {/* Top bar with back button and actions */}
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className="flex items-center gap-2">
                            {nextStatus && order.status !== 'concluido' && (
                                <Button
                                    size="sm"
                                    onClick={() => handleStatusChange(nextStatus)}
                                    disabled={isUpdatingStatus}
                                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow hidden sm:flex"
                                >
                                    {isUpdatingStatus ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <ArrowRightCircle className="h-4 w-4 mr-2" />
                                    )}
                                    Avançar
                                </Button>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    {nextStatus && order.status !== 'concluido' && (
                                        <>
                                            <DropdownMenuItem
                                                onClick={() => handleStatusChange(nextStatus)}
                                                className="sm:hidden"
                                            >
                                                <ArrowRightCircle className="h-4 w-4 mr-2" />
                                                Avançar Status
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="sm:hidden" />
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={() => navigate(`/orders/${order.id}/edit`)}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Editar OS
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {order.status !== 'concluido' && (
                                        <DropdownMenuItem onClick={() => handleStatusChange('concluido')}>
                                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                            Marcar como Concluído
                                        </DropdownMenuItem>
                                    )}
                                    {order.status !== 'cancelado' && (
                                        <DropdownMenuItem
                                            onClick={() => handleStatusChange('cancelado')}
                                            className="text-orange-600"
                                        >
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Cancelar OS
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => setDeleteDialogOpen(true)}
                                        className="text-destructive focus:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Excluir OS
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Title and meta */}
                    <div>
                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                            <span className="text-xl sm:text-3xl shrink-0">{productConfig.icon}</span>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-lg sm:text-2xl lg:text-3xl font-display font-bold text-foreground line-clamp-2 leading-tight">
                                    {order.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-2 text-[10px] sm:text-sm text-muted-foreground">
                                    <Badge variant="secondary" className="text-[9px] sm:text-xs h-5">
                                        OS #{order.os_number}
                                    </Badge>
                                    <span className="hidden xs:inline">•</span>
                                    <span>
                                        {formatDistanceToNow(new Date(order.created_at), { locale: ptBR, addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status and Priority badges */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <StatusBadge status={order.status} />
                        <PriorityBadge priority={order.priority} />
                        {order.priority === 'urgente' && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs sm:text-sm font-medium animate-pulse">
                                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
                                Atenção imediata
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Main Content Grid - Stack on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Left Column - Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-4 sm:space-y-6"
                    >
                        {/* Description */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Descrição
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                                    {order.description || 'Nenhuma descrição fornecida.'}
                                </p>
                                {order.notes && (
                                    <div className="mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg">
                                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Observações</p>
                                        <p className="text-sm text-foreground">{order.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Status Timeline/Workflow - Scrollable on mobile */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <History className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Fluxo de Produção
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ScrollArea className="-mx-4 px-4 sm:mx-0 sm:px-0">
                                    <div className="relative min-w-[500px] sm:min-w-0 py-2">
                                        {/* Progress Line */}
                                        <div className="absolute top-7 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                                initial={{ width: '0%' }}
                                                animate={{
                                                    width: `${Math.min(((STATUS_WORKFLOW.indexOf(order.status) + 1) / STATUS_WORKFLOW.length) * 100, 100)}%`
                                                }}
                                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                            />
                                        </div>

                                        {/* Status Nodes */}
                                        <div className="relative flex justify-between">
                                            {STATUS_WORKFLOW.map((status, index) => {
                                                const config = STATUS_CONFIG[status];
                                                const currentIndex = STATUS_WORKFLOW.indexOf(order.status);
                                                const isCompleted = index < currentIndex;
                                                const isCurrent = status === order.status;

                                                return (
                                                    <motion.div
                                                        key={status}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: index * 0.08 }}
                                                        className="flex flex-col items-center"
                                                    >
                                                        <button
                                                            onClick={() => handleStatusChange(status)}
                                                            disabled={isUpdatingStatus || order.status === 'concluido' || order.status === 'cancelado'}
                                                            className={`
                                w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold 
                                border-2 transition-all cursor-pointer disabled:cursor-not-allowed
                                ${isCurrent
                                                                    ? 'bg-accent text-accent-foreground border-accent shadow-glow scale-110'
                                                                    : isCompleted
                                                                        ? 'bg-primary text-primary-foreground border-primary shadow-md'
                                                                        : 'bg-muted text-muted-foreground border-border hover:border-primary/50'}
                              `}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            ) : (
                                                                index + 1
                                                            )}
                                                        </button>
                                                        <span className={`
                              text-[9px] sm:text-[10px] mt-2 text-center max-w-[45px] sm:max-w-[50px] leading-tight
                              ${isCurrent ? 'text-accent font-bold' : isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'}
                            `}>
                                                            {config.label}
                                                        </span>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <ScrollBar orientation="horizontal" className="sm:hidden" />
                                </ScrollArea>
                            </CardContent>
                        </Card>

                        {/* Production Checklist */}
                        <Card>
                            <CardHeader className="pb-3 border-b border-border bg-muted/20">
                                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                    Checklist de Produção
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {PRODUCTION_STAGES.map((step) => {
                                        const isChecked = order.production_checklist?.includes(step);
                                        return (
                                            <div
                                                key={step}
                                                onClick={() => toggleStep(step)}
                                                className={`
                                                    flex items-center justify-between p-4 cursor-pointer transition-colors
                                                    hover:bg-muted/50 active:bg-muted
                                                    ${isChecked ? 'bg-green-500/5' : ''}
                                                `}
                                            >
                                                <span className={`text-sm sm:text-base font-medium ${isChecked ? 'text-green-700 line-through opacity-60' : 'text-foreground'}`}>
                                                    {step}
                                                </span>
                                                <div className={`
                                                    w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                                    ${isChecked ? 'bg-green-500 border-green-500 shadow-glow' : 'border-muted-foreground/30'}
                                                `}>
                                                    {isChecked && <Check className="h-4 w-4 text-white" />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column - Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4"
                    >
                        {/* Designer Info */}
                        <Card className="border-accent/20 bg-accent/5">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-accent" />
                                    Designer Responsável
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                        {order.designer_name ? order.designer_name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm sm:text-base text-foreground">
                                            {order.designer_name || 'Não atribuído'}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-muted-foreground">Responsável pela arte e conferência</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Client Info */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                    <User className="h-4 w-4 text-primary" />
                                    Cliente
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {order.clients ? (
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm sm:text-base text-foreground">{order.clients.name}</p>
                                        {order.clients.email && (
                                            <p className="text-xs sm:text-sm text-muted-foreground truncate">{order.clients.email}</p>
                                        )}
                                        {order.clients.phone && (
                                            <p className="text-xs sm:text-sm text-muted-foreground">{order.clients.phone}</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs sm:text-sm text-muted-foreground">Cliente não especificado</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Product Info */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                    <Package className="h-4 w-4 text-primary" />
                                    Produto
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg sm:text-xl">{productConfig.icon}</span>
                                    <span className="font-medium text-sm sm:text-base">{productConfig.label}</span>
                                </div>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                                    Quantidade: <span className="font-medium text-foreground">{order.quantity}</span>
                                </p>
                            </CardContent>
                        </Card>

                        {/* Pricing */}
                        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Valores
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Valor Unitário</span>
                                    <span className="font-medium">{formatCurrency(Number(order.unit_price))}</span>
                                </div>
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Quantidade</span>
                                    <span className="font-medium">x{order.quantity}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Total</span>
                                    <span className="text-lg sm:text-2xl font-bold text-gradient">{formatCurrency(Number(order.total_price))}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dates */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" />
                                    Datas
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-xs sm:text-sm">
                                    <span className="text-muted-foreground">Criação</span>
                                    <span className="font-medium">
                                        {format(new Date(order.created_at), "dd/MM/yy", { locale: ptBR })}
                                    </span>
                                </div>
                                {order.estimated_delivery && (
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Previsão</span>
                                        <span className="font-medium">
                                            {format(new Date(order.estimated_delivery), 'dd/MM/yy', { locale: ptBR })}
                                        </span>
                                    </div>
                                )}
                                {order.actual_delivery && (
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-muted-foreground">Entregue</span>
                                        <span className="font-medium text-green-600">
                                            {format(new Date(order.actual_delivery), 'dd/MM/yy', { locale: ptBR })}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent className="max-w-[90vw] sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                Excluir Ordem de Serviço
                            </DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir a OS #{order.os_number}? Esta ação não pode ser desfeita.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="flex-col sm:flex-row gap-2">
                            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="w-full sm:w-auto">
                                Cancelar
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full sm:w-auto"
                            >
                                {isDeleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                Excluir
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
