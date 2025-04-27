// DebugTest.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, Debug, useBox, usePlane } from '@react-three/cannon';

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="lightgreen" />
    </mesh>
  );
}

function Box() {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 4, 0],
		args: [2, 2, 2]
  }));

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" transparent opacity={0.5}
			  polygonOffsetFactor={1}
				polygonOffsetUnits={1} />
    </mesh>
  );
}

export default function DebugTest() {
  return (
    <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[5, 10, 5]} />
      <OrbitControls />
      <Physics gravity={[0, -9.81, 0]}>
        <Debug color="black" scale={1.09}>
          <Ground />
          <Box />
        </Debug>
      </Physics>
    </Canvas>
  );
}
