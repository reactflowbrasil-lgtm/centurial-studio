import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PRODUCT_TYPE_CONFIG, ProductType } from '@/types/database';
import { ServiceOrder } from '@/types/database';

interface ProductTypeChartProps {
    orders: ServiceOrder[];
}

const COLORS = [
    '#F59E0B', // yellow-500
    '#10B981', // emerald-500
    '#3B82F6', // blue-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#06B6D4', // cyan-500
    '#F97316', // orange-500
    '#6B7280', // gray-500
];

export function ProductTypeChart({ orders }: ProductTypeChartProps) {
    const productCounts = orders.reduce((acc, order) => {
        acc[order.product_type] = (acc[order.product_type] || 0) + 1;
        return acc;
    }, {} as Record<ProductType, number>);

    const data = Object.entries(productCounts)
        .map(([type, count]) => ({
            name: PRODUCT_TYPE_CONFIG[type as ProductType]?.label || type,
            value: count,
            icon: PRODUCT_TYPE_CONFIG[type as ProductType]?.icon || '📦',
        }))
        .sort((a, b) => b.value - a.value);

    if (data.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full flex flex-col"
            >
                <h3 className="font-display font-semibold text-lg mb-4">Por Tipo de Produto</h3>
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <p>Nenhum dado disponível</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-soft border border-border h-full"
        >
            <h3 className="font-display font-semibold text-lg mb-4">Por Tipo de Produto</h3>

            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                            formatter={(value: number, name: string) => [`${value} OS`, name]}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-4">
                {data.slice(0, 4).map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="truncate text-muted-foreground">
                            {item.icon} {item.name}
                        </span>
                        <span className="font-medium text-foreground ml-auto">{item.value}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
