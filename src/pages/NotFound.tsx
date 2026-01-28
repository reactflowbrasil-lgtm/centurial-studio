import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 max-w-md w-full"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 10 }}
          className="w-24 h-24 sm:w-32 sm:h-32 bg-card border border-border rounded-3xl shadow-elevated flex items-center justify-center mx-auto mb-6 sm:mb-8"
        >
          <FileQuestion className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
        </motion.div>

        <h1 className="text-6xl sm:text-8xl font-display font-black text-primary opacity-20 absolute -top-10 sm:-top-16 left-1/2 -translate-x-1/2 select-none pointer-events-none">
          404
        </h1>

        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Caminho sem saída
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Parece que a página que você está procurando não existe ou foi movida para outro local.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-10">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow"
          >
            <Home className="h-4 w-4 mr-2" />
            Página Inicial
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-12">
          Centurial SGPG • Sistema de Gestão
        </p>
      </motion.div>
    </div>
  );
}
