import { motion } from 'framer-motion';
import { ServiceOrder } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    ArrowRightCircle,
    CheckCircle,
    Clock,
    AlertTriangle,
    PlusCircle,
    XCircle,
} from 'lucide-react';

interface ActivityFeedProps {
    orders: ServiceOrder[];
}

type ActivityType = 'created' | 'updated' | 'completed' | 'urgent' | 'cancelled';

interface Activity {
    id: string;
    type: ActivityType;
    title: string;
    subtitle: string;
    time: Date;
    osNumber: number;
}

export function ActivityFeed({ orders }: ActivityFeedProps) {
    // Simulate activities based on orders - in real app, this would come from a proper activity log
    const activities: Activity[] = orders
        .slice(0, 10)
        .map((order) => {
            let type: ActivityType = 'created';

            if (order.status === 'concluido') {
                type = 'completed';
            } else if (order.status === 'cancelado') {
                type = 'cancelled';
            } else if (order.priority === 'urgente') {
                type = 'urgent';
            } else if (new Date(order.updated_at) > new Date(order.created_at)) {
                type = 'updated';
            }

            return {
                id: order.id,
                type,
                title: order.title,
                subtitle: getActivitySubtitle(type, order),
                time: new Date(order.updated_at),
                osNumber: order.os_number,
            };
        })
        .sort((a, b) => b.time.getTime() - a.time.getTime());

    function getActivitySubtitle(type: ActivityType, order: ServiceOrder): string {
        switch (type) {
            case 'created':
                return 'Nova ordem criada';
            case 'updated':
                return `Status: ${order.status}`;
            case 'completed':
                return 'Ordem finalizada';
            case 'urgent':
                return 'Marcada como urgente';
            case 'cancelled':
                return 'Ordem cancelada';
            default:
                return '';
        }
    }

    function getActivityIcon(type: ActivityType) {
        const iconMap = {
            created: { icon: PlusCircle, color: 'text-blue-500 bg-blue-500/10' },
            updated: { icon: ArrowRightCircle, color: 'text-primary bg-primary/10' },
            completed: { icon: CheckCircle, color: 'text-green-500 bg-green-500/10' },
            urgent: { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
            cancelled: { icon: XCircle, color: 'text-gray-500 bg-gray-500/10' },
        };
        return iconMap[type];
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-lg">Atividades Recentes</h3>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </div>

            <ScrollArea className="h-[280px] -mx-2 px-2">
                <div className="space-y-4">
                    {activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Clock className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">Nenhuma atividade recente</p>
                        </div>
                    ) : (
                        activities.map((activity, index) => {
                            const { icon: Icon, color } = getActivityIcon(activity.type);

                            return (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="flex items-start gap-3 group"
                                >
                                    {/* Timeline dot */}
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        {index < activities.length - 1 && (
                                            <div className="w-px h-full bg-border absolute top-8 left-1/2 -translate-x-1/2" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pb-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {activity.title}
                                            </p>
                                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex-shrink-0">
                                                #{activity.osNumber}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {activity.subtitle}
                                        </p>
                                        <p className="text-xs text-muted-foreground/70">
                                            {formatDistanceToNow(activity.time, { locale: ptBR, addSuffix: true })}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </ScrollArea>
        </motion.div>
    );
}
