import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import {
    ArrowRight, Shield, Zap, Globe, Database, BarChart3, Brain, Lock, Cloud,
    TrendingUp, Users, Activity, CheckCircle, Star, Sparkles, Server, ShoppingBag,
    MessageSquare, Smartphone, Eye, Layers, Box, Cpu, Network, Workflow, LogIn, UserPlus
} from 'lucide-react';
import Background3DEnhanced from './Background3DEnhanced';
import AnimatedMetrics from './AnimatedMetrics';
import InteractiveCharts from './InteractiveCharts';
import { useSoundEffects } from '../utils/soundManager';

const features = [
    {
        icon: Globe,
        title: "Multi-Tenant Architecture",
        desc: "Isolated data environments for unlimited stores with enterprise-grade security and scalability.",
        color: "from-blue-500 to-cyan-500",
        delay: 0
    },
    {
        icon: Database,
        title: "High-Performance Ingestion",
        desc: "Async processing pipeline capable of handling millions of events per second with Redis queue.",
        color: "from-purple-500 to-pink-500",
        delay: 0.1
    },
    {
        icon: Brain,
        title: "AI-Powered Insights",
        desc: "Deep insights powered by Groq AI analyzing customer behavior, retention cohorts, and revenue forecasting.",
        color: "from-orange-500 to-red-500",
        delay: 0.2
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        desc: "Real-time dashboards with interactive charts, revenue trends, and customer segmentation.",
        color: "from-green-500 to-emerald-500",
        delay: 0.3
    },
    {
        icon: Lock,
        title: "Enterprise Security",
        desc: "JWT authentication, bcrypt encryption, CORS protection, and SQL injection prevention.",
        color: "from-indigo-500 to-blue-500",
        delay: 0.4
    },
    {
        icon: Cloud,
        title: "Cloud-Ready Deployment",
        desc: "Optimized for Vercel, AWS, and other cloud platforms with auto-scaling capabilities.",
        color: "from-teal-500 to-cyan-500",
        delay: 0.5
    },
];

const stats = [
    { value: "99.9%", label: "Uptime", icon: Activity, color: "blue" },
    { value: "< 100ms", label: "Response Time", icon: Zap, color: "purple" },
    { value: "1M+", label: "Events/Day", icon: TrendingUp, color: "indigo" },
    { value: "24/7", label: "Monitoring", icon: Shield, color: "cyan" },
];

const testimonials = [
    {
        name: "Sarah Jenkins",
        role: "CTO, FashionForward",
        content: "Shopify Intelligence transformed how we handle our data. The AI insights are game-changing for our marketing strategy.",
        avatar: "SJ",
        rating: 5
    },
    {
        name: "Michael Chen",
        role: "Founder, TechGear",
        content: "The speed of ingestion is incredible. We process millions of events daily without a hiccup.",
        avatar: "MC",
        rating: 5
    },
    {
        name: "Elena Rodriguez",
        role: "VP of Data, GlobalMart",
        content: "Finally, an analytics platform that is both beautiful and powerful. The dashboard is a joy to use.",
        avatar: "ER",
        rating: 5
    }
];

// Floating particles component
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    animate={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                    }}
                    transition={{
                        duration: Math.random() * 10 + 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}
        </div>
    );
}

// Animated counter component
function AnimatedCounter({ value, suffix = "" }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            const target = parseFloat(value.replace(/[^0-9.]/g, ''));
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    setCount(target);
                    clearInterval(timer);
                } else {
                    setCount(current);
                }
            }, 30);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{Math.floor(count)}{suffix}</span>;
}

