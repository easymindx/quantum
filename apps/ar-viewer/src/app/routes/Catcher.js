/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { memo, lazy, Suspense, useEffect } from 'react';
import {
  BrowserCompatibility,
  ZapparCamera,
  InstantTracker,
} from '@zappar/zappar-react-three-fiber';
import { Canvas } from '@react-three/fiber';
import {
  Html,
  Stats,
  useProgress,
  Preload,
  PerspectiveCamera,
  useGLTF,
} from '@react-three/drei';
import { useControls } from 'leva';
import FadeIn from 'react-fade-in';
import Core from '../components/Core';
import useStore from '../store';
import ControlCenter from '../components/ControlCenter';
import { CircleProgress } from 'react-gradient-progress';
import TopBar from '../components/TopBar';

function Catcher() {
  // const { revealHidden } = useControls({
  //   revealHidden: { value: true, label: 'Reveal?' },
  //   // tier: { value: 1, min: 1, max: 3, step: 1, label: 'Tier' },
  // });

  // const setLevaControls = useStore((state) => state.setLevaControls);

  const apiUrl = process.env.NX_API_URL;

  const setProjectData = useStore((state) => state.setProjectData);
  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const projectId = useStore((state) => state.projectId);

  useEffect(() => {
    fetch(`${apiUrl}/assets`)
      .then((response) => response.json())
      .then((data) => {
        const project = data.find((project) => project.id === projectId);
        console.log('project', project);
        setProjectData(project);
        setActiveQuasar(project.data[0]);
      });
  }, [projectId]);

  const [sceneLoaded, setSceneLoaded] = React.useState(false);
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const [placementMode, setPlacementMode] = React.useState(false);
  const [currentQuasar, setCurrentQuasar] = React.useState(activeQuasar);

  const [dimensions, setDimensions] = React.useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener('resize', handleResize);
  }, []);

  const Loader = () => {
    const { progress } = useProgress();
    return (
      <Html center>
        <CircleProgress
          percentage={Number(progress.toFixed())}
          strokeWidth={10}
        />
      </Html>
    );
  };

  useEffect(() => {
    setPlacementMode(isCaught);
  }, [isCaught]);
  // TODO: Find a better way to do this (trying to free up the memory on quasar change)
  // So basically causing all the models to remount when the quasar changes
  // useEffect(() => {
  //   setTimeout(() => {
  //     setSceneLoaded(true);
  //   }, true);
  //   setSceneLoaded(false);
  // }, [activeQuasar]);

  return (
    <>
      <FadeIn delay={250} transitionDuration={250}>
        <BrowserCompatibility />
        {/* <TopBar /> */}
        <Canvas
          gl={{ preserveDrawingBuffer: false }}
          style={{ height: dimensions.height, width: dimensions.width }}
          dpr={[1, 2]}
        >
          <ZapparCamera
            onFirstFrame={() => {
              setSceneLoaded(true);
            }}
            permissionRequest={true}
            environmentMap
            poseMode="attitude"
          />

          <InstantTracker
            placementMode={
              // NOTE: This is a hack to get Quasar to initialise as 'placed', don't mess with it unless you know what it's doing
              sceneLoaded
                ? isGalleryMode
                  ? !placementMode
                  : placementMode
                : !isCaught
            }
          >
            {sceneLoaded && activeQuasar && (
              <Suspense fallback={<Loader />}>
                <Core activeQuasar={activeQuasar} />
                <directionalLight intensity={0.25} position={[5, 5, 0]} />
                <directionalLight intensity={0.25} position={[-5, 5, 0]} />
                <Preload all />
              </Suspense>
            )}
          </InstantTracker>

          {/* <Stats className="stats" showPanel={0} /> */}
          {/* <WasdControls /> */}
        </Canvas>
      </FadeIn>

      <ControlCenter />
    </>
  );
}

export default memo(Catcher);
