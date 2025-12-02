import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import api from '../api';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hi! I\'m your Shopify Intelligence Assistant. Ask me anything about your store performance, trends, or customer insights.' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                setInput(transcript);
                setIsListening(false);
                // Auto-send after voice input
                handleSend(null, transcript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    // Cleanup: Stop speech when component unmounts
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            recognitionRef.current?.stop();
        };
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setInput('');
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any current speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsSpeaking(false);
            utterance.onerror = () => setIsSpeaking(false);

            // Select a good voice if available
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha'));
            if (preferredVoice) utterance.voice = preferredVoice;

            setIsSpeaking(true);
            window.speechSynthesis.speak(utterance);
        }
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const handleClose = () => {
        // Stop any ongoing speech
        stopSpeaking();
        // Stop voice recognition if active
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        }
        // Close the chatbot
        setIsOpen(false);
    };

    const handleSend = async (e, overrideInput = null) => {
        if (e) e.preventDefault();
        const textToSend = overrideInput || input;

        if (!textToSend.trim()) return;

        const userMessage = textToSend;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const tenantId = 'demo_tenant';
            const res = await api.post(`/chat/${tenantId}`, { message: userMessage });
            const aiResponse = res.data.response;

            setMessages(prev => [...prev, { role: 'system', content: aiResponse }]);

            // Speak the response automatically if it was a voice command or if speaking is enabled
            // For now, let's auto-speak if the user used voice, but since we don't track that state easily across renders without more complex logic,
            // we'll just speak it if the user just spoke. 
            // Actually, let's just speak it. It's "Jarvis" mode.
            speak(aiResponse);

        } catch (error) {
            console.error(error);
            const errorMsg = "I'm having trouble connecting. Please try again.";
            setMessages(prev => [...prev, { role: 'system', content: errorMsg }]);
            speak(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <motion.button
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 transition-transform border-2 border-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => isOpen ? handleClose() : setIsOpen(true)}
            >
                {isOpen ? <X className="text-white w-6 h-6" /> : <MessageSquare className="text-white w-6 h-6" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-96 h-[600px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10">
                                    <Bot className="text-white w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-sm tracking-wide">XENO AI</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        <span className="text-blue-100 text-xs font-medium">Online</span>
                                    </div>
                                </div>
                            </div>
                            {isSpeaking && (
                                <button onClick={stopSpeaking} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <Volume2 className="text-white w-5 h-5 animate-pulse" />
                                </button>
                            )}
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-blue-100' : 'bg-indigo-100'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Sparkles className="w-4 h-4 text-indigo-600" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm max-w-[85%] leading-relaxed ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                        : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            {isListening && (
                                <div className="mb-2 text-center">
                                    <span className="text-xs font-bold text-indigo-600 animate-pulse">Listening... Speak now</span>
                                </div>
                            )}
                            <form onSubmit={(e) => handleSend(e)} className="relative flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleListening}
                                    className={`p-3 rounded-xl transition-all duration-300 ${isListening
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                        }`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>

                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={isListening ? "Listening..." : "Ask Xeno..."}
                                        className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition-all"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || loading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-blue-600/20"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
