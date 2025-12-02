import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Loader2 } from 'lucide-react';
import api from '../api';

export default function AnomalyDetection() {
    const [anomalies, setAnomalies] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const detectAnomalies = async () => {
            try {
                const tenantId = 'demo_tenant';
                const response = await api.get(`/dashboard/${tenantId}`);
                const data = response.data;

                // Simple anomaly detection logic (can be enhanced with AI)
                const detected = [];

                // Check for unusual revenue patterns
                const avgRevenue = data.totalRevenue / (data.orderCount || 1);
                if (avgRevenue > 1000) {
                    detected.push({
                        type: 'high_value',
                        severity: 'info',
                        title: 'High Average Order Value',
                        description: `Your average order value is $${avgRevenue.toFixed(2)}, which is excellent!`,
                        icon: TrendingUp
                    });
                }

                // Check for low order count
                if (data.orderCount < 10) {
                    detected.push({
                        type: 'low_orders',
                        severity: 'warning',
                        title: 'Low Order Volume',
                        description: 'You have fewer than 10 orders. Consider marketing campaigns.',
                        icon: AlertTriangle
                    });
                }

                // Check for unusual customer count
                if (data.customerCount > data.orderCount * 2) {
                    detected.push({
                        type: 'high_signups',
                        severity: 'info',
                        title: 'High Customer Signups',
                        description: 'Many customers have signed up but haven\'t purchased yet.',
                        icon: Activity
                    });
                }

                // Check for negative trends
                if (data.revenueTrend < 0) {
                    detected.push({
                        type: 'revenue_decline',
                        severity: 'critical',
                        title: 'Revenue Decline Detected',
                        description: `Revenue has decreased by ${Math.abs(data.revenueTrend)}% compared to the previous period.`,
                        icon: TrendingDown
                    });
                }

                setAnomalies(detected);
            } catch (error) {
                console.error(error);
                setAnomalies([]);
            } finally {
                setLoading(false);
            }
        };

        detectAnomalies();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        );
    }

    const severityColors = {
        critical: 'from-red-500 to-rose-500',
        warning: 'from-amber-500 to-orange-500',
        info: 'from-blue-500 to-indigo-500'
    };

    const severityBg = {
        critical: 'bg-red-50 border-red-200',
        warning: 'bg-amber-50 border-amber-200',
        info: 'bg-blue-50 border-blue-200'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
        >
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Anomaly Detection</h3>
                    <p className="text-sm text-slate-500">AI-powered pattern analysis</p>
                </div>
            </div>

            {anomalies && anomalies.length > 0 ? (
                <div className="space-y-3">
                    {anomalies.map((anomaly, index) => {
                        const Icon = anomaly.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-xl border-2 ${severityBg[anomaly.severity]} relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${severityColors[anomaly.severity]} opacity-5 rounded-full blur-2xl`} />

                                <div className="flex items-start gap-3 relative">
                                    <div className={`w-10 h-10 bg-gradient-to-br ${severityColors[anomaly.severity]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 mb-1">{anomaly.title}</h4>
                                        <p className="text-sm text-slate-600">{anomaly.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-slate-600 font-semibold">All systems normal</p>
                    <p className="text-sm text-slate-400 mt-1">No anomalies detected in your data</p>
                </div>
            )}
        </motion.div>
    );
}
