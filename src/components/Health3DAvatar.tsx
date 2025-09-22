import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

interface Health3DAvatarProps {
  gender: 'male' | 'female';
  health: number; // 0-100
}

// Simple color logic based on health
function getHealthColor(health: number) {
  if (health >= 90) return '#4ade80'; // green
  if (health >= 70) return '#facc15'; // yellow
  if (health >= 40) return '#f97316'; // orange
  return '#ef4444'; // red
}

export function Health3DAvatar({ gender, health }: Health3DAvatarProps) {
  // Use a different shape for male/female as a placeholder
  const color = useMemo(() => getHealthColor(health), [health]);

  return (
    <div style={{ width: 180, height: 180, margin: '0 auto' }}>
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={0.7} />
        {gender === 'male' ? (
          // Male: tall box
          <mesh>
            <boxGeometry args={[1, 1.6, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
        ) : (
          // Female: sphere
          <mesh>
            <sphereGeometry args={[0.8, 32, 32]} />
            <meshStandardMaterial color={color} />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}
