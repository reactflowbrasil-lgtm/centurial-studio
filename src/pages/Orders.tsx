import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { OrderCard } from '@/components/orders/OrderCard';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { STATUS_CONFIG, OsStatus, PRODUCT_TYPE_CONFIG, ProductType } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Plus, Search, Filter, Loader2, FileText, SlidersHorizontal, LayoutGrid } from 'lucide-react';

export default function OrdersPage() {
  const { orders, isLoading } = useServiceOrders();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productFilter, setProductFilter] = useState<string>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.title.toLowerCase().includes(search.toLowerCase()) ||
      order.clients?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.os_number.toString().includes(search);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesProduct = productFilter === 'all' || order.product_type === productFilter;

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const activeFiltersCount = (statusFilter !== 'all' ? 1 : 0) + (productFilter !== 'all' ? 1 : 0);

  const clearFilters = () => {
    setStatusFilter('all');
    setProductFilter('all');
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

  const FilterControls = ({ inSheet = false }: { inSheet?: boolean }) => (
    <div className={inSheet ? 'space-y-4' : 'flex gap-3'}>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className={inSheet ? 'w-full' : 'w-[160px]'}>
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          {Object.entries(STATUS_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>{config.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={productFilter} onValueChange={setProductFilter}>
        <SelectTrigger className={inSheet ? 'w-full' : 'w-[180px]'}>
          <SelectValue placeholder="Tipo de Produto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Tipos</SelectItem>
          {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.icon} {config.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {inSheet && activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          Limpar Filtros
        </Button>
      )}
    </div>
  );

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Ordens de Serviço</h1>
              <p className="text-sm text-muted-foreground mt-1">{orders.length} ordens cadastradas</p>
            </div>
            <div className="flex items-center gap-2">
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

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 bg-card p-3 sm:p-4 rounded-xl border border-border"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título, cliente ou OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex">
            <FilterControls />
          </div>

          {/* Mobile Filter Button */}
          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-auto rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="py-4">
                <FilterControls inSheet />
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))}
          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 sm:py-16 text-muted-foreground"
            >
              <FileText className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 opacity-30" />
              <p className="text-base sm:text-lg font-medium">Nenhuma ordem encontrada</p>
              <p className="text-xs sm:text-sm mt-1">
                {search || statusFilter !== 'all' || productFilter !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando uma nova ordem de serviço'}
              </p>
              {!search && statusFilter === 'all' && productFilter === 'all' && (
                <Button
                  className="mt-6"
                  onClick={() => navigate('/orders/new')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira OS
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
