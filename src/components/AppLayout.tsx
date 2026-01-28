import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { InstallPWA } from '@/components/InstallPWA';
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
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) && (
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
        {collapsed && !isMobile && (
          <div className="w-10 h-10 bg-gradient-to-br from-sidebar-primary to-orange-400 rounded-xl flex items-center justify-center shadow-lg mx-auto">
            <Zap className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
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
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 flex-shrink-0', isActive && 'animate-pulse-glow')} />
              <AnimatePresence mode="wait">
                {(!collapsed || isMobile) && (
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

      {/* User & Controls */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className={cn('flex items-center gap-2', collapsed && !isMobile ? 'justify-center' : 'justify-between')}>
          {(!collapsed || isMobile) && <ThemeToggle />}
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className={cn(
              'flex-1 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent',
              collapsed && !isMobile && 'justify-center px-0 flex-initial'
            )}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {(!collapsed || isMobile) && <span className="ml-2 truncate">{user?.email?.split('@')[0]}</span>}
          </Button>
        </div>
        {collapsed && !isMobile && (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full h-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex w-full bg-background overflow-x-hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-sidebar-primary to-orange-400 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sidebar-foreground text-sm">Centurial</span>
              <span className="text-[10px] text-sidebar-foreground/60">SGPG</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[280px] p-0 bg-sidebar border-sidebar-border"
              >
                <div className="h-full flex flex-col">
                  <SidebarContent isMobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border flex-col hidden lg:flex"
      >
        <SidebarContent />
      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300 pt-16 lg:pt-0 overflow-x-hidden',
          collapsed ? 'lg:ml-20' : 'lg:ml-[260px]'
        )}
      >
        <div className="min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}
