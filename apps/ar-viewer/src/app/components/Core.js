import { memo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar';
import Shell from './Shell';
import useStore from '../store';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend } from '@react-three/fiber';
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

  const { groupScale, groupPosition, shellScale, shellPosition, quasarScale } =
    useSpring({
      groupScale: [1, 1, 1],
      groupPosition: isCaught ? [0, groupYPos, 0] : [0, groupYPos, -1.5],
      shellScale: isGalleryMode ? [1, 1, 1] : [0, 0, 0],
      shellPosition: isGalleryMode ? [0, 0, 0] : [0, -10, 0],
      quasarScale: isCaught ? [25, 25, 25] : [1, 1, 1],
      config: { mass: 1, tension: 200, friction: 20, duration: 1000 },
    });

  const { sparkScale } = useSpring({
    sparkScale: !isCaught ? [1, 1, 1] : [0, 0, 0],
    config: { mass: 1, tension: 200, friction: 20 },
    delay: 1000,
  });

  const { palette, gallery } = activeQuasar;

  return (
    <>
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
          <animated.group scale={quasarScale}>
            <Quasar />
          </animated.group>
        </PresentationControls>

        <animated.group scale={sparkScale}>
          {!isCaught && <SparkStorm count={200} colors={palette} />}
        </animated.group>

        <animated.group scale={shellScale} position={shellPosition}>
          {gallery.length && <Shell />}
        </animated.group>
      </animated.group>
      <directionalLight intensity={0.5} position={[-5, 3, 0]} />
      {/* <spotLight intensity={0.5} position={[0, 4, 0]} /> */}
      <directionalLight intensity={0.5} position={[5, 3, 0]} />
      <ambientLight intensity={0.5} />
    </>
  );
};

export default memo(Experience);
