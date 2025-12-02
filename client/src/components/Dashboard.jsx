import { useEffect, useState, useMemo, lazy, Suspense, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
    Users, ShoppingBag, DollarSign, Activity, RefreshCw, TrendingUp,
    Loader2, ArrowUpRight, ArrowDownRight, Zap, LogOut, Brain, Download, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Skeleton from './Skeleton';
import Background3DEnhanced from './Background3DEnhanced';
import { useRealTime } from './RealTimeProvider';
import { useToast } from './Toast';
import { useTheme } from '../contexts/ThemeContext';
import NotificationBell from './NotificationBell';
import GlobalSales3D from './GlobalSales3D';
import NLPSearch from './NLPSearch';
import LiveSalesTicker from './LiveSalesTicker';
import AdvancedAnalytics from './AdvancedAnalytics';

// PERFORMANCE: Lazy load heavy components
const PredictiveAnalytics = lazy(() => import('./PredictiveAnalytics'));
const DataExport = lazy(() => import('./DataExport'));
const AnomalyDetection = lazy(() => import('./AnomalyDetection'));
const PerformanceMonitor = lazy(() => import('./PerformanceMonitor'));

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

// PERFORMANCE: Memoize Card component to prevent unnecessary re-renders
const Card = memo(({ title, value, icon: Icon, delay, subtext, trend, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="holographic-card p-4 relative overflow-hidden group hover:shadow-2xl transition-all duration-300 rounded-2xl"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500`}>
            <Icon className={`w-16 h-16 text-${color}-600`} />
        </div>

        <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-xl shadow-sm group-hover:shadow-md transition-shadow`}>
                    <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">{title}</p>
            <h3 className="text-xl font-extrabold mt-1 text-slate-800 tracking-tight">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-2 font-medium">{subtext}</p>}
        </div>
    </motion.div>
));

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [insightsLoading, setInsightsLoading] = useState(false);
    const [insights, setInsights] = useState(null);
    const navigate = useNavigate();
    const { lastEvent } = useRealTime();
    const { addToast } = useToast();
    const { theme } = useTheme();

    const timeOfDay = theme.charAt(0).toUpperCase() + theme.slice(1);

    const handleSearch = (searchData) => {
        console.log('Search performed:', searchData);
    };

    useEffect(() => {
        if (lastEvent) {
            console.log('Real-time update received:', lastEvent);
            fetchData();
        }
    }, [lastEvent]);

    const fetchData = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return;
            }
            const tenantId = 'demo_tenant';

            const response = await api.get(`/dashboard/${tenantId}`);
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [navigate]);

    const handleSync = async () => {
        setSyncing(true);
        addToast('Starting data sync...', 'info');
        try {
            const tenantId = 'demo_tenant';
            await api.post(`/ingest/${tenantId}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            await fetchData();
            addToast('Data synced successfully!', 'success');
        } catch (error) {
            console.error('Sync failed:', error);
            addToast('Sync failed. Please try again.', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleGetInsights = async () => {
        setInsightsLoading(true);
        addToast('Analyzing your data with AI...', 'info');
        try {
            const tenantId = 'demo_tenant';
            const response = await api.post(`/insights/${tenantId}`);
            setInsights(response.data.insights);
            addToast('AI insights generated!', 'success');
        } catch (error) {
            console.error('Failed to get insights:', error);
            addToast('Failed to generate insights', 'error');
        } finally {
            setInsightsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    if (loading) return <Skeleton />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50/30 relative overflow-hidden font-sans text-slate-900">
            <Background3DEnhanced variant="dashboard" />

            {/* Navbar */}
            <nav className="relative z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="w-8 h-8 bg-[#95BF47] rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-display font-bold text-slate-900 tracking-tight hidden sm:block">shopify</span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0 ml-auto">
                            <button
                                onClick={handleSync}
                                disabled={syncing}
                                className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-[#95BF47] transition-all shadow-sm ${syncing ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin text-[#95BF47]' : ''}`} />
                                <span className="hidden lg:inline">{syncing ? 'Syncing...' : 'Sync Data'}</span>
                            </button>

                            <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                            <div className="flex items-center gap-3">
                                <NotificationBell />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#95BF47] to-[#5E8E3E] flex items-center justify-center text-white font-bold text-xs border border-green-200 cursor-pointer hover:scale-105 transition-transform">
                                    JD
                                </div>
                                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* AI Command Center (Moved from Navbar) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-3xl mx-auto mb-8"
                >
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
                            Good {timeOfDay}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Maanas</span>
                        </h2>
                        <p className="text-slate-500">What insights are you looking for today?</p>
                    </div>
                    <NLPSearch onSearch={handleSearch} />
                </motion.div>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Dashboard Overview</h1>
                        <p className="text-slate-500 mt-1">Here's what's happening with your store right now.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Live
                        </span>
                        <span className="text-sm text-slate-400">Last updated: Just now</span>
                    </div>
                </div>

                {/* Live Sales Ticker */}
                <LiveSalesTicker />

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card
                        title="Total Revenue"
                        value={formatCurrency(data?.totalRevenue || 0)}
                        icon={DollarSign}
                        delay={0.1}
                        trend={data?.revenueTrend || 12.5}
                        subtext="vs. last 30 days"
                        color="blue"
                    />
                    <Card
                        title="Total Orders"
                        value={data?.orderCount || 0}
                        icon={ShoppingBag}
                        delay={0.2}
                        trend={data?.ordersTrend || 8.2}
                        subtext="vs. last 30 days"
                        color="indigo"
                    />
                    <Card
                        title="Active Customers"
                        value={data?.customerCount || 0}
                        icon={Users}
                        delay={0.3}
                        trend={data?.customersTrend || 5.3}
                        subtext="vs. last 30 days"
                        color="purple"
                    />
                    <Card
                        title="Total Events"
                        value={data?.eventsCount || 0}
                        icon={Activity}
                        delay={0.4}
                        trend={24.8}
                        subtext="vs. last 30 days"
                        color="pink"
                    />
                </div>

                {/* 3D Global Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-full"
                >
                    <GlobalSales3D />
                </motion.div>

                {/* Advanced Analytics (New Futuristic Feature) */}
                <AdvancedAnalytics />

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 holographic-card p-4 rounded-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Revenue Trends</h3>
                                <p className="text-sm text-slate-500">Daily revenue over the last 30 days</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600">
                                    <Download className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-blue-600">
                                    <Filter className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.chartData || []}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                        itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
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

                    {/* AI Insights Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="holographic-card p-4 rounded-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Brain className="w-32 h-32 text-purple-600" />
                        </div>

                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">AI Insights</h3>
                                    <p className="text-xs text-slate-500">Powered by Groq Intelligence</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                {insightsLoading ? (
                                    <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                                        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                                        <span className="text-sm">Analyzing store data...</span>
                                    </div>
                                ) : insights ? (
                                    insights.map((insight, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-xl border ${insight.type === 'positive' ? 'bg-green-50/50 border-green-100' :
                                                insight.type === 'warning' ? 'bg-amber-50/50 border-amber-100' :
                                                    'bg-blue-50/50 border-blue-100'
                                                }`}
                                        >
                                            <h4 className={`text-sm font-bold mb-1 ${insight.type === 'positive' ? 'text-green-700' :
                                                insight.type === 'warning' ? 'text-amber-700' :
                                                    'text-blue-700'
                                                }`}>{insight.title}</h4>
                                            <p className="text-xs text-slate-600 leading-relaxed">{insight.description}</p>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-slate-500 text-sm mb-4">Get AI-powered recommendations for your store.</p>
                                        <button
                                            onClick={handleGetInsights}
                                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Zap className="w-4 h-4" /> Generate Insights
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Advanced Features Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* AI Sales Forecast */}
                    <Suspense fallback={<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-[400px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
                        <PredictiveAnalytics />
                    </Suspense>

                    {/* Data Export & Anomaly Detection */}
                    <div className="space-y-6">
                        <Suspense fallback={<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-[180px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
                            <DataExport />
                        </Suspense>
                        <Suspense fallback={<div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 h-[180px] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}>
                            <AnomalyDetection />
                        </Suspense>
                    </div>
                </div>

                {/* Recent Orders Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="holographic-card p-6 rounded-2xl overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
                        <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.recentOrders?.map((order) => (
                                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900">#{order.shopifyOrderId || order.id.toString().slice(-6)}</td>
                                        <td className="py-3 px-4 text-sm text-slate-600">{order.customerName}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td className="py-3 px-4 text-sm font-medium text-slate-900">{formatCurrency(order.totalPrice)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.financialStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                                order.financialStatus === 'refunded' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {order.financialStatus}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Performance Monitor */}
                <Suspense fallback={null}>
                    <PerformanceMonitor />
                </Suspense>
            </main>
        </div>
    );
}
