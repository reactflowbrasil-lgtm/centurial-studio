import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [showManualInfo, setShowManualInfo] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handler = (e: any) => {
            console.log('✅ PWA: beforeinstallprompt disparado!');
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Se o prompt automático não disparar em 10s (ex: iOS), mostra guia manual
        const timer = setTimeout(() => {
            if (!deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches) {
                setIsVisible(true);
                setShowManualInfo(true);
            }
        }, 8000);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
            clearTimeout(timer);
        };
    }, [deferredPrompt]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            toast({
                title: "Instalação Iniciada",
                description: "Obrigado por instalar o Centurial SGPG!",
            });
        }
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const dismiss = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[100] sm:w-80"
                >
                    <div className="bg-card border border-border shadow-elevated rounded-2xl p-4 sm:p-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2">
                            <button
                                onClick={dismiss}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow shrink-0">
                                <Download className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                                    {showManualInfo ? 'Instalar App' : 'Instalar Centurial'}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {showManualInfo
                                        ? 'No iPhone: toque em Compartilhar e "Adicionar à Tela de Início".'
                                        : 'Acesse o sistema direto da sua tela inicial.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            {!showManualInfo ? (
                                <Button
                                    onClick={handleInstallClick}
                                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-9"
                                >
                                    Instalar Agora
                                </Button>
                            ) : (
                                <Button
                                    onClick={dismiss}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-9"
                                >
                                    Entendi
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={dismiss}
                                className="text-xs h-9 px-2"
                            >
                                Depois
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
