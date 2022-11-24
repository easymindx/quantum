import React, { memo, Suspense, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar.js';
import Shell from './Shell.js';
import useStore from '../store.js';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import { SparkStorm } from './Sparks/SparkStorm';
import { UnrealBloomPass } from 'three-stdlib';

extend({ MeshLine, MeshLineMaterial });
extend({ UnrealBloomPass });

const Experience = (props) => {
  const groupRef = useRef();

  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const setProjectData = useStore((state) => state.setProjectData);
  const projectId = useStore((state) => state.projectId);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const selectedQuasar = useStore((state) => state.selectedQuasar);

  useEffect(() => {
    fetch('https://api.npoint.io/830360b5f6a82edd4912')
      .then((response) => response.json())
      .then((data) => {
        const project = data.find((project) => project?.id === projectId);
        setProjectData(project);
        setActiveQuasar(project?.data[selectedQuasar]);
      });
  }, [projectId]);

  const groupYPos = isDesktopMode ? 1 : 1;

  const { groupScale, groupPosition } = useSpring({
    groupScale: [1, 1, 1],
    groupPosition: isCaught ? [0, groupYPos, 0] : [0, groupYPos, -5],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { shellScale, shellPosition } = useSpring({
    shellScale: isGalleryMode ? [1, 1, 1] : [0, 0, 0],
    shellPosition: isGalleryMode ? [0, 0, 0] : [0, -10, 0],
    // delay: isGalleryMode ? 500 : 0,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { sparkScale } = useSpring({
    sparkScale: !isCaught ? [0.1, 0.1, 0.1] : [0, 0, 0],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <>
      <animated.group
        ref={groupRef}
        position={groupPosition}
        scale={groupScale}
      >
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
              config={{ mass: 1, tension: 170, friction: 20 }}
            >
              <Quasar />
            </PresentationControls>
            <animated.group visible={!isCaught} scale={sparkScale}>
              <SparkStorm count={150} colors={activeQuasar.palette} />
            </animated.group>
            <animated.group scale={shellScale} position={shellPosition}>
              <Shell />
            </animated.group>
          </>
        )}
      </animated.group>

      <>
        {/* <directionalLight intensity={2} position={[5, 5, 4]} />
        <directionalLight intensity={2} position={[-5, 5, 4]} /> */}
        <hemisphereLight intensity={0.5} />
      </>
    </>
  );
};

export default memo(Experience);
