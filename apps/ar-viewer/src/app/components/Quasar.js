import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useStore from '../store';

const Quasar = ({ isEngaged, url }, props) => {
  const quasarRef = useRef();
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isGalleryMode = useStore((state) => state.isGalleryMode);

  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const releaseQuasar = useStore((state) => state.releaseQuasar);

  const { scene } = useGLTF(activeQuasar.modelSrc);

  scene.traverse((node) => {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = false;
      node.fulstrumCulled = false;
      node.frustumCulled = false; //
      // removes the inner sphere to avoid z-fighting
      // Uses a timeout to avoid the camare suddenly being placed inside a sphere when the glallery closes
      if (node.name.includes('QUASAR_INNER_SPHERE')) {
        node.visible = !isCaught;
      }
    }
  });

  const handleTap = () => {
    if (!isCaught && !isGalleryMode) {
      catchQuasar();
      return;
    }

    if (isCaught && !isGalleryMode) {
      releaseQuasar();
      return;
    }
  };

  // TODO: get the box dimensions of the model and set the scale so that it doesn't clash with the sphere
  // const box = new THREE.Box3().setFromObject(scene);
  useFrame((state, delta) => {
    if (isCaught) return;
    quasarRef.current.rotation.y -= delta * 0.075;
  });

  return (
    <>
      <primitive
        onClick={(e) => {
          e.stopPropagation();
          handleTap();
        }}
        ref={quasarRef}
        scale={isGalleryMode ? [2, 2, 2] : [0.8, 0.8, 0.8]}
        object={scene}
        position={[0, 0, 0]}
      />
      <hemisphereLight intensity={0.25} />
    </>
  );
};

export default Quasar;
