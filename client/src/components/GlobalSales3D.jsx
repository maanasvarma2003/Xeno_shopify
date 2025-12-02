import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';

function Globe({ data }) {
    const meshRef = useRef();
    const groupRef = useRef();

    // Rotate the globe
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    // Generate random points for "sales"
    const points = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 50; i++) {
            const phi = Math.acos(-1 + (2 * i) / 50);
            const theta = Math.sqrt(50 * Math.PI) * phi;
            const x = 2.5 * Math.cos(theta) * Math.sin(phi);
            const y = 2.5 * Math.sin(theta) * Math.sin(phi);
            const z = 2.5 * Math.cos(phi);
            temp.push({ position: [x, y, z], value: Math.floor(Math.random() * 1000) });
        }
        return temp;
    }, []);

    return (
        <group>
            {/* The Earth Sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2.5, 64, 64]} />
                <meshStandardMaterial
                    color="#1e293b"
                    emissive="#0f172a"
                    emissiveIntensity={0.5}
                    roughness={0.7}
                    metalness={0.5}
                    wireframe={true}
                />
            </mesh>

            {/* Inner Glow */}
            <mesh>
                <sphereGeometry args={[2.45, 64, 64]} />
                <meshBasicMaterial color="#000" />
            </mesh>

            {/* Sales Data Points */}
            <group ref={groupRef}>
                {points.map((point, i) => (
                    <mesh key={i} position={point.position}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color="#4ade80" toneMapped={false} />
                        <Html distanceFactor={10}>
                            <div className="opacity-0 hover:opacity-100 transition-opacity bg-black/80 text-white text-[10px] p-1 rounded pointer-events-none whitespace-nowrap border border-green-500/30">
                                Sale: ${point.value}
                            </div>
                        </Html>
                    </mesh>
                ))}
            </group>
        </group>
    );
}

export default function GlobalSales3D() {
    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-slate-900 relative border border-slate-800 shadow-2xl">
            <div className="absolute top-4 left-4 z-10">
                <h3 className="text-white font-bold text-lg tracking-tight">Global Live Sales</h3>
                <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-slate-400 text-xs">Real-time Activity</span>
                </div>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#4ade80" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                <Globe />

                <OrbitControls
                    enableZoom={false}
                    autoRotate={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    );
}
