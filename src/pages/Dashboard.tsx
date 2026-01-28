import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusPipeline } from '@/components/dashboard/StatusPipeline';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { ProductTypeChart } from '@/components/dashboard/ProductTypeChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { UrgentOrdersList } from '@/components/dashboard/UrgentOrdersList';
import { OrderCard } from '@/components/orders/OrderCard';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { FileText, Clock, AlertTriangle, DollarSign, Loader2, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { orders, isLoading, stats } = useServiceOrders();
  const navigate = useNavigate();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Calculate some additional metrics
  const thisMonthOrders = orders.filter(o => {
    const orderDate = new Date(o.created_at);
    const now = new Date();
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  });

  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum, o) => sum + Number(o.total_price), 0) / orders.length
    : 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] lg:h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Carregando dashboard...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const recentOrders = orders.slice(0, 5);

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Dashboard
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Bem-vindo ao Sistema de Gestão de Produção Gráfica
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/kanban')}
                className="flex-1 sm:flex-initial"
              >
                <LayoutGrid className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Kanban</span>
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
        </motion.div>

        {/* Stats Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatsCard
            title="Total de OS"
            value={stats.total}
            icon={FileText}
            description="Ordens ativas"
            trend={thisMonthOrders.length > 0 ? { value: thisMonthOrders.length, positive: true } : undefined}
          />
          <StatsCard
            title="Em Produção"
            value={stats.inProgress}
            icon={Clock}
            description="Arte/produção/acabamento"
            variant="primary"
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(stats.totalValue)}
            icon={DollarSign}
            description={`Ticket: ${formatCurrency(avgOrderValue)}`}
          />
          <StatsCard
            title="Urgentes"
            value={stats.urgent}
            icon={AlertTriangle}
            description="Atenção imediata"
            variant={stats.urgent > 0 ? 'accent' : 'default'}
          />
        </div>

        {/* Pipeline - Full width, scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0"
        >
          <div className="min-w-[600px] sm:min-w-0">
            <StatusPipeline byStatus={stats.byStatus} />
          </div>
        </motion.div>

        {/* Charts and Activity Row - Stack on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatusChart byStatus={stats.byStatus} />
          <ProductTypeChart orders={orders} />
          <UrgentOrdersList orders={orders} />
        </div>

        {/* Bottom Row - Activity Feed and Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <ActivityFeed orders={orders} />

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl p-4 sm:p-6 shadow-soft border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base sm:text-lg">Ordens Recentes</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/orders')}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="hidden sm:inline">Ver todas</span>
                <span className="sm:hidden">Ver</span>
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))
              ) : (
                <div className="text-center py-8 sm:py-12 text-muted-foreground">
                  <FileText className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm sm:text-base">Nenhuma ordem de serviço ainda</p>
                  <Button
                    className="mt-4"
                    size="sm"
                    onClick={() => navigate('/orders/new')}
                  >
                    Criar primeira OS
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Stats Footer - 2x2 on mobile, 4 cols desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-4 sm:p-6 border border-border/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl font-display font-bold text-foreground">{stats.total}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Total de Ordens</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-display font-bold text-green-600">{stats.completed}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Concluídas</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-display font-bold text-primary">{stats.inProgress}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Em Produção</p>
            </div>
            <div>
              <p className="text-lg sm:text-2xl font-display font-bold text-gradient">{formatCurrency(stats.totalValue)}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">Faturamento</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
