import { useSpring, animated } from '@react-spring/three';
import React, { useRef, memo, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';
import useStore from '../store';
import Layer from './Layer';

import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

const Shell = () => {
  const groupRef = useRef();

  const currentLevel = useStore((state) => state.currentLevel);
  const isDesktopMode = useStore((state) => state.isDesktopMode);

  const index = useRef(0);

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    scale: 1,
    rotation: [0, Math.PI, 0],
    config: { friction: 10 },
    immediate: false,
  }));

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
    groupRef.current.rotation.y += delta * 0.075;
  });

  const meshMaterial = {
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    thickness: 5,
    roughness: 0.7,
    clearcoat: 0.8,
    clearcoatRoughness: 0.3,
    transmission: 0.7,
    ior: 1.9,
    envMapIntensity: 15,
    attenuationDistance: 1,
  };

  return (
    <group ref={groupRef}>
      {/* <mesh ref={topDome} position={[0, 1, 0]}>
        <cylinderGeometry attach="geometry" args={[5, 5, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          attach="material"
          {...meshMaterial}
          // color={getHex()}
        />
      </mesh> */}

      <mesh rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <cylinderGeometry attach="geometry" args={[5, 5, 2.5, 32, 1, true]} />
        <meshPhysicalMaterial
          attach="material"
          {...meshMaterial}
          // color={getHex()}
        />
      </mesh>

      {/* <mesh rotation={[0, 0, 0]} position={[0, -1, 0]}>
        <cylinderGeometry attach="geometry" args={[5, 5, 0.5, 32, 1, true]} />
        <meshPhysicalMaterial
          attach="material"
          {...meshMaterial}
          // color={getHex()}
        />
      </mesh> */}

      <animated.group {...spring}>
        <Layer levelIndex={currentLevel} shellRadius={4.25} />
      </animated.group>
    </group>
  );
};

// https://codesandbox.io/s/jflps?file=/src/App.js:2700-2714

export default Shell;
