import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Moon,
  Sun,
  Monitor,
  Zap,
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    osUpdates: true,
    urgent: true,
    deadlines: true,
    email: false,
  });
  const [companyInfo, setCompanyInfo] = useState({
    name: 'Centurial - Shopping da Sinalização',
    email: 'contato@centurial.com.br',
    phone: '(11) 99999-9999',
    address: 'Rua das Placas, 123 - São Paulo, SP',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const root = document.documentElement;
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (newTheme === 'dark' || (newTheme === 'system' && systemDark)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    toast({
      title: 'Tema alterado',
      description: `Tema ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'escuro' : 'do sistema'} aplicado`,
    });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: 'Configurações salvas',
      description: 'Suas preferências foram atualizadas com sucesso.',
    });
  };

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas preferências do sistema</p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSaving ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </motion.div>

        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Conta
              </CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-xl">{user?.email?.split('@')[0]}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conta verificada
                    </Badge>
                    <Badge variant="outline" className="text-xs">Administrador</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Theme Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Aparência
              </CardTitle>
              <CardDescription>Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary/50 ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center">
                    <Sun className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Claro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary/50 ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                    <Moon className="h-6 w-6 text-slate-300" />
                  </div>
                  <span className="text-sm font-medium">Escuro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 hover:border-primary/50 ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <Monitor className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium">Sistema</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription>Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="os-updates" className="text-base">Atualizações de OS</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando status mudar</p>
                </div>
                <Switch
                  id="os-updates"
                  checked={notifications.osUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, osUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="urgent" className="text-base flex items-center gap-2">
                    OS Urgentes
                    <Badge variant="destructive" className="text-[10px]">Importante</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">Alertas para ordens urgentes</p>
                </div>
                <Switch
                  id="urgent"
                  checked={notifications.urgent}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, urgent: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="deadlines" className="text-base">Prazos</Label>
                  <p className="text-sm text-muted-foreground">Lembrete de entregas próximas</p>
                </div>
                <Switch
                  id="deadlines"
                  checked={notifications.deadlines}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, deadlines: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email" className="text-base">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">Receba resumos diários por e-mail</p>
                </div>
                <Switch
                  id="email"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Dados da Empresa
              </CardTitle>
              <CardDescription>Informações exibidas nos documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
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
          <Card className="bg-gradient-to-br from-primary/5 via-card to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Sobre o Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display font-bold text-xl">Centurial SGPG</h3>
                    <p className="text-sm text-muted-foreground">Sistema de Gestão de Produção Gráfica</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">v1.0.0</Badge>
                    <Badge variant="outline">React + TypeScript</Badge>
                    <Badge variant="outline">Supabase</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Sistema desenvolvido para otimizar o fluxo de trabalho de ordens de serviço
                    da Centurial - Shopping da Sinalização, desde o orçamento até a entrega.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}
