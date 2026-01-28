import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StatusPipeline } from '@/components/dashboard/StatusPipeline';
import { OrderCard } from '@/components/orders/OrderCard';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { FileText, Users, TrendingUp, AlertTriangle, DollarSign, Clock, Loader2 } from 'lucide-react';
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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const urgentOrders = orders.filter(o => o.priority === 'urgente' && o.status !== 'concluido');

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Visão geral da produção gráfica</p>
          </div>
          <Button 
            onClick={() => navigate('/orders/new')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova OS
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total de OS"
            value={stats.total}
            icon={FileText}
            description="Ordens de serviço ativas"
          />
          <StatsCard
            title="Em Produção"
            value={stats.inProgress}
            icon={Clock}
            description="Arte, produção ou acabamento"
            variant="primary"
          />
          <StatsCard
            title="Valor Total"
            value={formatCurrency(stats.totalValue)}
            icon={DollarSign}
            description="Faturamento em aberto"
          />
          <StatsCard
            title="Urgentes"
            value={stats.urgent}
            icon={AlertTriangle}
            description="Requerem atenção imediata"
            variant={stats.urgent > 0 ? 'accent' : 'default'}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline */}
          <div className="lg:col-span-2">
            <StatusPipeline byStatus={stats.byStatus} />
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border"
          >
            <h3 className="font-display font-semibold text-lg mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/orders/new')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Nova OS
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/clients')}
              >
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Clientes
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/assistant')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Assistente IA
              </Button>
            </div>

            {urgentOrders.length > 0 && (
              <div className="mt-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Atenção</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {urgentOrders.length} OS {urgentOrders.length === 1 ? 'urgente aguardando' : 'urgentes aguardando'}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg">Ordens Recentes</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>
              Ver todas
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
            {recentOrders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma ordem de serviço ainda</p>
                <Button 
                  className="mt-4"
                  onClick={() => navigate('/orders/new')}
                >
                  Criar primeira OS
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}
