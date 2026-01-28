import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);
    if (error) {
      toast({ title: 'Erro no login', description: error.message, variant: 'destructive' });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Erro', description: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Erro', description: 'A senha deve ter pelo menos 6 caracteres', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    const { error } = await signUp(email, password);
    setIsSubmitting(false);
    if (error) {
      if (error.message.includes('already registered')) {
        toast({ title: 'Usuário existente', description: 'Este email já está cadastrado. Faça login.', variant: 'destructive' });
      } else {
        toast({ title: 'Erro no cadastro', description: error.message, variant: 'destructive' });
      }
    } else {
      toast({ title: 'Conta criada!', description: 'Você já pode fazer login.' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Brand/Logo Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-accent rounded-[22px] shadow-glow mb-4"
          >
            <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Centurial SGPG</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão Inteligente de Produção Gráfica</p>
        </div>

        <Card className="shadow-elevated border-border/50 overflow-hidden">
          <CardHeader className="p-0">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 rounded-none h-14 bg-muted/30 border-b border-border">
                <TabsTrigger value="login" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none border-r border-border">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-background data-[state=active]:shadow-none rounded-none">
                  Cadastro
                </TabsTrigger>
              </TabsList>

              <div className="p-6 pt-8">
                <TabsContent value="login" className="mt-0 space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Bem-vindo de volta!</h2>
                    <p className="text-xs text-muted-foreground mt-1">Acesse sua conta para continuar</p>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-login">Email</Label>
                      <Input
                        id="email-login"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 sm:h-12 bg-muted/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password-login">Senha</Label>
                        <button type="button" className="text-xs text-primary hover:underline">Esqueci a senha</button>
                      </div>
                      <Input
                        id="password-login"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 sm:h-12 bg-muted/20"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 shadow-lg text-sm font-semibold mt-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ArrowRight className="h-5 w-5 mr-2" />}
                      Entrar no Sistema
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 space-y-4">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold">Crie sua conta</h2>
                    <p className="text-xs text-muted-foreground mt-1">Comece a gerenciar suas ordens hoje</p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-signup">Email Corporativo</Label>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="seu@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11 sm:h-12 bg-muted/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password-signup">Nova Senha</Label>
                      <Input
                        id="password-signup"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 sm:h-12 bg-muted/20"
                      />
                    </div>
                    <div className="flex items-center gap-2 py-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <p className="text-[10px] text-muted-foreground">Suas informações estão protegidas com criptografia de ponta a ponta.</p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-11 sm:h-12 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg text-sm font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                      Criar Conta Grátis
                    </Button>
                  </form>
                </TabsContent>
              </div>
            </Tabs>
          </CardHeader>
        </Card>

        <div className="flex items-center justify-center gap-6 mt-8">
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Centurial Studio © 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
