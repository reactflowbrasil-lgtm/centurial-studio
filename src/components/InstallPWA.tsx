import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            toast({
                title: "Instalação Iniciada",
                description: "Obrigado por instalar o Centurial SGPG!",
            });
        }

        // We've used the prompt, and can't use it again, throw it away
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
                                aria-label="Close install prompt"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-glow shrink-0">
                                <Download className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <div className="flex-1 min-w-0 pr-4">
                                <h3 className="font-display font-bold text-sm sm:text-base text-foreground">Instalar App</h3>
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                    Acesse o sistema direto da sua tela inicial.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2">
                            <Button
                                onClick={handleInstallClick}
                                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground text-xs h-9"
                            >
                                Instalar Agora
                            </Button>
                            <Button
                                variant="outline"
                                onClick={dismiss}
                                className="text-xs h-9"
                            >
                                Agora não
                            </Button>
                        </div>

                        {/* Ambient glow */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-all" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
