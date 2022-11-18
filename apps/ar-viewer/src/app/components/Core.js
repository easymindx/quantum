import React, { memo, useEffect, useRef, useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar.js';
import Sphere from './Shell.js';
import useStore from '../store.js';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend, useThree } from '@react-three/fiber';
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

extend({ MeshLine, MeshLineMaterial });
extend({ UnrealBloomPass });

const Core = ({ activeQuasar }) => {
  const groupRef = useRef();
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);

  // Spring anims

  const positionWhenInside = 4;

  const { position } = useSpring({
    position: isGalleryMode ? [0, 0.4, positionWhenInside] : [0, 0.4, 0],
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
    immediate: true,
  });

  const { sparkScale } = useSpring({
    sparkScale: isCaught
      ? isGalleryMode
        ? [0, 0, 0]
        : [0.8, 0.8, 0.8]
      : [0, 0, 0],
    immediate: true,
    config: { mass: 1, tension: 200, friction: 20 },
    delay: isGalleryMode ? 1000 : 0,
  });

  return (
    <animated.group ref={groupRef} position={position} scale={groupScale}>
      {!isGalleryMode && (
        <>
          {/* <EffectComposer multisampling={8}>
            <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.2} />
            <Bloom
              kernelSize={KernelSize.HUGE}
              luminanceThreshold={0}
              luminanceSmoothing={0}
              intensity={0.2}
            />
          </EffectComposer> */}
          {/* <Effects disableGamma>
            <unrealBloomPass threshold={5} strength={1.0} radius={0.5} />
          </Effects> */}
          <PresentationControls
            enabled={true} // the controls can be disabled by setting this to false
            global={false} // Spin globally or by dragging the model
            cursor={true} // Whether to toggle cursor style on drag
            snap={true} // Snap-back to center (can also be a spring config)
            speed={2} // Speed factor
            zoom={1} // Zoom factor when half the polar-max is reached
            rotation={[0, 0, 0]} // Default rotation
            polar={[0, Math.PI / 2]} // Vertical limits
            azimuth={[-Infinity, Infinity]} // Horizontal limits
            config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
          >
            <Quasar />
          </PresentationControls>
        </>
      )}

      <animated.group visible={!isGalleryMode} scale={sparkScale}>
        <SparkStorm count={300} colors={activeQuasar?.palette} />
      </animated.group>

      <animated.group visible={isGalleryMode} scale={sphereScale}>
        <Sphere />
      </animated.group>
    </animated.group>
  );
};

export default memo(Core);
