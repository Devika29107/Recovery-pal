import React from 'react';
import { MeshStandardMaterial, SphereGeometry } from 'three';
import { Canvas } from '@react-three/fiber';

export function SimpleAvatar({ adherenceLevel }: { adherenceLevel: number }) {
  // Determine color based on adherence level
  const color = adherenceLevel > 80 ? '#4CAF50' : adherenceLevel > 50 ? '#FFC107' : '#F44336';

  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </Canvas>
  );
}