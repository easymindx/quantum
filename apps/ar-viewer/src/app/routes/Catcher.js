/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { memo, Suspense, useEffect, useState } from 'react';

import { Canvas } from '@react-three/fiber';
// import { Stats } from '@react-three/drei';

import ControlCenter from '../components/ControlCenter';
import TopBar from '../components/TopBar';
import use8thWall from '../hooks/use8thWall';
import Experience from '../components/Experience';
import { AdaptiveDpr, Preload } from '@react-three/drei';

function Catcher() {
  const [canvasEl, setCanvasEl] = useState();
  const { XR8 } = use8thWall(process.env.NX_APP_8THWALL_API_KEY, canvasEl);

  const dimensions = {
    height: window.innerHeight,
    width: window.innerWidth,
  };

  useEffect(() => {
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  return (
    <>
      {XR8 && XR8.Threejs.xrScene() && (
        <>
          <TopBar />
          <ControlCenter />
        </>
      )}
      <Canvas
        ref={canvasEl}
        gl={{ preserveDrawingBuffer: false }}
        style={{ height: dimensions.height, width: dimensions.width }}
        dpr={[1, 2]}
      >
        {XR8 && XR8.Threejs.xrScene() && <Experience XR8={XR8} />}
        <Preload all />
        <AdaptiveDpr pixelated />
        {/* <Stats className="stats" showPanel={0} /> */}
      </Canvas>
    </>
  );
}

export default memo(Catcher);
