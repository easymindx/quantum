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
import { Environment } from '@react-three/drei';

import ControlCenter from '../components/ControlCenter';
import TopBar from '../components/TopBar';
import use8thWall from '../hooks/use8thWall';
import Experience from '../components/Experience';
import { AdaptiveDpr, Preload, Stats } from '@react-three/drei';
import Loader from '../components/Loader';

function Catcher() {
  const [canvasEl, setCanvasEl] = useState();

  const { XR8 } = use8thWall(process.env.NX_APP_8THWALL_API_KEY, canvasEl);

  const dimensions = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  const isReadyScene = useMemo(() => XR8 && XR8.Threejs.xrScene(), [XR8]);

  useLayoutEffect(() => {
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  const { height, width } = dimensions;

  return (
    <FadeIn delay={250} transitionDuration={2000}>
      {isReadyScene && (
        <>
          <TopBar />
          <ControlCenter />
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
        <Preload all />
        <AdaptiveDpr pixelated />
        <Environment preset="warehouse" />
      </Canvas>
    </FadeIn>
  );
}

export default memo(Catcher);
