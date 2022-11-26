import { memo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar';
import Shell from './Shell';
import useStore from '../store';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend, useFrame } from '@react-three/fiber';
import { PresentationControls } from '@react-three/drei';
import { SparkStorm } from './Sparks/SparkStorm';

extend({ MeshLine, MeshLineMaterial });

const Experience = (props) => {
  const groupRef = useRef();

  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isDesktopMode = useStore((state) => state.isDesktopMode);

  const groupYPos = isDesktopMode ? 1.5 : 2;

  const { groupScale, groupPosition, shellScale, shellPosition } = useSpring({
    groupScale: [1, 1, 1],
    groupPosition: isCaught ? [0, groupYPos, 0] : [0, groupYPos, -5],
    shellScale: isGalleryMode ? [1, 1, 1] : [0, 0, 0],
    shellPosition: isGalleryMode ? [0, 0, 0] : [0, -10, 0],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { sparkScale } = useSpring({
    sparkScale: !isCaught ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { palette } = activeQuasar;

  return (
    <animated.group
      ref={groupRef}
      position={groupPosition}
      scale={groupScale}
      className="quasar"
    >
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
        <SparkStorm count={100} colors={palette} />
      </animated.group>
      <animated.group scale={shellScale} position={shellPosition}>
        <Shell />
      </animated.group>
    </animated.group>
  );
};

export default memo(Experience);
