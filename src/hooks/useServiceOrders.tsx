import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ServiceOrder, OsStatus } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useServiceOrders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['service-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_orders')
        .select(`
          *,
          clients (
            id,
            name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ServiceOrder[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OsStatus }) => {
      const { error } = await supabase
        .from('service_orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      toast({
        title: 'Status atualizado',
        description: 'O status da OS foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const createOrder = useMutation({
    mutationFn: async (order: Omit<ServiceOrder, 'id' | 'os_number' | 'created_at' | 'updated_at' | 'clients'>) => {
      const { data, error } = await supabase
        .from('service_orders')
        .insert([order])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      toast({
        title: 'OS criada',
        description: 'Nova ordem de serviço criada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar OS',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('service_orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-orders'] });
      toast({
        title: 'OS excluída',
        description: 'Ordem de serviço excluída com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Stats calculations
  const stats = {
    total: orders.length,
    inProgress: orders.filter(o => ['arte', 'producao', 'acabamento'].includes(o.status)).length,
    pending: orders.filter(o => ['orcamento', 'aprovado'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'concluido').length,
    urgent: orders.filter(o => o.priority === 'urgente').length,
    totalValue: orders.reduce((sum, o) => sum + Number(o.total_price), 0),
    byStatus: orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  return {
    orders,
    isLoading,
    error,
    stats,
    updateStatus,
    createOrder,
    deleteOrder,
  };
}
