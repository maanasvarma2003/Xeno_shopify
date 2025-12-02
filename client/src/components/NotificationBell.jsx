import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, Users, DollarSign, X, Check } from 'lucide-react';

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'Order #1234 from John Doe - $249.99',
            time: '2 minutes ago',
            read: false,
            icon: ShoppingBag,
            color: 'blue'
        },
        {
            id: 2,
            type: 'customer',
            title: 'New Customer Signup',
            message: 'Sarah Johnson just created an account',
            time: '15 minutes ago',
            read: false,
            icon: Users,
            color: 'purple'
        },
        {
            id: 3,
            type: 'revenue',
            title: 'Revenue Milestone',
            message: 'You\'ve hit $10,000 in sales this month!',
            time: '1 hour ago',
            read: true,
            icon: DollarSign,
            color: 'green'
        }
    ]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const colors = {
        blue: 'from-blue-500 to-indigo-500',
        purple: 'from-purple-500 to-pink-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500'
    };

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-600" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Notification Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                    >
                                        <Check className="w-3 h-3" />
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    <div className="divide-y divide-slate-100">
                                        {notifications.map(notification => {
                                            const Icon = notification.icon;
                                            return (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className={`p-4 hover:bg-slate-50 transition-colors relative group ${!notification.read ? 'bg-blue-50/30' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className={`w-10 h-10 bg-gradient-to-br ${colors[notification.color]} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                                            <Icon className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-semibold text-sm text-slate-900 mb-1">
                                                                {notification.title}
                                                                {!notification.read && (
                                                                    <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full inline-block" />
                                                                )}
                                                            </h4>
                                                            <p className="text-xs text-slate-600 mb-2">{notification.message}</p>
                                                            <p className="text-xs text-slate-400">{notification.time}</p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeNotification(notification.id);
                                                            }}
                                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                        <p>No notifications</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
