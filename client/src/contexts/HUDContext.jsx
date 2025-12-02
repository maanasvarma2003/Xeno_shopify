import React, { createContext, useContext, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const HUDContext = createContext();

export const useHUD = () => {
    const context = useContext(HUDContext);
    if (!context) {
        throw new Error('useHUD must be used within a HUDProvider');
    }
    return context;
};

export const HUDProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(true);

    const toggleHUD = () => setIsVisible(prev => !prev);

    return (
        <HUDContext.Provider value={{ isVisible, toggleHUD }}>
            {children}
        </HUDContext.Provider>
    );
};

export const HUDToggle = () => {
    const { isVisible, toggleHUD } = useHUD();
    return (
        <button
            onClick={toggleHUD}
            className="fixed bottom-20 right-4 z-50 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-slate-500 transition-all shadow-lg"
            title={isVisible ? "Hide Interface" : "Show Interface"}
        >
            {isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
    );
};
