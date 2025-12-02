import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2, ShoppingBag, Sparkles, CheckCircle2, ArrowRight, Star, Zap } from 'lucide-react';
import api from '../api';

/**
 * Register Component - User registration page with premium UI/UX
 * 
 * Features:
 * - Real-time form validation with visual feedback
 * - Animated glassmorphic design
 * - Responsive layout with feature showcase
 * - Accessibility-friendly with ARIA labels
 * 
 * @returns {JSX.Element} Registration page component
 */
export default function Register() {
    // Form state management
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();

    /**
     * Handle form input changes
     */
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register', formData);

            // Store auth data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Small delay for success animation
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please try again.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Feature cards data
    const features = [
        {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Real-time analytics and insights",
            color: "from-blue-500 to-blue-600"
        },
        {
            icon: Star,
            title: "AI Powered",
            desc: "Smart predictions and recommendations",
            color: "from-purple-500 to-purple-600"
        },
        {
            icon: Sparkles,
            title: "Premium Support",
            desc: "24/7 dedicated assistance",
            color: "from-pink-500 to-pink-600"
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Subtle animated background pattern */}
            <div className="fixed inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            {/* Floating soft gradient orbs for visual depth */}
            <motion.div
                className="absolute top-20 left-10 w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl"
                animate={{
                    x: [0, 100, 0],
                    y: [0, -100, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl"
                animate={{
                    x: [0, -100, 0],
                    y: [0, 100, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
            <motion.div
                className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl"
                animate={{
                    x: [-100, 100, -100],
                    y: [100, -100, 100],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Floating particles for ambient animation */}
            {[...Array(20)].map((_, index) => (
                <motion.div
                    key={`particle-${index}`}
                    className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            {/* Main container with two-column layout */}
            <div className="relative w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center z-10">
                {/* Left side - Feature showcase (hidden on mobile) */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:block"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                            Welcome to the Future
                        </h1>
                        <p className="text-xl text-slate-600 mb-8">
                            Join thousands of businesses transforming their Shopify experience with AI-powered insights.
                        </p>
                    </motion.div>

                    {/* Feature cards */}
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.02, x: 10 }}
                                className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                            >
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                                    <p className="text-sm text-slate-600">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Stats display */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 grid grid-cols-3 gap-4"
                    >
                        {[
                            { value: "10K+", label: "Active Users" },
                            { value: "4.9/5", label: "Rating" },
                            { value: "99.9%", label: "Uptime" }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-xs text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Right side - Registration form */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative"
                >
                    {/* Subtle glow effect around the card */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000"></div>

                    {/* Main registration card */}
                    <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/60">
                        {/* Animated badge at top */}
                        <motion.div
                            className="absolute -top-4 left-1/2 -translate-x-1/2"
                            animate={{
                                rotate: [0, 360],
                                y: [0, -5, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center gap-2 shadow-lg">
                                <Sparkles className="w-4 h-4 text-white" />
                                <span className="text-xs font-bold text-white">14 Days Free Trial</span>
                            </div>
                        </motion.div>

                        {/* Header section */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-center mb-8 mt-4"
                        >
                            <Link to="/" className="inline-flex items-center justify-center gap-3 mb-4" aria-label="Go to homepage">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                                >
                                    <ShoppingBag className="w-7 h-7 text-white" aria-hidden="true" />
                                </motion.div>
                                <div className="text-left">
                                    <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                        shopify
                                    </span>
                                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Intelligence</div>
                                </div>
                            </Link>
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-3xl font-black text-slate-900 mb-2"
                            >
                                Create Account
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-slate-600 text-sm"
                            >
                                Start your journey with smart analytics
                            </motion.p>
                        </motion.div>

                        {/* Error message display */}
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                                    role="alert"
                                    aria-live="polite"
                                >
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Registration form */}
                        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                            {/* Name field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                                        animate={focusedField === 'name' ? { opacity: 0.4, scale: 1.02 } : {}}
                                    />
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition" aria-hidden="true" />
                                        <motion.input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            whileFocus={{ scale: 1.01 }}
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all"
                                            placeholder="John Doe"
                                            required
                                            aria-required="true"
                                            aria-invalid={error ? "true" : "false"}
                                        />
                                        <AnimatePresence>
                                            {formData.name && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                    className="absolute right-4"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Valid input" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Email field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                                        animate={focusedField === 'email' ? { opacity: 0.4, scale: 1.02 } : {}}
                                    />
                                    <div className="relative flex items-center">
                                        <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-purple-500 transition" aria-hidden="true" />
                                        <motion.input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            whileFocus={{ scale: 1.01 }}
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all"
                                            placeholder="you@company.com"
                                            required
                                            aria-required="true"
                                            aria-invalid={error ? "true" : "false"}
                                        />
                                        <AnimatePresence>
                                            {formData.email && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                    className="absolute right-4"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Valid input" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Password field */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative group">
                                    <motion.div
                                        className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                                        animate={focusedField === 'password' ? { opacity: 0.4, scale: 1.02 } : {}}
                                    />
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-pink-500 transition" aria-hidden="true" />
                                        <motion.input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            whileFocus={{ scale: 1.01 }}
                                            className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-pink-500 focus:bg-white transition-all"
                                            placeholder="••••••••"
                                            required
                                            aria-required="true"
                                            aria-invalid={error ? "true" : "false"}
                                            minLength={6}
                                        />
                                        <AnimatePresence>
                                            {formData.password && (
                                                <motion.div
                                                    initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                    className="absolute right-4"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" aria-label="Valid input" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Submit button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                                    whileTap={{ scale: loading ? 1 : 0.98 }}
                                    className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    aria-busy={loading}
                                >
                                    {/* Button shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                                    <span className="relative flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                                                <span>Creating account...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>Get Started</span>
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                            </>
                                        )}
                                    </span>
                                </motion.button>
                            </motion.div>
                        </form>

                        {/* Footer with login link */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            className="mt-6 text-center"
                        >
                            <p className="text-sm text-slate-600">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition">
                                    Sign In
                                </Link>
                            </p>
                        </motion.div>

                        {/* Trust badges */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mt-6 pt-6 border-t border-slate-200"
                        >
                            <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                                    <span>No credit card required</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
                                    <span>Cancel anytime</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
