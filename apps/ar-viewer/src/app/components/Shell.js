import { useSpring, animated } from '@react-spring/three';
import {
  CubeCamera,
  MeshReflectorMaterial,
  Sparkles,
  useGLTF,
} from '@react-three/drei';
import React, { useRef, memo, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import useStore from '../store';
import Layer from './Layer';
// import clamp from 'lodash.clamp';
// import { useDrag } from 'react-use-gesture';
import { useFrame } from '@react-three/fiber';

const Shell = () => {
  const groupRef = useRef();
  const topDome = useRef();

  const activeQuasar = useStore((state) => state.activeQuasar);
  const currentLevel = useStore((state) => state.currentLevel);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const { scene } = useGLTF(activeQuasar.modelSrc);

  const quasar = scene;

  useEffect(() => {
    if (!topDome.current) return;
    quasar.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        node.fulstrumCulled = false;
        node.frustumCulled = false;
        if (node.name === 'QUASAR_SKIN_OUT_M_003') {
          topDome.current.material = node.material;
        }
      }
    });
  }, [activeQuasar, quasar]);

  const index = useRef(0);

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    scale: 1,
    rotation: [0, Math.PI, 0],
    config: { friction: 10 },
    immediate: true,
  }));

  // const bind = useDrag(
  //   ({ active, movement: [mx, my], direction: [yDir], cancel }) => {
  //     if (active && Math.abs(my) >= 250) {
  //       if (my > 0) {
  //         if (index.current >= activeQuasar.gallery.length - 1) return;
  //         setCurrentLevel(currentLevel + 1);
  //         index.current++;
  //       } else {
  //         if (index.current <= 0) return;
  //         setCurrentLevel(currentLevel - 1);
  //         index.current--;
  //       }
  //       cancel();
  //     }
  //     api.start((i) => {
  //       return {
  //         position: [0, active ? clamp(-my / 20) : 0, 0],
  //         scale: 1,
  //       };
  //     });
  //   },
  //   {
  //     axis: 'y',
  //     from: () => [0, 0],
  //     delay: 0,
  //     bounds: { top: -400, bottom: 400 },
  //     ubberband: false,
  //     pointer: {
  //       lock: true,
  //       touch: true,
  //     },
  //   }
  // );

  useEffect(() => {
    if (currentLevel === index.current) return;
    index.current = currentLevel;

    // animate spring
    api.start((i) => {
      return {
        position: [0, 10, 0],
        scale: 1,
      };
    });

    setTimeout(() => {
      api.start((i) => {
        return {
          position: [0, 0, 0],
          scale: 1,
        };
      });
    }, 500);
  }, [api, currentLevel]);

  useFrame((state, delta) => {
    if (!isDesktopMode) return;
    groupRef.current.rotation.y -= delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      <mesh ref={topDome}>
        <sphereGeometry
          attach="geometry"
          args={[13, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          attach="material"
          side={THREE.DoubleSide}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      <mesh>
        <sphereGeometry
          attach="geometry"
          args={[13.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.7]}
        />
        <meshPhysicalMaterial
          attach="material"
          color={'#ffffff'}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.5}
          thickness={3}
          roughness={0.6}
          clearcoat={0.9}
          clearcoatRoughness={0.3}
          transmission={1}
          ior={1.9}
          envMapIntensity={25}
          attenuationDistance={5}
        />
      </mesh>

      <animated.group {...spring}>
        <Layer levelIndex={currentLevel} />
      </animated.group>
    </group>
  );
};

// https://codesandbox.io/s/jflps?file=/src/App.js:2700-2714

export default memo(Shell);
