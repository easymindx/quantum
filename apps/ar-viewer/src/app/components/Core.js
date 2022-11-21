import React, { memo, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar.js';
import Sphere from './Shell.js';
import useStore from '../store.js';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend, useFrame, useThree } from '@react-three/fiber';
import {
  Effects,
  OrbitControls,
  OrthographicCamera,
  BakeShadows,
  PresentationControls,
} from '@react-three/drei';
import { SparkStorm } from './Sparks/SparkStorm';
import { KernelSize } from 'postprocessing';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { UnrealBloomPass } from 'three-stdlib';
import { useControls } from 'leva';

extend({ MeshLine, MeshLineMaterial });
extend({ UnrealBloomPass });

const Experience = (props) => {
  const appRef = useRef();
  const groupRef = useRef();
  // const setDefaultCamera = useThree(({ set }) => set);
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const tapPoint = useStore((state) => state.tapPoint);
  const activeQuasar = useStore((state) => state.activeQuasar);

  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const setProjectData = useStore((state) => state.setProjectData);

  const projectId = useStore((state) => state.projectId);

  const { selectedProjectId } = useControls({
    selectedProjectId: {
      options: ['Quantum Art', 'Coca Cola'],
      label: 'Project',
    },
    // tier: { value: 1, min: 1, max: 3, step: 1, label: 'Tier' },
  });

  useEffect(() => {
    fetch('https://api.npoint.io/830360b5f6a82edd4912')
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        console.log('selectedProjectId', selectedProjectId);
        const project = data.find(
          (project) => project?.projectName === selectedProjectId
        );
        setProjectData(project);

        console.log('project', project);
        console.log('project?.data[0]', project?.data[0]);
        setActiveQuasar(project?.data[0]);
      });
  }, [selectedProjectId]);

  // const { scene, camera } = props.XR8.Threejs.xrScene();

  // useEffect(() => {
  //   if (scene) {
  //     scene.add(appRef.current);
  //   }
  // }, [scene]);

  // Spring anims

  const positionWhenInside = 4;

  const { position } = useSpring({
    position: isGalleryMode ? [0, 1.8, 0] : [0, 1.8, -4],
  });

  const { groupScale } = useSpring({
    groupScale: isGalleryMode
      ? [1, 1, 1]
      : isCaught
      ? [0.085, 0.085, 0.085]
      : [0.06, 0.06, 0.06],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { sphereScale } = useSpring({
    sphereScale: isGalleryMode ? [1, 1, 1] : [0, 0, 0],
  });

  const { sparkScale } = useSpring({
    sparkScale: isCaught ? [0.8, 0.8, 0.8] : [0, 0, 0],
    config: { mass: 1, tension: 200, friction: 20 },
    delay: isGalleryMode ? 1000 : 0,
  });

  return (
    <animated.group ref={groupRef} position={position} scale={groupScale}>
      {activeQuasar && (
        <>
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={true}
            speed={2}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[0, Math.PI / 2]}
            azimuth={[-Infinity, Infinity]}
            config={{ mass: 1, tension: 170, friction: 26 }}
          >
            <Quasar />
          </PresentationControls>

          <animated.group visible={!isGalleryMode} scale={sparkScale}>
            <SparkStorm count={200} colors={activeQuasar.palette} />
          </animated.group>
          <animated.group visible={isGalleryMode} scale={sphereScale}>
            <Sphere />
          </animated.group>
        </>
      )}
    </animated.group>
  );
};

export default memo(Experience);
