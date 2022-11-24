import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

const Model = ({ src }) => {
  const { scene } = useGLTF(src);
  return (
    <group
      scale={[0.4, 0.4, 0.4]}
      position={[0, 2, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={scene} />
    </group>
  );
};

const ModelViewer = ({ src }) => {
  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    <Canvas
      style={{ height: dimensions.height, width: dimensions.width }}
      pixelRatio={[1, 2]}
      camera={{ position: [-10, 15, 15], fov: 50 }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} />
      <Suspense fallback={null}>
        <Model src={src} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

export default ModelViewer;
