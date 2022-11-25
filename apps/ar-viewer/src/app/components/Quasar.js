import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import useStore from '../store';

const Quasar = (props) => {
  const quasarRef = useRef();
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const enterGalleryMode = useStore((state) => state.enterGalleryMode);

  const { scene } = useGLTF(activeQuasar.modelSrc);

  useLayoutEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        //set sRGBEncoding to prevent banding
        node.castShadow = false;
        node.receiveShadow = false;
        node.fulstrumCulled = false;
        node.frustumCulled = false; //
        // removes the inner sphere to avoid z-fighting
        if (node.name.includes('QUASAR_INNER_SPHERE')) {
          node.visible = !isCaught;
          // standardise the env intensity
          node.material.envMapIntensity = 1;
        }
      }
    });
  }, [isCaught, scene]);

  const handleTap = () => {
    if (!isCaught && !isGalleryMode) {
      catchQuasar();
      setTimeout(() => {
        enterGalleryMode();
      }, 500);
      return;
    }
  };

  useFrame((state, delta) => {
    quasarRef.current.rotation.y -= delta * 0.075;
  });

  return (
    <primitive
      onClick={(e) => {
        if (isCaught) return;
        e.stopPropagation();
        handleTap();
      }}
      ref={quasarRef}
      scale={isCaught ? [1, 1, 1] : [0.1, 0.1, 0.1]}
      object={scene}
    />
  );
};

export default Quasar;
