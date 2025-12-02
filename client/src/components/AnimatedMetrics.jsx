import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, Users, ShoppingCart } from 'lucide-react';

export default function AnimatedMetrics() {
    const [activeMetric, setActiveMetric] = useState(0);

    const metrics = [
        {
            icon: DollarSign,
            label: 'Revenue Growth',
            value: '+156%',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500',
            chart: [40, 55, 48, 65, 58, 75, 68, 85, 78, 95, 88, 100]
        },
        {
            icon: Users,
            label: 'Active Users',
            value: '10.5K',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500',
            chart: [30, 45, 40, 60, 55, 70, 65, 80, 75, 90, 85, 95]
        },
        {
            icon: ShoppingCart,
            label: 'Orders',
            value: '+89%',
            color: 'indigo',
            gradient: 'from-indigo-500 to-blue-500',
            chart: [35, 50, 45, 62, 57, 72, 67, 82, 77, 92, 87, 98]
        },
        {
            icon: TrendingUp,
            label: 'Conversion Rate',
            value: '12.8%',
            color: 'emerald',
            gradient: 'from-emerald-500 to-teal-500',
            chart: [25, 40, 38, 55, 52, 68, 64, 78, 74, 88, 84, 96]
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveMetric((prev) => (prev + 1) % metrics.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [metrics.length]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`relative group cursor-pointer ${activeMetric === index ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    onClick={() => setActiveMetric(index)}
                >
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-opacity`} />

                    {/* Card */}
                    <div className="relative bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all">
                        {/* Icon */}
                        <div className={`w-14 h-14 bg-gradient-to-br ${metric.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                            <metric.icon className="w-7 h-7 text-white" />
                        </div>

                        {/* Value */}
                        <motion.div
                            className="text-4xl font-display font-black text-slate-900 mb-1"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: activeMetric === index ? [0.8, 1.1, 1] : 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {metric.value}
                        </motion.div>

                        {/* Label */}
                        <div className="text-sm text-slate-600 font-semibold uppercase tracking-wider mb-4">
                            {metric.label}
                        </div>

                        {/* Animated Mini Chart */}
                        <div className="h-20 flex items-end gap-1">
                            {metric.chart.map((height, i) => (
                                <motion.div
                                    key={i}
                                    className={`flex-1 bg-gradient-to-t ${metric.gradient} rounded-t-lg`}
                                    initial={{ height: 0 }}
                                    animate={{
                                        height: `${height}%`,
                                        opacity: activeMetric === index ? [0.6, 1, 0.6] : 0.6
                                    }}
                                    transition={{
                                        height: { duration: 1, delay: i * 0.05 },
                                        opacity: { duration: 2, repeat: Infinity }
                                    }}
                                    whileHover={{ opacity: 1, scale: 1.1 }}
                                />
                            ))}
                        </div>

                        {/* Sparkle effect */}
                        {activeMetric === index && (
                            <motion.div
                                className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [1, 0, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                }}
                            />
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
