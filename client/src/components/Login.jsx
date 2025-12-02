import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2, ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react';
import api from '../api';
import { useSoundEffects } from '../utils/soundManager';

/**
 * Login Component - User login page with premium light-themed UI/UX
 * Matches the design language of the Register page for consistency.
 */
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();
    const { playClick, playSuccess, playError } = useSoundEffects();

    const handleSubmit = async (e) => {
        e.preventDefault();
        playClick();
        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            playSuccess();

            // Small delay for success animation
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        } catch (err) {
            playError();
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Subtle animated background pattern */}
            <div className="fixed inset-0 opacity-[0.03]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            {/* Floating soft gradient orbs */}
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

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full max-w-md z-10"
            >
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

                {/* Card */}
                <div className="relative bg-white/80 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/60">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-3 mb-6">
                            <motion.div
                                className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ShoppingBag className="w-7 h-7 text-white" />
                            </motion.div>
                            <div className="text-left">
                                <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                                    shopify
                                </span>
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Intelligence</div>
                            </div>
                        </Link>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl font-black text-slate-900"
                        >
                            Welcome Back
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-600 mt-2 text-sm"
                        >
                            Sign in to access your dashboard
                        </motion.p>
                    </div>

                    {/* Error Message */}
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                    {error}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                                    animate={focusedField === 'email' ? { opacity: 0.4, scale: 1.02 } : {}}
                                />
                                <div className="relative flex items-center">
                                    <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors z-10" />
                                    <motion.input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                                        placeholder="you@company.com"
                                        required
                                        whileFocus={{ scale: 1.01 }}
                                    />
                                    <AnimatePresence>
                                        {email && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                className="absolute right-4"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Password</label>
                            <div className="relative group">
                                <motion.div
                                    className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"
                                    animate={focusedField === 'password' ? { opacity: 0.4, scale: 1.02 } : {}}
                                />
                                <div className="relative flex items-center">
                                    <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors z-10" />
                                    <motion.input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:border-purple-500 focus:bg-white transition-all font-medium"
                                        placeholder="••••••••"
                                        required
                                        whileFocus={{ scale: 1.01 }}
                                    />
                                    <AnimatePresence>
                                        {password && (
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                                className="absolute right-4"
                                            >
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                            <span className="relative flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition">
                                Start Free Trial
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
