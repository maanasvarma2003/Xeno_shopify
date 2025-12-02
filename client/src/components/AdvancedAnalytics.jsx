import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    ScatterChart, Scatter, ZAxis, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { Activity, Map, PieChart, Share2, Layers } from 'lucide-react';

// Mock Data
const heatMapData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: Math.floor(Math.random() * 100),
    intensity: Math.random()
}));

const networkData = [
    { x: 100, y: 200, z: 200, name: 'Cluster A' },
    { x: 120, y: 100, z: 260, name: 'Cluster B' },
    { x: 170, y: 300, z: 400, name: 'Cluster C' },
    { x: 140, y: 250, z: 280, name: 'Cluster D' },
    { x: 150, y: 400, z: 500, name: 'Cluster E' },
    { x: 110, y: 280, z: 200, name: 'Cluster F' },
];

const radarData = [
    { subject: 'Retention', A: 120, B: 110, fullMark: 150 },
    { subject: 'Acquisition', A: 98, B: 130, fullMark: 150 },
    { subject: 'Revenue', A: 86, B: 130, fullMark: 150 },
    { subject: 'Engagement', A: 99, B: 100, fullMark: 150 },
    { subject: 'Satisfaction', A: 85, B: 90, fullMark: 150 },
    { subject: 'Referrals', A: 65, B: 85, fullMark: 150 },
];

const cohortData = [
    { month: 'Jan', retention: [100, 85, 75, 65, 55, 45] },
    { month: 'Feb', retention: [100, 88, 78, 68, 58] },
    { month: 'Mar', retention: [100, 82, 72, 62] },
    { month: 'Apr', retention: [100, 89, 79] },
    { month: 'May', retention: [100, 92] },
    { month: 'Jun', retention: [100] },
];

export default function AdvancedAnalytics() {
    const [activeTab, setActiveTab] = useState('network');

    const getRetentionColor = (value) => {
        if (value >= 90) return 'bg-blue-600';
        if (value >= 75) return 'bg-blue-500';
        if (value >= 60) return 'bg-blue-400';
        if (value >= 45) return 'bg-blue-300';
        return 'bg-blue-200';
    };

    return (
        <div className="space-y-6">
            {/* Control Panel */}
            <div className="flex items-center gap-4 p-2 bg-white/40 backdrop-blur-md rounded-2xl border border-white/40 overflow-x-auto">
                {[
                    { id: 'network', icon: Share2, label: 'Network Graph' },
                    { id: 'heatmap', icon: Map, label: 'Activity Heatmap' },
                    { id: 'radar', icon: Activity, label: 'Performance Radar' },
                    { id: 'cohort', icon: Layers, label: 'Cohort Analysis' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                            : 'text-slate-600 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Visualization Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Chart */}
                <motion.div
                    layoutId="main-chart"
                    className="col-span-1 lg:col-span-2 holographic-card p-6 rounded-3xl min-h-[400px]"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-display font-bold text-slate-900">
                            {activeTab === 'network' && 'Customer Cluster Analysis'}
                            {activeTab === 'heatmap' && 'Global Activity Heatmap'}
                            {activeTab === 'radar' && 'Metric Performance Radar'}
                            {activeTab === 'cohort' && 'Retention Cohorts'}
                        </h3>
                        <div className="flex gap-2">
                            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-xs font-medium text-slate-500">Live Data</span>
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        {activeTab === 'network' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                    <XAxis type="number" dataKey="x" name="stature" hide />
                                    <YAxis type="number" dataKey="y" name="weight" hide />
                                    <ZAxis type="number" dataKey="z" range={[60, 400]} name="score" />
                                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                    <Scatter name="Clusters" data={networkData} fill="#8884d8">
                                        {networkData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'][index % 5]} />
                                        ))}
                                    </Scatter>
                                </ScatterChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'heatmap' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={heatMapData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                                    <XAxis dataKey="hour" />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'radar' && (
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(0,0,0,0.1)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} stroke="rgba(0,0,0,0.1)" />
                                    <Radar name="Current Period" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                                    <Radar name="Previous Period" dataKey="B" stroke="#ec4899" fill="#ec4899" fillOpacity={0.6} />
                                    <Legend />
                                    <Tooltip />
                                </RadarChart>
                            </ResponsiveContainer>
                        )}

                        {activeTab === 'cohort' && (
                            <div className="h-full w-full overflow-auto">
                                <div className="min-w-[500px]">
                                    <div className="flex mb-2">
                                        <div className="w-20 font-bold text-slate-500 text-sm">Cohort</div>
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="flex-1 text-center text-xs text-slate-400 font-medium">Month {i}</div>
                                        ))}
                                    </div>
                                    {cohortData.map((row, i) => (
                                        <div key={i} className="flex items-center mb-2">
                                            <div className="w-20 font-bold text-slate-700 text-sm">{row.month}</div>
                                            <div className="flex-1 flex gap-1">
                                                {row.retention.map((val, j) => (
                                                    <div
                                                        key={j}
                                                        className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer ${getRetentionColor(val)}`}
                                                        title={`${val}% Retention`}
                                                    >
                                                        {val}%
                                                    </div>
                                                ))}
                                                {[...Array(6 - row.retention.length)].map((_, j) => (
                                                    <div key={j} className="flex-1 h-8 bg-slate-50 rounded-md" />
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Secondary Metrics */}
                <div className="holographic-card p-6 rounded-3xl">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Predictive Insights</h4>
                    <div className="space-y-4">
                        {[
                            { label: 'Churn Risk', value: 'Low', color: 'green', desc: 'Top 5% customers are stable' },
                            { label: 'Next Best Action', value: 'Upsell', color: 'blue', desc: 'Recommend Premium Plan to Segment B' },
                            { label: 'Inventory Alert', value: 'Warning', color: 'orange', desc: 'Stock low on "Wireless Headphones"' }
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white/50 border border-white/50 hover:bg-white/80 transition-all cursor-pointer group">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold bg-${item.color}-100 text-${item.color}-600`}>
                                        {item.value}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="holographic-card p-6 rounded-3xl">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Real-Time Feed</h4>
                    <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/40 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <div className="flex-1">
                                    <p className="text-sm text-slate-700">
                                        <span className="font-bold">User {1000 + i}</span> viewed
                                        <span className="text-blue-600 font-medium"> Product X</span>
                                    </p>
                                    <span className="text-[10px] text-slate-400">Just now</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
