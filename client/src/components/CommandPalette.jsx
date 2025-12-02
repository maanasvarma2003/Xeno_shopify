import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, TrendingUp, Users, ShoppingBag, DollarSign, RefreshCw, LogOut, Zap, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const commands = [
        {
            id: 'dashboard',
            label: 'Go to Dashboard',
            icon: TrendingUp,
            action: () => navigate('/dashboard'),
            keywords: 'dashboard home overview'
        },
        {
            id: 'customers',
            label: 'View Customers',
            icon: Users,
            action: () => console.log('Navigate to customers'),
            keywords: 'customers users clients'
        },
        {
            id: 'orders',
            label: 'View Orders',
            icon: ShoppingBag,
            action: () => console.log('Navigate to orders'),
            keywords: 'orders purchases sales'
        },
        {
            id: 'revenue',
            label: 'View Revenue Analytics',
            icon: DollarSign,
            action: () => console.log('Navigate to revenue'),
            keywords: 'revenue money earnings income'
        },
        {
            id: 'sync',
            label: 'Sync Data',
            icon: RefreshCw,
            action: () => window.location.reload(),
            keywords: 'sync refresh reload update'
        },
        {
            id: 'insights',
            label: 'Generate AI Insights',
            icon: Zap,
            action: () => console.log('Generate insights'),
            keywords: 'insights ai analysis recommendations'
        },
        {
            id: 'chat',
            label: 'Open AI Assistant',
            icon: MessageSquare,
            action: () => console.log('Open chatbot'),
            keywords: 'chat assistant ai help support'
        },
        {
            id: 'logout',
            label: 'Logout',
            icon: LogOut,
            action: () => {
                localStorage.clear();
                navigate('/');
            },
            keywords: 'logout signout exit leave'
        }
    ];

    const filteredCommands = commands.filter(cmd =>
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.keywords.toLowerCase().includes(search.toLowerCase())
    );

    const handleKeyDown = useCallback((e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen(prev => !prev);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleCommand = (action) => {
        action();
        setIsOpen(false);
        setSearch('');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
                    />

                    {/* Command Palette */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999] px-4"
                    >
                        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 p-4 border-b border-slate-100">
                                <Search className="w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search commands..."
                                    autoFocus
                                    className="flex-1 bg-transparent text-slate-900 placeholder-slate-400 outline-none text-lg font-medium"
                                />
                                <div className="flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-500">
                                    <Command className="w-3 h-3" />
                                    <span>K</span>
                                </div>
                            </div>

                            {/* Commands List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {filteredCommands.length > 0 ? (
                                    <div className="p-2">
                                        {filteredCommands.map((cmd, index) => {
                                            const Icon = cmd.icon;
                                            return (
                                                <motion.button
                                                    key={cmd.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    onClick={() => handleCommand(cmd.action)}
                                                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Icon className="w-5 h-5 text-white" />
                                                    </div>
                                                    <span className="flex-1 text-left font-semibold text-slate-700 group-hover:text-slate-900">
                                                        {cmd.label}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        <p>No commands found</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                                <span>Type to search commands</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white rounded border border-slate-200">↑</kbd>
                                        <kbd className="px-2 py-1 bg-white rounded border border-slate-200">↓</kbd>
                                        <span>Navigate</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white rounded border border-slate-200">↵</kbd>
                                        <span>Select</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <kbd className="px-2 py-1 bg-white rounded border border-slate-200">Esc</kbd>
                                        <span>Close</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
