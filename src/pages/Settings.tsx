import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas preferências do sistema</p>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Conta
              </CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-lg">{user?.email}</p>
                  <p className="text-sm text-muted-foreground">Usuário ativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
              <CardDescription>Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="os-updates">Atualizações de OS</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando status mudar</p>
                </div>
                <Switch id="os-updates" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="urgent">OS Urgentes</Label>
                  <p className="text-sm text-muted-foreground">Alertas para ordens urgentes</p>
                </div>
                <Switch id="urgent" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="deadlines">Prazos</Label>
                  <p className="text-sm text-muted-foreground">Lembrete de entregas próximas</p>
                </div>
                <Switch id="deadlines" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* About */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Sobre o Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Sistema:</strong> Centurial SGPG</p>
                <p><strong>Versão:</strong> 1.0.0</p>
                <p><strong>Empresa:</strong> Centurial - Shopping da Sinalização</p>
                <p className="text-muted-foreground mt-4">
                  Sistema de Gestão de Produção Gráfica desenvolvido para otimizar 
                  o fluxo de trabalho de ordens de serviço.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
