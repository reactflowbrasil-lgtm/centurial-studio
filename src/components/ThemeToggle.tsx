import { Moon, Sun, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('system');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (theme === 'dark' || (theme === 'system' && systemDark)) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                const root = document.documentElement;
                if (mediaQuery.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.remove('dark');
                }
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    if (!mounted) return null;

    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative overflow-hidden text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                    <AnimatePresence mode="wait" initial={false}>
                        {isDark ? (
                            <motion.div
                                key="moon"
                                initial={{ y: -20, opacity: 0, rotate: -90 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 20, opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Moon className="h-4 w-4" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="sun"
                                initial={{ y: -20, opacity: 0, rotate: -90 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                exit={{ y: 20, opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Sun className="h-4 w-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="sr-only">Alternar tema</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={() => setTheme('light')} className="gap-2">
                    <Sun className="h-4 w-4" />
                    Claro
                    {theme === 'light' && <span className="ml-auto text-xs text-primary">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')} className="gap-2">
                    <Moon className="h-4 w-4" />
                    Escuro
                    {theme === 'dark' && <span className="ml-auto text-xs text-primary">✓</span>}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')} className="gap-2">
                    <Monitor className="h-4 w-4" />
                    Sistema
                    {theme === 'system' && <span className="ml-auto text-xs text-primary">✓</span>}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
