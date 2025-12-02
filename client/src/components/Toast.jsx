import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
};

const colors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-rose-500',
    warning: 'from-amber-500 to-orange-500',
    info: 'from-blue-500 to-indigo-500'
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(toast => {
                        const Icon = icons[toast.type];
                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: -50, scale: 0.3 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                                className="pointer-events-auto"
                            >
                                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 pr-12 min-w-[320px] max-w-md relative overflow-hidden">
                                    {/* Gradient bar */}
                                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[toast.type]}`} />

                                    {/* Icon gradient background */}
                                    <div className={`absolute top-0 left-0 w-16 h-full bg-gradient-to-br ${colors[toast.type]} opacity-10`} />

                                    <div className="flex items-start gap-3 relative">
                                        <div className={`p-2 rounded-xl bg-gradient-to-br ${colors[toast.type]} flex-shrink-0`}>
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p className="text-sm font-semibold text-slate-900">{toast.message}</p>
                                        </div>
                                        <button
                                            onClick={() => removeToast(toast.id)}
                                            className="absolute top-0 right-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Progress bar */}
                                    <motion.div
                                        initial={{ width: '100%' }}
                                        animate={{ width: '0%' }}
                                        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                                        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${colors[toast.type]} opacity-50`}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
