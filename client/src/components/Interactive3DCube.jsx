import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

function Cube(props) {
    const mesh = useRef();
    const [hovered, setHover] = useState(false);
    const [active, setActive] = useState(false);
    useFrame((state, delta) => (mesh.current.rotation.x += delta));
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={() => setActive(!active)}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    );
}

const Interactive3DCube = () => (
    <div className="h-64 w-full">
        <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Cube position={[0, 0, 0]} />
        </Canvas>
    </div>
);
export default Interactive3DCube;
