import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';

const MetricCard = ({ icon: IconComponent, label, value, unit, status = 'good' }) => {
    const statusColors = {
        good: 'from-green-500 to-emerald-600',
        warning: 'from-yellow-500 to-orange-600',
        critical: 'from-red-500 to-rose-600'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 p-4 shadow-lg"
        >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${statusColors[status]} text-white shadow-md`}>
                    <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live</span>
                </div>
            </div>
            <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{label}</h4>
            <div className="flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-slate-800">{value}</span>
                <span className="text-sm font-medium text-slate-400">{unit}</span>
            </div>

            {/* Animated pulse effect */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"></div>
        </motion.div>
    );
};

export default function PerformanceMonitor() {
    const [metrics, setMetrics] = useState({
        responseTime: 0,
        memoryUsage: 0,
        activeConnections: 0,
        requestsPerMinute: 0,
        uptime: 0
    });

    useEffect(() => {
        // Simulated performance metrics (in production, fetch from backend)
        const updateMetrics = () => {
            setMetrics({
                responseTime: Math.floor(Math.random() * 100) + 20, // 20-120ms
                memoryUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
                activeConnections: Math.floor(Math.random() * 50) + 10,
                requestsPerMinute: Math.floor(Math.random() * 200) + 50,
                uptime: 99.9 + (Math.random() * 0.1)
            });
        };

        updateMetrics();
        const interval = setInterval(updateMetrics, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="glass-panel p-6 border border-white/40"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        System Performance
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Real-time application health monitoring</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                    All Systems Operational
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricCard
                    icon={Zap}
                    label="Response Time"
                    value={metrics.responseTime}
                    unit="ms"
                    status={metrics.responseTime < 50 ? 'good' : metrics.responseTime < 100 ? 'warning' : 'critical'}
                />
                <MetricCard
                    icon={HardDrive}
                    label="Memory Usage"
                    value={metrics.memoryUsage}
                    unit="%"
                    status={metrics.memoryUsage < 60 ? 'good' : metrics.memoryUsage < 80 ? 'warning' : 'critical'}
                />
                <MetricCard
                    icon={Activity}
                    label="Active Connections"
                    value={metrics.activeConnections}
                    unit="clients"
                    status="good"
                />
                <MetricCard
                    icon={Cpu}
                    label="Requests/Min"
                    value={metrics.requestsPerMinute}
                    unit="req"
                    status="good"
                />
                <MetricCard
                    icon={TrendingUp}
                    label="Uptime"
                    value={metrics.uptime.toFixed(2)}
                    unit="%"
                    status={metrics.uptime > 99.5 ? 'good' : 'warning'}
                />
            </div>

            {/* Performance Graph Placeholder */}
            <div className="mt-6 h-24 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-slate-200 flex items-center justify-center">
                <p className="text-sm text-slate-400 font-medium">📊 Performance trends visualization placeholder</p>
            </div>
        </motion.div>
    );
}
