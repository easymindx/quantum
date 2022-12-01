/* eslint-disable jsx-a11y/no-redundant-roles */
import React, {
  memo,
  Suspense,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Canvas } from '@react-three/fiber';
// import { Stats } from '@react-three/drei';
import FadeIn from 'react-fade-in';
import {
  AdaptiveEvents,
  BakeShadows,
  Environment,
  Html,
  useProgress,
} from '@react-three/drei';
import { CircleProgress } from 'react-gradient-progress';
import ControlCenter from '../components/ControlCenter';
import TopBar from '../components/TopBar';
import use8thWall from '../hooks/use8thWall';
import Experience from '../components/Experience';
import { AdaptiveDpr, Preload, Stats } from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';
import { BlurPass, Resizer, KernelSize } from 'postprocessing';
import useStore from '../store';

function Catcher() {
  const [canvasEl, setCanvasEl] = useState();

  const { XR8 } = use8thWall(process.env.NX_APP_8THWALL_API_KEY, canvasEl);
  const isDesktopMode = useStore((state) => state.isDesktopMode);

  const dimensions = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  const Loader = () => {
    const { progress } = useProgress();

    return (
      <group position={[0, 0.5, -5]}>
        <Html center>
          <CircleProgress
            percentage={Number(progress.toFixed())}
            strokeWidth={10}
          />
        </Html>
      </group>
    );
  };

  const isReadyScene = useMemo(() => XR8 && XR8.Threejs.xrScene(), [XR8]);

  useLayoutEffect(() => {
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  const { height, width } = dimensions;

  return (
    <>
      {isReadyScene && (
        <>
          <TopBar /> <ControlCenter />
        </>
      )}

      <Canvas
        gl={{ preserveDrawingBuffer: false }}
        style={{ height: height, width: width }}
        dpr={[1, 2]}
        shadows={false}
      >
        {isReadyScene && (
          <Suspense fallback={<Loader />}>
            <Experience XR8={XR8} />
          </Suspense>
        )}
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <BakeShadows />
        <Environment preset="sunset" />
        {/* <EffectComposer>
          <Bloom
            intensity={0.1} // The bloom intensity.
            blurPass={undefined} // A blur pass.
            width={width} // render width
            height={height} // render height
            kernelSize={KernelSize.HUGE} // blur kernel size
            luminanceThreshold={0} // luminance threshold. Raise this value to mask out darker elements in the scene.
            luminanceSmoothing={0.5} // smoothness of the luminance threshold. Range is [0, 1]
          />
        </EffectComposer> */}
      </Canvas>
    </>
  );
}

export default memo(Catcher);
