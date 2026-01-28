import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Ordens de Serviço', href: '/orders', icon: FileText },
  { name: 'Kanban', href: '/kanban', icon: LayoutGrid },
  { name: 'Clientes', href: '/clients', icon: Users },
  { name: 'Assistente IA', href: '/assistant', icon: Sparkles },
  { name: 'Configurações', href: '/settings', icon: Settings },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex flex-col"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
                  <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sidebar-foreground text-sm">Centurial</span>
                  <span className="text-[10px] text-sidebar-foreground/60">SGPG v1.0</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {collapsed && (
            <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-orange-400 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-pulse-glow')} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* User & Collapse */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          <div className={cn('flex items-center gap-2', collapsed ? 'justify-center' : 'justify-between')}>
            {!collapsed && <ThemeToggle />}
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className={cn(
                'flex-1 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
                collapsed && 'justify-center px-0 flex-initial'
              )}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {!collapsed && <span className="ml-2 truncate">{user?.email?.split('@')[0]}</span>}
            </Button>
          </div>
          {collapsed && (
            <div className="flex justify-center">
              <ThemeToggle />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          collapsed ? 'ml-20' : 'ml-[260px]'
        )}
      >
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
