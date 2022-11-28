/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { memo, Suspense, useLayoutEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
// import { Stats } from '@react-three/drei';
import FadeIn from 'react-fade-in';
import { Html, useProgress } from '@react-three/drei';
import { CircleProgress } from 'react-gradient-progress';
import ControlCenter from '../components/ControlCenter';
import TopBar from '../components/TopBar';
import use8thWall from '../hooks/use8thWall';
import Experience from '../components/Experience';
import { AdaptiveDpr, Preload, Stats } from '@react-three/drei';

function Catcher() {
  const [canvasEl, setCanvasEl] = useState();

  const { XR8 } = use8thWall(process.env.NX_APP_8THWALL_API_KEY, canvasEl);

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

  useLayoutEffect(() => {
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  const { height, width } = dimensions;

  return (
    <FadeIn delay={250} transitionDuration={2000}>
      {XR8 && XR8.Threejs.xrScene() && (
        <>
          <TopBar />
          <ControlCenter />
        </>
      )}

      <Canvas
        gl={{ preserveDrawingBuffer: false }}
        style={{ height: height, width: width }}
        dpr={[1, 2]}
      >
        {XR8 && XR8.Threejs.xrScene() && (
          <Suspense fallback={<Loader />}>
            <Experience XR8={XR8} />
          </Suspense>
        )}
        <Preload all />
        <AdaptiveDpr pixelated />
      </Canvas>
    </FadeIn>
  );
}

export default memo(Catcher);
