import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FloatingObjects() {
  const group = useRef<THREE.Group>(null!);

  useFrame(({ mouse }) => {
    if (!group.current) return;

    // mouse parallax
    group.current.rotation.y = mouse.x * 0.3;
    group.current.rotation.x = mouse.y * 0.2;

    // scroll parallax
    const scrollY = window.scrollY;
    group.current.position.y = -scrollY * 0.002;
  });

  return (
    <group ref={group}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2}>
          <mesh
            position={[
              Math.random() * 6 - 3,
              Math.random() * 4 - 2,
              -5,
            ]}
          >
            <sphereGeometry args={[0.5 + Math.random(), 32, 32]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#ff6b00" : "#ffaa00"}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} />

        <FloatingObjects />
        <Stars radius={80} depth={50} count={2000} factor={4} fade />
      </Canvas>
    </div>
  );
}
