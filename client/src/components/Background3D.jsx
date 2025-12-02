import { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';

const Background3D = memo(() => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();

        // OPTIMIZED: Reduced particles from 50 to 15 for better performance
        const particleCount = 15;
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3, // Slower movement
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 1
        }));

        let lastTime = Date.now();
        const targetFPS = 30; // OPTIMIZED: Reduced from 60fps to 30fps
        const frameInterval = 1000 / targetFPS;

        const animate = () => {
            const now = Date.now();
            const delta = now - lastTime;

            if (delta > frameInterval) {
                lastTime = now - (delta % frameInterval);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'rgba(59, 130, 246, 0.03)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Draw particles
                particlesRef.current.forEach((p, i) => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                    // Draw particle
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(99, 102, 241, 0.4)';
                    ctx.fill();

                    // OPTIMIZED: Only connect to nearest 2 particles instead of all
                    for (let j = i + 1; j < Math.min(i + 3, particlesRef.current.length); j++) {
                        const p2 = particlesRef.current[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 150) { // Reduced connection distance
                            ctx.beginPath();
                            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 150)})`;
                            ctx.lineWidth = 0.5;
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                });
            }

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate();

        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0" />

            {/* OPTIMIZED: Reduced orbs from 5 to 2 */}
            <motion.div
                animate={{
                    x: [0, 100, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -80, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-20 right-20 w-[32rem] h-[32rem] bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
            />

            {/* OPTIMIZED: Removed 3D shapes and extra particles for performance */}
        </div>
    );
});

Background3D.displayName = 'Background3D';

export default Background3D;
