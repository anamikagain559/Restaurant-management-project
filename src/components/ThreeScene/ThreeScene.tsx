import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas>
        <ambientLight intensity={1} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
