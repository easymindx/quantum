import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import useStore from '../store';

const Quasar = (props) => {
  const quasarRef = useRef();
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const releaseQuasar = useStore((state) => state.releaseQuasar);

  const { scene } = useGLTF(activeQuasar.modelSrc);

  useLayoutEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        node.fulstrumCulled = false;
        node.frustumCulled = false; //
        // removes the inner sphere to avoid z-fighting
        if (node.name.includes('QUASAR_INNER_SPHERE')) {
          node.visible = !isCaught;
        }
      }
    });
  }, [isCaught, scene]);

  const handleTap = () => {
    if (!isCaught && !isGalleryMode) {
      catchQuasar();
      return;
    }

    if (isCaught && !isGalleryMode) {
      if (!isDesktopMode) {
        const { XR8 } = window;
        XR8.XrController.recenter();
      }
      releaseQuasar();
      return;
    }
  };

  // TODO: get the box dimensions of the model and set the scale so that it doesn't clash with the sphere
  // const box = new THREE.Box3().setFromObject(scene);
  useFrame((state, delta) => {
    // if (isCaught) return;
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
