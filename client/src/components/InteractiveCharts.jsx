import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart3, PieChart, LineChart, TrendingUp } from 'lucide-react';

export default function InteractiveCharts() {
    const [activeChart, setActiveChart] = useState('revenue');

    const charts = {
        revenue: {
            icon: BarChart3,
            title: 'Revenue Analytics',
            data: [
                { month: 'Jan', value: 45, label: '$45K' },
                { month: 'Feb', value: 62, label: '$62K' },
                { month: 'Mar', value: 55, label: '$55K' },
                { month: 'Apr', value: 78, label: '$78K' },
                { month: 'May', value: 70, label: '$70K' },
                { month: 'Jun', value: 92, label: '$92K' },
            ],
            gradient: 'from-blue-500 to-cyan-500'
        },
        customers: {
            icon: PieChart,
            title: 'Customer Segments',
            data: [
                { label: 'Premium', value: 85, color: 'from-purple-500 to-pink-500' },
                { label: 'Standard', value: 65, color: 'from-blue-500 to-indigo-500' },
                { label: 'Basic', value: 45, color: 'from-cyan-500 to-teal-500' },
            ]
        },
        growth: {
            icon: TrendingUp,
            title: 'Growth Metrics',
            data: [
                { metric: 'Traffic', value: 95, change: '+24%' },
                { metric: 'Leads', value: 82, change: '+18%' },
                { metric: 'Sales', value: 88, change: '+32%' },
                { metric: 'Revenue', value: 91, change: '+41%' },
            ],
            gradient: 'from-emerald-500 to-green-500'
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Chart Selector */}
            <div className="flex justify-center gap-4 mb-8">
                {Object.keys(charts).map((key) => {
                    const chart = charts[key];
                    const isActive = activeChart === key;
                    return (
                        <motion.button
                            key={key}
                            onClick={() => setActiveChart(key)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'bg-white/60 text-slate-700 hover:bg-white/80'
                                }`}
                        >
                            <chart.icon className="w-5 h-5" />
                            <span>{chart.title}</span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Chart Display */}
            <motion.div
                key={activeChart}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl"
            >
                {/* Revenue Chart */}
                {activeChart === 'revenue' && (
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Monthly Revenue Trend</h3>
                        <div className="h-80 flex items-end justify-between gap-4">
                            {charts.revenue.data.map((item, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center gap-3">
                                    <motion.div
                                        className="relative w-full"
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.value * 3}px` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    >
                                        <motion.div
                                            className={`w-full h-full bg-gradient-to-t ${charts.revenue.gradient} rounded-t-2xl relative group cursor-pointer`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {/* Value tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {item.label}
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                    <span className="text-sm font-bold text-slate-600">{item.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Customer Segments */}
                {activeChart === 'customers' && (
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Customer Distribution</h3>
                        <div className="flex items-center justify-center gap-12">
                            {/* Circular Progress */}
                            <div className="relative w-64 h-64">
                                {charts.customers.data.map((segment, index) => {
                                    const radius = 100 - index * 25;
                                    const circumference = 2 * Math.PI * radius;
                                    const offset = circumference - (segment.value / 100) * circumference;

                                    return (
                                        <motion.svg
                                            key={index}
                                            className="absolute inset-0 w-full h-full -rotate-90"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.2 }}
                                        >
                                            <circle
                                                cx="128"
                                                cy="128"
                                                r={radius}
                                                fill="none"
                                                stroke="#e2e8f0"
                                                strokeWidth="12"
                                            />
                                            <motion.circle
                                                cx="128"
                                                cy="128"
                                                r={radius}
                                                fill="none"
                                                stroke={`url(#gradient-${index})`}
                                                strokeWidth="12"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                initial={{ strokeDashoffset: circumference }}
                                                animate={{ strokeDashoffset: offset }}
                                                transition={{ duration: 1.5, delay: index * 0.2 }}
                                            />
                                            <defs>
                                                <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#3b82f6" />
                                                    <stop offset="100%" stopColor="#8b5cf6" />
                                                </linearGradient>
                                            </defs>
                                        </motion.svg>
                                    );
                                })}
                            </div>

                            {/* Legend */}
                            <div className="space-y-4">
                                {charts.customers.data.map((segment, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${segment.color}`} />
                                        <span className="font-bold text-slate-900">{segment.label}</span>
                                        <span className="text-2xl font-display font-black text-blue-600">{segment.value}%</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Growth Metrics */}
                {activeChart === 'growth' && (
                    <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Performance Overview</h3>
                        <div className="space-y-6">
                            {charts.growth.data.map((metric, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-slate-900">{metric.metric}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-600 font-bold text-sm">{metric.change}</span>
                                            <span className="text-2xl font-display font-black text-blue-600">{metric.value}%</span>
                                        </div>
                                    </div>
                                    <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-gradient-to-r ${charts.growth.gradient} rounded-full`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${metric.value}%` }}
                                            transition={{ duration: 1.5, delay: index * 0.15 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
