import { useSpring, animated } from '@react-spring/three';
import { MeshReflectorMaterial, Sparkles, useGLTF } from '@react-three/drei';
import React, { useRef, memo, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import useStore from '../store.js';
import Level from './Level.js';
import clamp from 'lodash.clamp';
import { useDrag } from 'react-use-gesture';
import { useFrame } from 'react-three-fiber';

const geometryTop = new THREE.SphereBufferGeometry(
  14,
  32,
  32,
  0,
  Math.PI * 2,
  0,
  Math.PI / 2
);
const innerGeometry = new THREE.SphereBufferGeometry(
  13,
  32,
  32,
  0,
  Math.PI * 2,
  0,
  Math.PI / 1.7
);

const innerMaterial = new THREE.MeshPhysicalMaterial({
  thickness: 3,
  roughness: 0.6,
  clearcoat: 0.9,
  clearcoatRoughness: 0.3,
  transmission: 1,
  ior: 1.9,
  envMapIntensity: 0,
  color: '#fff',
  attenuationDistance: 5,
  transparent: true,
  opacity: 0.8,
  side: THREE.DoubleSide,
});

const shellMaterial = new THREE.MeshStandardMaterial({
  color: '#fff',
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7,
});

const Shell = () => {
  const groupRef = useRef();
  const topDome = useRef();

  const activeQuasar = useStore((state) => state.activeQuasar);
  const currentLevel = useStore((state) => state.currentLevel);
  const setCurrentLevel = useStore((state) => state.setCurrentLevel);

  const { scene } = useGLTF(activeQuasar.modelSrc);

  useEffect(() => {
    if (!topDome.current) return;
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        node.fulstrumCulled = false;
        node.frustumCulled = false; //
        if (node.name === 'QUASAR_SKIN_OUT_M_003') {
          topDome.current.material = node.material;
          topDome.current.material.needsUpdate = true;
          topDome.current.material.envMapIntensity = 2;
          topDome.current.material.roughness = 0.5;
          topDome.current.material.metalness = 0.5;
        }
      }
    });
  }, [activeQuasar]);

  const index = useRef(0);

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    scale: 1,
    rotation: [0, Math.PI, 0],
    config: { friction: 10 },
    immediate: true,
  }));

  const bind = useDrag(
    ({ active, movement: [mx, my], direction: [yDir], cancel }) => {
      if (active && Math.abs(my) >= 250) {
        if (my > 0) {
          if (index.current >= activeQuasar.gallery.length - 1) return;
          setCurrentLevel(currentLevel + 1);
          index.current++;
        } else {
          if (index.current <= 0) return;
          setCurrentLevel(currentLevel - 1);
          index.current--;
        }
        cancel();
      }
      api.start((i) => {
        return {
          position: [0, active ? clamp(-my / 20) : 0, 0],
          scale: 1,
        };
      });
    },
    {
      axis: 'y',
      from: () => [0, 0],
      delay: 0,
      bounds: { top: -400, bottom: 400 },
      ubberband: false,
      pointer: {
        lock: true,
        touch: true,
      },
    }
  );

  // useFrame((state, delta) => {
  //   groupRef.current.rotation.y -= delta * 0.3;
  // });

  return (
    <group ref={groupRef}>
      <mesh
        ref={topDome}
        geometry={geometryTop}
        material={shellMaterial}
        position={[0, 2, 0]}
      ></mesh>
      <mesh geometry={innerGeometry} material={innerMaterial} />

      <animated.group {...bind()} key={index} {...spring}>
        <Level levelIndex={index.current} />
      </animated.group>
    </group>
  );
};

// https://codesandbox.io/s/jflps?file=/src/App.js:2700-2714

export default memo(Shell);
