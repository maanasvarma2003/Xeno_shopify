import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Sparkles, TrendingUp, Users, DollarSign, Calendar, Filter, Zap, X, Loader2, MessageSquare } from 'lucide-react';
import api from '../api';

export default function NLPSearch({ onSearch }) {
    const [query, setQuery] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [aiResponse, setAiResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const recognitionRef = useRef(null);

    // Sample suggestions based on NLP patterns
    const nlpSuggestions = [
        {
            text: "Show me customers who bought more than $500 last month",
            icon: Users,
            color: "blue",
            action: () => ({ type: 'customers', filter: { spent: { gt: 500 }, period: 'last_month' } })
        },
        {
            text: "Export last month's sales as PDF",
            icon: DollarSign,
            color: "green",
            action: () => ({ type: 'export', format: 'pdf', data: 'sales', period: 'last_month' })
        },
        {
            text: "Top 10 products by revenue this year",
            icon: TrendingUp,
            color: "purple",
            action: () => ({ type: 'products', sort: 'revenue', limit: 10, period: 'this_year' })
        },
        {
            text: "Customers who haven't purchased in 30 days",
            icon: Calendar,
            color: "orange",
            action: () => ({ type: 'customers', filter: { last_purchase: { gt: 30 } } })
        },
        {
            text: "Orders above $1000 in the last week",
            icon: Filter,
            color: "indigo",
            action: () => ({ type: 'orders', filter: { amount: { gt: 1000 }, period: 'last_week' } })
        }
    ];

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                setIsListening(false);
                handleSearch(transcript);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setShowSuggestions(false);
        setAiResponse(null);

        try {
            // Call Backend AI (Groq)
            const tenantId = 'demo_tenant';
            const response = await api.post(`/chat/${tenantId}`, {
                message: searchQuery,
                context: { page: 'dashboard' }
            });

            setAiResponse({
                text: response.data.response || "I processed your request.",
                type: 'success'
            });

            if (onSearch) {
                onSearch({
                    original: searchQuery,
                    aiReply: response.data.response,
                    timestamp: new Date().toISOString()
                });
            }

        } catch (error) {
            console.error("AI Search Error:", error);
            setAiResponse({
                text: "Sorry, I couldn't process that request right now. Please check your connection or try again.",
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleVoice = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        setAiResponse(null);

        if (value.length > 2) {
            const filtered = nlpSuggestions.filter(s =>
                s.text.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (suggestion) => {
        setQuery(suggestion.text);
        setShowSuggestions(false);
        handleSearch(suggestion.text);
    };

    return (
        <div className="relative w-full z-50">
            {/* Search Input */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
            >
                <div className={`relative neuglass-card p-1 transition-all duration-300 ${loading ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}>
                    <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3">
                        <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />

                        <input
                            type="text"
                            value={query}
                            onChange={handleInputChange}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                            placeholder="Ask AI... (e.g., 'Show top customers')"
                            className="flex-1 bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium min-w-0 text-sm sm:text-base"
                        />

                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                            {query && (
                                <button
                                    onClick={() => { setQuery(''); setAiResponse(null); }}
                                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleVoice}
                                className={`p-2 rounded-lg transition-all ${isListening
                                    ? 'bg-red-500 text-white pulse-glow'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                    }`}
                            >
                                <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSearch(query)}
                                disabled={loading}
                                className={`px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                <span className="hidden sm:inline">Ask AI</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* AI Processing Indicator */}
                    {loading && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 animate-pulse rounded-b-2xl" />
                    )}
                </div>

                {/* AI Response Panel */}
                <AnimatePresence>
                    {aiResponse && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            className="absolute top-full mt-2 w-full neuglass-card overflow-hidden z-50 shadow-2xl"
                        >
                            <div className={`p-4 border-l-4 ${aiResponse.type === 'error' ? 'border-red-500 bg-red-50/50' : 'border-blue-500 bg-blue-50/50'}`}>
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg ${aiResponse.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {aiResponse.type === 'error' ? <Zap className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold mb-1 ${aiResponse.type === 'error' ? 'text-red-800' : 'text-blue-800'}`}>
                                            {aiResponse.type === 'error' ? 'Error' : 'AI Assistant'}
                                        </h4>
                                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                                            {aiResponse.text}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setAiResponse(null)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Smart Suggestions Dropdown */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute top-full mt-2 w-full neuglass-card p-2 z-40 shadow-2xl"
                        >
                            <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-200/50">
                                <Zap className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                                    Smart Suggestions
                                </span>
                            </div>

                            {suggestions.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => selectSuggestion(suggestion)}
                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 transition-all text-left group"
                                >
                                    <div className={`p-2 bg-${suggestion.color}-50 rounded-lg group-hover:scale-110 transition-transform`}>
                                        <suggestion.icon className={`w-4 h-4 text-${suggestion.color}-600`} />
                                    </div>
                                    <span className="flex-1 text-sm text-slate-700 font-medium group-hover:text-blue-600 transition-colors">
                                        {suggestion.text}
                                    </span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Quick Action Chips */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide"
            >
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Quick actions:</span>
                {nlpSuggestions.slice(0, 3).map((suggestion, index) => (
                    <motion.button
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-3 py-1.5 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-full text-xs font-medium text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all whitespace-nowrap"
                    >
                        {suggestion.text.substring(0, 30)}...
                    </motion.button>
                ))}
            </motion.div>
        </div>
    );
}
