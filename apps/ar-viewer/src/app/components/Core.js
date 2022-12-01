import { memo, useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import Quasar from './Quasar';
import Gallery from './Gallery';
import useStore from '../store';
import { MeshLine, MeshLineMaterial } from './MeshLine';
import { extend } from '@react-three/fiber';
import { PresentationControls, Shadow, useGLTF } from '@react-three/drei';
import {
  Selection,
  Select,
  EffectComposer,
  Bloom,
  Noise,
} from '@react-three/postprocessing';
import { BlurPass, Resizer, KernelSize } from 'postprocessing';
import { SparkStorm } from './Sparks/SparkStorm';

extend({ MeshLine, MeshLineMaterial });

const Experience = () => {
  const groupRef = useRef();

  const isCaught = useStore((state) => state.isCaught);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const groupYPos = isDesktopMode ? 1.5 : 2;
  const quasarModel = useGLTF(activeQuasar.modelSrc);

  const { groupPosition } = useSpring({
    groupPosition: isCaught
      ? [0, groupYPos, isDesktopMode ? 0 : 0]
      : [0, groupYPos, -2],
  });

  const { quasarScale, quasarPosition } = useSpring({
    quasarScale: isCaught
      ? isDesktopMode
        ? [0.3, 0.3, 0.3]
        : [20, 20, 20]
      : isDesktopMode
      ? [0.5, 0.5, 0.5]
      : [0.7, 0.7, 0.7],
    quasarPosition: isCaught
      ? isDesktopMode
        ? [0, -0.2, 0]
        : [0, 0, 0]
      : [0, 0, 0],
    config: { mass: 0.7, tension: 200, friction: 20 },
  });

  const { sparkScale } = useSpring({
    sparkScale: isCaught ? [0, 0, 0] : [1, 1, 1],
  });

  const { shellScale, shellPosition } = useSpring({
    shellScale: isCaught ? [1, 1, 1] : [0.01, 0.01, 0.01],
    shellPosition: isCaught ? [0, 0, 0] : [0, 3, 0],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  const { palette, gallery, initialRotation } = activeQuasar;

  return activeQuasar ? (
    <>
      <Selection>
        <EffectComposer autoclear={false}>
          <Bloom
            intensity={0.1} // The bloom intensity.
            blurPass={BlurPass} // A blur pass.
            width={Resizer.AUTO_SIZE} // render width
            height={Resizer.AUTO_SIZE} // render height
            kernelSize={KernelSize.HUGE} // blur kernel size
            luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.5} // smoothness of the luminance threshold. Range is [0, 1]
          />
        </EffectComposer>

        <animated.group
          ref={groupRef}
          position={groupPosition}
          scale={[1, 1, 1]}
        >
          <PresentationControls
            enabled={true}
            global={false}
            cursor={true}
            snap={isDesktopMode ? !isCaught : true}
            speed={2}
            zoom={1}
            rotation={[0, 0, 0]}
            polar={[0, Math.PI / 2]}
            azimuth={[-Infinity, Infinity]}
            config={{ mass: 1, tension: 170, friction: 20 }}
          >
            <animated.group scale={quasarScale} position={quasarPosition}>
              <Select enabled>
                <Quasar model={quasarModel} initialRotation={initialRotation} />
              </Select>
            </animated.group>

            <animated.group
              scale={sparkScale}
              visible={isDesktopMode ? true : !isCaught}
            >
              <Select enabled={false}>
                <SparkStorm
                  count={100}
                  colors={palette}
                  isDesktopMode={isDesktopMode}
                />
              </Select>
            </animated.group>

            <animated.group scale={shellScale} position={shellPosition}>
              {gallery.length && <Gallery model={quasarModel} />}
            </animated.group>
          </PresentationControls>
        </animated.group>
      </Selection>

      <ambientLight intensity={0.25} />
      {/* create 3 lights pointing at Quasar */}
      <pointLight
        position={[-0.5, 1, 0]}
        intensity={0.25}
        color={'#fff'}
        decay={2}
      />
      <pointLight
        position={[0, 1, 0]}
        intensity={0.25}
        color={'#fff'}
        decay={2}
      />
      <pointLight
        position={[0.25, 1, 0]}
        intensity={0.5}
        color={'#fff'}
        decay={2}
      />

      <Shadow position={[0, -2, -4]} color="black" opacity={0.75} scale={3} />
    </>
  ) : null;
};

useGLTF.preload();

export default memo(Experience);
