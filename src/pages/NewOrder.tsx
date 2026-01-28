import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useServiceOrders } from '@/hooks/useServiceOrders';
import { useClients } from '@/hooks/useClients';
import { PRODUCT_TYPE_CONFIG, ProductType, PriorityLevel } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewOrderPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createOrder } = useServiceOrders();
  const { clients } = useClients();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    designer_name: '', // Novo campo
    product_type: 'outros' as ProductType,
    priority: 'normal' as PriorityLevel,
    quantity: 1,
    unit_price: 0,
    estimated_delivery: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast({ title: 'Erro', description: 'Título é obrigatório', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const total_price = formData.quantity * formData.unit_price;
      await createOrder.mutateAsync({
        title: formData.title,
        description: formData.description || null,
        client_id: formData.client_id || null,
        product_type: formData.product_type,
        status: 'orcamento',
        priority: formData.priority,
        quantity: formData.quantity,
        unit_price: formData.unit_price,
        total_price,
        estimated_delivery: formData.estimated_delivery || null,
        actual_delivery: null,
        notes: formData.notes || null,
        created_by: null,
        assigned_to: null,
        designer_name: formData.designer_name || null,
        production_checklist: [], // Inicializa vazio
      });
      navigate('/orders');
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-4"
        >
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-display font-bold text-foreground">Nova Ordem de Serviço</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Preencha os dados do novo serviço</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Basic Info */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Ex: Placas de Sinalização para Obra"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="designer" className="text-sm">Designer Responsável</Label>
                    <Input
                      id="designer"
                      value={formData.designer_name}
                      onChange={(e) => setFormData({ ...formData, designer_name: e.target.value })}
                      placeholder="Nome do designer responsável pela arte"
                      className="mt-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="client" className="text-sm">Cliente</Label>
                      <Select
                        value={formData.client_id}
                        onValueChange={(v) => setFormData({ ...formData, client_id: v })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="product_type" className="text-sm">Tipo de Produto</Label>
                      <Select
                        value={formData.product_type}
                        onValueChange={(v) => setFormData({ ...formData, product_type: v as ProductType })}
                      >
                        <SelectTrigger className="mt-1.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(PRODUCT_TYPE_CONFIG).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              {config.icon} {config.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descreva os detalhes do serviço..."
                      className="mt-1.5"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing & Priority */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Valores e Prioridade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="quantity" className="text-sm">Quantidade</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="unit_price" className="text-sm">Valor Unit. (R$)</Label>
                    <Input
                      id="unit_price"
                      type="number"
                      min={0}
                      step={0.01}
                      value={formData.unit_price}
                      onChange={(e) => setFormData({ ...formData, unit_price: parseFloat(e.target.value) || 0 })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Total</Label>
                    <div className="mt-1.5 h-10 px-3 py-2 bg-muted rounded-md font-semibold text-sm sm:text-base">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(formData.quantity * formData.unit_price)}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="priority" className="text-sm">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(v) => setFormData({ ...formData, priority: v as PriorityLevel })}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">🔴 Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated_delivery" className="text-sm">Previsão de Entrega</Label>
                    <Input
                      id="estimated_delivery"
                      type="date"
                      value={formData.estimated_delivery}
                      onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-sm">Observações</Label>
                    <Input
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Observações internas..."
                      className="mt-1.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions - Fixed on mobile */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Criar OS
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </AppLayout>
  );
}
