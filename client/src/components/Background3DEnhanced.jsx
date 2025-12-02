import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ position, color, speed }) {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * speed;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * speed * 0.5;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

function Particles() {
    const points = useRef();

    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(2000 * 3);
        for (let i = 0; i < 2000; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return positions;
    }, []);

    useFrame((state) => {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    });

    return (
        <points ref={points}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particlesPosition.length / 3}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#a5b4fc"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

export default function Background3DEnhanced({ variant = 'default' }) {
    console.log('Background3DEnhanced v4 rendering, variant:', variant);
    const colors = {
        landing: ['#60a5fa', '#c084fc', '#fb923c'],
        login: ['#3b82f6', '#6366f1', '#8b5cf6'],
        register: ['#3b82f6', '#6366f1', '#8b5cf6'],
        dashboard: ['#3b82f6', '#8b5cf6', '#ec4899'],
        default: ['#60a5fa', '#c084fc', '#fb923c']
    };

    // FAIL-SAFE: If variant is not found, use default. If default is somehow missing, use hardcoded array.
    // This guarantees selectedColors is ALWAYS an array of 3 strings.
    const selectedColors = Array.isArray(colors[variant]) ? colors[variant] : ['#60a5fa', '#c084fc', '#fb923c'];

    // Absolute crash prevention
    if (!selectedColors || selectedColors.length < 3) {
        console.warn('Background3DEnhanced: Invalid colors, skipping render');
        return null;
    }

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Gradient Orbs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            {/* 3D Canvas */}
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            >
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#a5b4fc" />

                <AnimatedSphere position={[-4, 2, -5]} color={selectedColors[0]} speed={0.3} />
                <AnimatedSphere position={[4, -2, -8]} color={selectedColors[1]} speed={0.2} />
                <AnimatedSphere position={[0, 3, -6]} color={selectedColors[2]} speed={0.25} />

                <Particles />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2}
                />
            </Canvas>

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/40 pointer-events-none" />
        </div>
    );
}
