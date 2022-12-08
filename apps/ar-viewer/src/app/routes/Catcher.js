import React, { Suspense, useLayoutEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Environment, AdaptiveDpr, Preload } from '@react-three/drei';
import FadeIn from 'react-fade-in';

import ControlCenter from 'components/ControlCenter';
import TopBar from 'components/TopBar';
import use8thWall from 'hooks/use8thWall';
import Experience from 'components/Experience';
import Loader from 'components/Loader';
import useProjectData from 'hooks/useProjectData';

function Catcher() {
  const { projectId, quasarIdx } = useParams();
  const [canvasEl, setCanvasEl] = useState();
  const { XR8 } = use8thWall(process.env.NX_APP_8THWALL_API_KEY, canvasEl);

  useLayoutEffect(() => {
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  useProjectData(projectId, quasarIdx);

  return (
    <FadeIn delay={250} transitionDuration={2000}>
      {XR8 && (
        <>
          <TopBar />
          <ControlCenter />
        </>
      )}

      <Canvas
        gl={{ preserveDrawingBuffer: false }}
        style={{ height: window.innerHeight, width: window.innerWidth }}
        dpr={[1, 2]}
        shadows={false}
      >
        {XR8 && (
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

export default Catcher;
