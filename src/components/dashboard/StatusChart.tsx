import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { STATUS_CONFIG, OsStatus } from '@/types/database';

interface StatusChartProps {
    byStatus: Record<string, number>;
}

const STATUS_COLORS: Record<OsStatus, string> = {
    orcamento: '#EAB308',
    aprovado: '#10B981',
    arte: '#8B5CF6',
    producao: '#3B82F6',
    acabamento: '#06B6D4',
    revisao: '#F97316',
    entrega: '#22C55E',
    concluido: '#6B7280',
    cancelado: '#EF4444',
};

export function StatusChart({ byStatus }: StatusChartProps) {
    const data = Object.entries(STATUS_CONFIG)
        .filter(([key]) => key !== 'cancelado')
        .map(([key, config]) => ({
            name: config.label,
            value: byStatus[key] || 0,
            status: key as OsStatus,
        }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full"
        >
            <h3 className="font-display font-semibold text-lg mb-4">Ordens por Status</h3>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
                        <YAxis
                            type="category"
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            width={80}
                            fontSize={11}
                            stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            formatter={(value: number) => [`${value} OS`, 'Quantidade']}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
