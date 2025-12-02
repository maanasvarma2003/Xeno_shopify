import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api';

export default function PredictiveAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPredictions = async () => {
            try {
                // Mock tenant ID
                const tenantId = 'demo_tenant';
                const res = await api.post(`/predict/${tenantId}`, {
                    // Optional: send historical data if available on client
                    historicalData: null
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError('Failed to load predictions');
            } finally {
                setLoading(false);
            }
        };

        fetchPredictions();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-[400px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 h-[400px] flex flex-col items-center justify-center text-red-500 gap-2">
                <AlertCircle className="w-8 h-8" />
                <p>{error}</p>
            </div>
        );
    }

    // Format data for chart
    const chartData = data?.revenueForecast?.map((val, idx) => ({
        month: `Month ${idx + 1}`,
        revenue: val,
        users: data.userForecast?.[idx] || 0
    })) || [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        AI Revenue Forecast
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Predicted performance for next 3 months based on historical trends
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold">
                    <span>Confidence Score: {data?.confidence}%</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
