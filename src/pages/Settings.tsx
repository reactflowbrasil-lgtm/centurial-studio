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
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Configurações</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gerencie suas preferências do sistema</p>
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
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
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-border py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Conta
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-lg sm:text-xl truncate">{user?.email?.split('@')[0]}</p>
                  <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Conta verificada
                    </Badge>
                    <Badge variant="outline" className="text-[10px] sm:text-xs">Administrador</Badge>
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
            <CardHeader className="py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Aparência
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Personalize a aparência do sistema</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-row xs:flex-col items-center gap-3 xs:gap-2 hover:border-primary/50 text-left xs:text-center ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-yellow-200 to-orange-300 flex items-center justify-center shrink-0">
                    <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                  </div>
                  <span className="text-sm font-medium">Claro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-row xs:flex-col items-center gap-3 xs:gap-2 hover:border-primary/50 text-left xs:text-center ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0">
                    <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-300" />
                  </div>
                  <span className="text-sm font-medium">Escuro</span>
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all flex flex-row xs:flex-col items-center gap-3 xs:gap-2 hover:border-primary/50 text-left xs:text-center ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center shrink-0">
                    <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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
            <CardHeader className="py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Notificações
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Configure suas preferências de notificação</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="os-updates" className="text-sm sm:text-base">Atualizações de OS</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Receba notificações quando status mudar</p>
                </div>
                <Switch
                  id="os-updates"
                  checked={notifications.osUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, osUpdates: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="urgent" className="text-sm sm:text-base flex items-center gap-2">
                    OS Urgentes
                    <Badge variant="destructive" className="text-[8px] sm:text-[10px]">Importante</Badge>
                  </Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Alertas para ordens urgentes</p>
                </div>
                <Switch
                  id="urgent"
                  checked={notifications.urgent}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, urgent: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="deadlines" className="text-sm sm:text-base">Prazos</Label>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Lembrete de entregas próximas</p>
                </div>
                <Switch
                  id="deadlines"
                  checked={notifications.deadlines}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, deadlines: checked })}
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
            <CardHeader className="py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Dados da Empresa
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Informações exibidas nos documentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-sm">Nome da Empresa</Label>
                  <Input
                    id="company-name"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({ ...companyInfo, name: e.target.value })}
                    className="h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email" className="text-sm">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone" className="text-sm">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-phone"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-address" className="text-sm">Endereço</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company-address"
                      value={companyInfo.address}
                      onChange={(e) => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                      className="pl-10 h-10 text-sm"
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
            <CardHeader className="py-4 px-4 sm:px-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-accent" />
                Sobre o Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg flex-shrink-0">
                  <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="space-y-2 sm:space-y-3 min-w-0">
                  <div>
                    <h3 className="font-display font-bold text-lg sm:text-xl">Centurial SGPG</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Sistema de Gestão de Produção Gráfica</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-[10px]">v1.0.0</Badge>
                    <Badge variant="outline" className="text-[10px]">React + TypeScript</Badge>
                    <Badge variant="outline" className="text-[10px]">Supabase</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
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
