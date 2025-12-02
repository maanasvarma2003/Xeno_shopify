import { motion } from 'framer-motion';
import { Fingerprint } from 'lucide-react';

const BiometricScan = () => (
    <div className="flex flex-col items-center justify-center p-4">
        <div className="relative">
            <Fingerprint className="w-16 h-16 text-cyan-500/50" />
            <motion.div
                className="absolute inset-0 border-t-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
        </div>
        <p className="mt-2 text-xs text-cyan-400 font-mono tracking-widest animate-pulse">VERIFYING...</p>
    </div>
);
export default BiometricScan;
