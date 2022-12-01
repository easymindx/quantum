import { memo, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import useStore from '../store';
import Core from './Core';
import { disposeAll } from '../utils/disposeAll';
import axios from 'axios';
import { useSpring, animated } from '@react-spring/three';

const Experience = ({ XR8 }) => {
  const { renderer, scene, camera } = XR8.Threejs.xrScene();
  const setDefaultCamera = useThree(({ set }) => set);
  const [isLoaded, setIsLoaded] = useState(false);
  const npointId = useStore((state) => state.npointId);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const setProjectData = useStore((state) => state.setProjectData);
  const selectedQuasar = useStore((state) => state.selectedQuasar);

  useEffect(() => {
    if (activeQuasar) return;
    console.log('Load remote data');
    setIsLoaded(false);
    // not sure if this is fully clearing the scene
    disposeAll(scene);
    renderer.renderLists.dispose();
    axios
      .get(`https://api.npoint.io/${npointId}`)
      .then((response) => {
        setProjectData(response.data, selectedQuasar);
        // set react router path params
        // history.push(`/experience/${selectedQuasar}`);
        var newurl =
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname +
          `?projectId=${npointId}&quasarId=${selectedQuasar}`;
        window.history.pushState({ path: newurl }, '', newurl);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [npointId, selectedQuasar, setProjectData, activeQuasar, scene, renderer]);

  const appRef = useRef();

  useEffect(() => {
    if (scene && activeQuasar && camera) {
      console.log('Init Scene');
      camera.position.y = 1.8;
      // Set the default camera to use ThreeJS's camera
      setDefaultCamera({
        camera,
        scene,
      });
      // Add the app to 8thWall's ThreeJS scene
      scene.add(appRef.current);
    }
  }, [scene, camera, activeQuasar, setDefaultCamera]);

  return <group ref={appRef}>{activeQuasar ? <Core /> : null}</group>;
};

export default Experience;
