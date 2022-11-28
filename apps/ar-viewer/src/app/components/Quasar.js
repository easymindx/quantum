import React, { useLayoutEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import useStore from '../store';

const Quasar = (props) => {
  const quasarRef = useRef();
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const isDesktopMode = useStore((state) => state.isDesktopMode);

  const { scene } = useGLTF(activeQuasar.modelSrc);
  const { gl } = useThree();

  const maxAnisotropy = gl.capabilities.getMaxAnisotropy();

  useLayoutEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        node.fulstrumCulled = true;
        node.frustumCulled = true; //
        // removes the inner sphere to avoid z-fighting
        if (node.name.includes('QUASAR_INNER_SPHERE')) {
          setTimeout(
            () => {
              node.visible = !isCaught;
            },
            isCaught ? 0 : 250
          );
        }

        node.material.envMapIntensity = 1.5;
        node.material.maxAnisotropy = maxAnisotropy;
      }
    });
  }, [isCaught, activeQuasar, scene, maxAnisotropy]);

  const recenter = () => {
    if (isDesktopMode) return;
    const { XR8 } = window;
    XR8.XrController.recenter();
  };

  const handleTap = () => {
    if (!isCaught) {
      recenter();
      catchQuasar();
      return;
    }
  };

  useFrame((state, delta) => {
    if (isCaught) return;
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
      scale={[0.03, 0.03, 0.03]}
      rotation={activeQuasar?.initialRotation}
      object={scene}
    />
  );
};

export default Quasar;
