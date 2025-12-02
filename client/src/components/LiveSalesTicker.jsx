import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, ShoppingBag, MapPin, Clock } from 'lucide-react';

export default function LiveSalesTicker() {
    const [sales, setSales] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Simulate live sales data (in production, this would come from WebSocket)
    useEffect(() => {
        const generateSale = () => {
            const products = [
                'Premium Headphones', 'Smart Watch', 'Wireless Keyboard',
                'Gaming Mouse', 'USB-C Cable', '4K Monitor', 'Laptop Stand',
                'Phone Case', 'Power Bank', 'Webcam'
            ];

            const locations = [
                { city: 'New York', country: 'USA', flag: '🇺🇸' },
                { city: 'London', country: 'UK', flag: '🇬🇧' },
                { city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
                { city: 'Paris', country: 'France', flag: '🇫🇷' },
                { city: 'Sydney', country: 'Australia', flag: '🇦🇺' },
                { city: 'Toronto', country: 'Canada', flag: '🇨🇦' },
                { city: 'Berlin', country: 'Germany', flag: '🇩🇪' },
                { city: 'Dubai', country: 'UAE', flag: '🇦🇪' }
            ];

            const product = products[Math.floor(Math.random() * products.length)];
            const location = locations[Math.floor(Math.random() * locations.length)];
            const amount = (Math.random() * 500 + 50).toFixed(2);

            return {
                id: Date.now() + Math.random(),
                product,
                amount,
                location,
                time: new Date().toLocaleTimeString(),
            };
        };

        // Add initial sales
        const initialSales = Array.from({ length: 5 }, generateSale);
        setSales(initialSales);

        // Add new sale every 3-5 seconds
        const interval = setInterval(() => {
            const newSale = generateSale();
            setSales(prev => [newSale, ...prev].slice(0, 20)); // Keep last 20 sales
        }, Math.random() * 2000 + 3000);

        return () => clearInterval(interval);
    }, []);

    // Auto-rotate visible sale
    useEffect(() => {
        if (sales.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % Math.min(sales.length, 5));
        }, 4000);

        return () => clearInterval(timer);
    }, [sales.length]);

    if (sales.length === 0) return null;

    const currentSale = sales[currentIndex];

    return (
        <div className="relative">
            {/* Main Ticker Display */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="holographic-card rounded-2xl p-4 overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Live Sales Feed
                        </h3>
                    </div>
                    <div className="text-xs font-medium px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {sales.length} recent
                    </div>
                </div>

                {/* Current Sale Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSale.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="neuglass-card p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <ShoppingBag className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{currentSale.product}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Clock className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs text-slate-500">{currentSale.time}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="flex items-center gap-1 text-green-600 font-black text-xl">
                                    <DollarSign className="w-5 h-5" />
                                    <span>{currentSale.amount}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                                {currentSale.location.flag} {currentSale.location.city}, {currentSale.location.country}
                            </span>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {[...Array(Math.min(sales.length, 5))].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: currentIndex === i ? 1.2 : 1,
                                backgroundColor: currentIndex === i ? '#3b82f6' : '#cbd5e1'
                            }}
                            className="w-2 h-2 rounded-full transition-all"
                        />
                    ))}
                </div>
            </motion.div>

            {/* Mini Sales List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 space-y-2"
            >
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
                    Recent Transactions
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {sales.slice(0, 5).map((sale, index) => (
                        <motion.div
                            key={sale.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-3 rounded-xl bg-white/40 backdrop-blur-sm border border-white/40 hover:bg-white/60 transition-all group ${index === currentIndex ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3 flex-1">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 truncate">
                                        {sale.product}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {sale.location.flag} {sale.location.city}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-green-600">
                                    ${sale.amount}
                                </div>
                                <div className="text-xs text-slate-400">
                                    {sale.time.split(':').slice(0, 2).join(':')}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Animated Background Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-2xl -z-10 animate-pulse" />
        </div>
    );
}
