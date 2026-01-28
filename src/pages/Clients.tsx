import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { useClients } from '@/hooks/useClients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Plus, Search, Users, Loader2, Phone, Mail, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ClientsPage() {
  const { clients, isLoading, createClient } = useClients();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf_cnpj: '',
    address: '',
    city: '',
    state: 'SP',
    notes: '',
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.email?.toLowerCase().includes(search.toLowerCase()) ||
    client.cpf_cnpj?.includes(search)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    setIsSubmitting(true);
    try {
      await createClient.mutateAsync({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        cpf_cnpj: formData.cpf_cnpj || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        notes: formData.notes || null,
      });
      setFormData({ name: '', email: '', phone: '', cpf_cnpj: '', address: '', city: '', state: 'SP', notes: '' });
      setIsDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome / Razão Social *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1.5"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="mt-1.5"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
        <Input
          id="cpf_cnpj"
          value={formData.cpf_cnpj}
          onChange={(e) => setFormData({ ...formData, cpf_cnpj: e.target.value })}
          className="mt-1.5"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="mt-1.5"
            maxLength={2}
          />
        </div>
      </div>
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Cadastrar
        </Button>
      </div>
    </form>
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)] lg:h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Clientes</h1>
            <p className="text-sm text-muted-foreground mt-1">{clients.length} clientes cadastrados</p>
          </div>

          {/* Desktop Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hidden sm:flex bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
              </DialogHeader>
              <FormContent />
            </DialogContent>
          </Dialog>

          {/* Mobile Sheet */}
          <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <SheetTrigger asChild>
              <Button className="sm:hidden bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[85vh] rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Cadastrar Novo Cliente</SheetTitle>
              </SheetHeader>
              <div className="py-4 overflow-y-auto">
                <FormContent />
              </div>
            </SheetContent>
          </Sheet>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou CPF/CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </motion.div>

        {/* Clients List - Cards on mobile, Table on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Mobile Cards */}
          <div className="space-y-3 lg:hidden">
            {filteredClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{client.name}</p>
                        <div className="space-y-1 mt-1">
                          {client.email && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate">{client.email}</span>
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3 flex-shrink-0" />
                              <span>{client.phone}</span>
                            </div>
                          )}
                          {client.city && (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 flex-shrink-0" />
                              <span>{client.city}/{client.state}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Desktop Table */}
          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Cliente</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Contato</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">CPF/CNPJ</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Localização</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Cadastro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <p className="font-medium">{client.name}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            {client.email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {client.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-sm">{client.cpf_cnpj || '-'}</td>
                        <td className="p-4">
                          {client.city ? (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {client.city}/{client.state}
                            </div>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {format(new Date(client.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <p className="text-muted-foreground">
                {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}