export default function LandingPage() {
    const { scrollYProgress } = useScroll();
    const scaleProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const opacityProgress = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
            {/* Advanced 3D Background */}
            <Background3DEnhanced variant="landing" />
            <FloatingParticles />

            {/* Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Navbar with Glassmorphism */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="sticky top-0 z-50 backdrop-blur-xl bg-white/60 border-b border-white/30 shadow-lg shadow-blue-500/10"
            >
                <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
                    <motion.div
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-50" />
                            <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div>
                            <span className="text-2xl font-display font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                shopify
                            </span>
                            <div className="text-xs text-slate-500 font-medium tracking-widest uppercase">Intelligence</div>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, color: "#2563eb" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2.5 text-slate-700 font-bold hover:bg-blue-50 rounded-xl transition-all font-display text-sm flex items-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Sign In</span>
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all font-display relative overflow-hidden group text-sm flex items-center gap-2"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Get Started
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section with Advanced Animations */}
            <main className="relative z-10 max-w-7xl mx-auto px-8 pt-10 pb-32">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="lg:w-1/2 space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 backdrop-blur-sm shadow-lg shadow-blue-500/10"
                        >
                            <Sparkles className="w-5 h-5 text-blue-600" />
                            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider font-display">AI-Powered Intelligence</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-5xl lg:text-6xl font-display font-black tracking-tighter leading-[0.9]"
                        >
                            The Future of{' '}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-gradient">
                                    Commerce
                                </span>
                                <motion.div
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 1.5, duration: 0.6 }}
                                />
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-slate-600 leading-relaxed max-w-lg font-light"
                        >
                            Unlock the hidden potential of your store with the world's most advanced{' '}
                            <span className="font-semibold text-blue-600">AI analytics platform</span>.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex items-center gap-4 pt-4"
                        >
                            <Link to="/register">
                                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:-translate-y-1">
                                    <span>Start Now</span>
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link to="/login">
                                <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all hover:-translate-y-1">
                                    Live Demo
                                </button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="pt-8 flex items-center gap-8"
                        >
                            {[
                                { icon: Shield, text: "Enterprise Security", color: "blue" },
                                { icon: Zap, text: "Real-time Sync", color: "yellow" },
                                { icon: Eye, text: "Live Analytics", color: "purple" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <div className={`p-2 bg-${item.color}-50 rounded-lg`}>
                                        <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-600">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right - Advanced Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="lg:w-1/2 relative perspective-1000"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-3xl blur-3xl animate-pulse-slow" />

                        {/* Main Dashboard Card */}
                        <motion.div
                            whileHover={{ rotateY: 5, rotateX: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            className="relative bg-white/40 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl p-8 transform-gpu"
                            style={{
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {/* Top Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl" />

                            {/* Window Controls */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-500 transition-colors cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-500 transition-colors cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-500 transition-colors cursor-pointer" />
                                </div>
                                <div className="flex gap-1">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    ))}
                                </div>
                            </div>

                            {/* Stats Grid with Advanced Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {[
                                    { label: "Revenue", value: "$124.5K", change: "+12.5%", icon: TrendingUp, color: "blue", gradient: "from-blue-500 to-cyan-500" },
                                    { label: "Users", value: "8,420", change: "+8.2%", icon: Users, color: "purple", gradient: "from-purple-500 to-pink-500" },
                                    { label: "Orders", value: "1,240", change: "+24%", icon: ShoppingBag, color: "indigo", gradient: "from-indigo-500 to-blue-500" },
                                    { label: "Rate", value: "3.8%", change: "+1.2%", icon: Activity, color: "orange", gradient: "from-orange-500 to-amber-500" }
                                ].map((stat, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="relative group"
                                    >
                                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity blur-xl`} />
                                        <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-4 border border-slate-200/50 shadow-lg hover:shadow-xl transition-all">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`p-2 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                                                    <stat.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <span className={`text-xs font-bold px-2 py-1 bg-${stat.color}-50 text-${stat.color}-600 rounded-full`}>
                                                    {stat.change}
                                                </span>
                                            </div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                                {stat.label}
                                            </div>
                                            <div className="text-base font-display font-black text-slate-900">
                                                {stat.value}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Advanced Chart */}
                            <div className="relative h-56 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/50 p-5 shadow-inner overflow-hidden">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue Forecast</span>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-600" />
                                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                                    </div>
                                </div>

                                {/* Animated Bars */}
                                <div className="absolute bottom-5 left-5 right-5 h-40 flex items-end gap-1.5">
                                    {[40, 65, 50, 75, 60, 85, 70, 90, 75, 95, 80, 100].map((height, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{
                                                duration: 1.5,
                                                delay: 0.8 + i * 0.05,
                                                ease: "easeOut"
                                            }}
                                            whileHover={{ scale: 1.1, opacity: 1 }}
                                            className="flex-1 bg-gradient-to-t from-blue-600 via-indigo-600 to-purple-600 rounded-t-lg opacity-80 cursor-pointer relative group shadow-lg"
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                ${(height * 150).toLocaleString()}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Trend Line */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 200">
                                    <motion.path
                                        d="M 20 160 Q 100 140 150 120 T 300 80 T 480 40"
                                        fill="none"
                                        stroke="url(#gradient)"
                                        strokeWidth="3"
                                        strokeDasharray="5 5"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 0.6 }}
                                        transition={{ duration: 2, delay: 1.5 }}
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#3b82f6" />
                                            <stop offset="50%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </motion.div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-3xl shadow-2xl opacity-20 blur-xl"
                        />
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-2xl opacity-20 blur-xl"
                        />
                    </motion.div>
                </div>

                {/* Stats Section with Advanced Counters */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8"
                >
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -10 }}
                            className="group relative"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
                            <div className="relative text-center p-8 bg-white/40 backdrop-blur-md rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all">
                                <div className="flex justify-center mb-4">
                                    <div className={`p-5 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-all`}>
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-display font-black text-slate-900 mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider">
                                    {stat.label}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Interactive 3D Feature Cube Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block mb-6"
                        >
                            <div className="px-6 py-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-full border border-cyan-200/50 shadow-lg">
                                <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider">Explore Features</span>
                            </div>
                        </motion.div>
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Interactive{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
                                Feature Showcase
                            </span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
                            Discover our powerful features designed to boost your sales.
                        </p>
                    </div>
                    {/* Interactive3DCube removed */}
                </motion.div>

                {/* Advanced Animated Metrics Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block mb-6"
                        >
                            <div className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200/50 shadow-lg">
                                <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">Real-Time Analytics</span>
                            </div>
                        </motion.div>
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Live Performance{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Metrics
                            </span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
                            Watch your business metrics come to life with interactive, real-time data visualizations
                        </p>
                    </div>
                    <AnimatedMetrics />
                </motion.div>

                {/* Interactive Charts Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-40"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block mb-6"
                        >
                            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200/50 shadow-lg">
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Data Visualization</span>
                            </div>
                        </motion.div>
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Interactive{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                                Dashboard
                            </span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
                            Explore your data through beautiful, animated charts and gain actionable insights
                        </p>
                    </div>
                    <InteractiveCharts />
                </motion.div>

                {/* How It Works - Premium Design */}
                <div className="mt-40">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block mb-6"
                        >
                            <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50 shadow-lg">
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">How It Works</span>
                            </div>
                        </motion.div>
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Three Simple{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Steps
                            </span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
                            Seamless integration, powerful processing, and intelligent results
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 -z-10" />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "Connect",
                                    desc: "Link your Shopify store with a single click. Secure OAuth connection.",
                                    icon: Globe,
                                    color: "blue",
                                    gradient: "from-blue-500 to-cyan-500"
                                },
                                {
                                    title: "Ingest",
                                    desc: "We sync your products, orders, and customers instantly.",
                                    icon: Server,
                                    color: "indigo",
                                    gradient: "from-indigo-500 to-purple-500"
                                },
                                {
                                    title: "Analyze",
                                    desc: "AI models generate actionable insights and forecasts.",
                                    icon: Brain,
                                    color: "purple",
                                    gradient: "from-purple-500 to-pink-500"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="relative group"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 rounded-3xl blur-2xl transition-opacity`} />
                                    <div className="relative bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all">
                                        {/* Number Badge */}
                                        <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-xl border-4 border-white">
                                            <span className="text-xl font-display font-black text-white">{i + 1}</span>
                                        </div>

                                        {/* Icon */}
                                        <div className="mb-8">
                                            <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-display font-bold text-slate-900 mb-3 text-center">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 text-center leading-relaxed text-base">
                                            {step.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Features Grid - Ultra Premium */}
                <div className="mt-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Everything You Need to{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Scale
                            </span>
                        </h2>
                        <p className="text-base text-slate-600 max-w-2xl mx-auto font-light">
                            Built with cutting-edge technology and designed for performance at scale
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: feature.delay }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="group relative"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-3xl blur-2xl transition-opacity`} />
                                <div className="relative h-full p-8 bg-white/40 backdrop-blur-md border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-base">
                                        {feature.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Testimonials - Premium Cards */}
                <div className="mt-40">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-display font-black text-slate-900 mb-4">
                            Trusted by{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                Industry Leaders
                            </span>
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-3xl blur-2xl transition-opacity" />
                                <div className="relative bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all">
                                    {/* Quote Mark */}
                                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-xl">
                                        <span className="text-3xl text-white font-serif">"</span>
                                    </div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>

                                    <p className="text-slate-700 italic mb-4 leading-relaxed text-base">
                                        {testimonial.content}
                                    </p>

                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                                            <span className="text-xl font-bold text-white">{testimonial.avatar}</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                                            <div className="text-sm text-slate-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTA Section - Ultra Premium */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-40 relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-2xl opacity-20" />
                    <div className="relative p-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl text-center text-white shadow-xl overflow-hidden">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
                        </div>

                        <div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl font-display font-black mb-4"
                            >
                                Ready to Get Started?
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-base opacity-90 mb-8 max-w-2xl mx-auto font-light"
                            >
                                Join thousands of businesses using Shopify Intelligence to power their data
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col sm:flex-row items-center justify-center gap-6"
                            >
                                <Link to="/register">
                                    <motion.button
                                        whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)" }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group"
                                    >
                                        <span>Start Free Trial</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </motion.button>
                                </Link>
                                <Link to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-transparent border border-white text-white rounded-xl font-bold text-base hover:bg-white/10 transition-all"
                                    >
                                        Sign In
                                    </motion.button>
                                </Link>
                            </motion.div>

                            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm opacity-90">
                                {[
                                    { icon: CheckCircle, text: "No credit card required" },
                                    { icon: Star, text: "14-day free trial" },
                                    { icon: Shield, text: "Cancel anytime" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.6 + i * 0.1 }}
                                        className="flex items-center gap-2"
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.text}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 border-t border-slate-200/60 bg-white/30 backdrop-blur-sm"
                >
                    <div className="max-w-7xl mx-auto px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm font-medium text-slate-600">© 2025 Shopify Intelligence. All rights reserved.</p>
                        <div className="flex gap-4">
                            {[Globe, MessageSquare, Smartphone].map((Icon, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ scale: 1.2, y: -2 }}
                                    className="p-2 bg-white/50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer shadow-sm"
                                >
                                    <Icon className="w-5 h-5 text-slate-600 hover:text-blue-600 transition-colors" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
