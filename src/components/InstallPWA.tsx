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
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="fixed bottom-8 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-10 z-[100] sm:w-85"
                >
                    <div className="bg-card/95 backdrop-blur-md border-2 border-primary/30 shadow-2xl rounded-3xl p-5 sm:p-6 relative overflow-hidden ring-1 ring-black/5">
                        <div className="absolute top-1 right-1">
                            <button
                                onClick={dismiss}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <Download className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="font-display font-bold text-sm sm:text-base text-foreground">
                                    {showManualInfo ? 'Instale o Sistema' : 'SGP Centurial'}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                                    {showManualInfo
                                        ? 'Toque no ícone de compartilhar (quadrado com seta) e escolha "Adicionar à Tela de Início".'
                                        : 'Adicione o Centurial à sua tela inicial para acesso rápido.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 flex gap-2">
                            {!showManualInfo ? (
                                <Button
                                    onClick={handleInstallClick}
                                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-10 font-bold"
                                >
                                    Instalar Agora
                                </Button>
                            ) : (
                                <Button
                                    onClick={dismiss}
                                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-10 font-bold"
                                >
                                    Instalar!
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                onClick={dismiss}
                                className="text-xs h-10 px-3 border-border/50"
                            >
                                Agora não
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
