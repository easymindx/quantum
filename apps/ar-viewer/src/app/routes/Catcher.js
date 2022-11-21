/* eslint-disable jsx-a11y/no-redundant-roles */
import React, {
  memo,
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Canvas, useThree } from '@react-three/fiber';
import { Html, Stats, useProgress, Preload } from '@react-three/drei';
import { useControls } from 'leva';
import FadeIn from 'react-fade-in';
import Core from '../components/Core';
import useStore from '../store';
import ControlCenter from '../components/ControlCenter';
import { CircleProgress } from 'react-gradient-progress';
import TopBar from '../components/TopBar';
import use8thWall from '../hooks/use8thWall';

function Catcher() {
  const { selectedProjectId } = useControls({
    selectedProjectId: {
      options: ['Quantum Art', 'Coca Cola'],
      label: 'Project',
    },
    // tier: { value: 1, min: 1, max: 3, step: 1, label: 'Tier' },
  });

  const [canvasEl, setCanvasEl] = useState();
  const { XR8 } = use8thWall(
    'lQIft1et06A6QpSgBS6fzBWdB9tXP64wKSqj5LQtklP3EfCwhYrYiAYmEqFeQrJSkSsnW0',
    canvasEl
  );
  useEffect(() => {
    const canvas = document.getElementsByTagName('canvas')[0];
    setCanvasEl(document.getElementsByTagName('canvas')[0]);
  }, []);

  const apiUrl = process.env.NX_API_URL;
  const setProjectData = useStore((state) => state.setProjectData);
  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const projectId = useStore((state) => state.projectId);

  useEffect(() => {
    fetch('https://api.npoint.io/830360b5f6a82edd4912')
      .then((response) => response.json())
      .then((data) => {
        const project = data.find(
          (project) => project?.projectName === selectedProjectId
        );
        setProjectData(project);
        setActiveQuasar(project?.data[0]);
      });
  }, [selectedProjectId]);

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

  const Experience = (props) => {
    const { scene, camera } = props.XR8.Threejs.xrScene();
    const setDefaultCamera = useThree(({ set }) => set);
    const appRef = useRef();

    // add our app to 8thWall's ThreeJS scene
    useEffect(() => {
      if (scene) {
        scene.add(appRef.current);
      }
    }, [scene]);

    // set 8thWall's ThreeJS camera as default camera of
    // react-three-fiber
    useEffect(() => {
      if (camera) {
        setDefaultCamera({
          camera,
          scene,
        });
      }
    }, [camera, scene, setDefaultCamera]);

    return (
      <group ref={appRef} visible={true}>
        {/* {sceneLoaded && activeQuasar && (
          <Suspense fallback={<Loader />}>
            <Core scene={scene} camera={camera} activeQuasar={activeQuasar} />
            <directionalLight intensity={0.25} position={[5, 5, 0]} />
            <directionalLight intensity={0.25} position={[-5, 5, 0]} />
            <Preload all />
          </Suspense>
        )} */}

        <Suspense fallback={<Loader />}>
          <Core activeQuasar={activeQuasar} />
          <directionalLight intensity={0.25} position={[5, 5, 0]} />
          <directionalLight intensity={0.25} position={[-5, 5, 0]} />
          <Preload all />
        </Suspense>
      </group>
    );
  };

  alert(XR8);

  return (
    <>
      <FadeIn delay={250} transitionDuration={250}>
        <TopBar />
        <Canvas
          shadows
          gl={{ preserveDrawingBuffer: false }}
          style={{ height: dimensions.height, width: dimensions.width }}
          dpr={[1, 2]}
        >
          {XR8 && XR8.Threejs.xrScene() && <Experience XR8={XR8} />}

          {/* <Stats className="stats" showPanel={0} /> */}
          {/* <WasdControls /> */}
        </Canvas>
      </FadeIn>

      <ControlCenter XR8={XR8} />
    </>
  );
}

export default memo(Catcher);
