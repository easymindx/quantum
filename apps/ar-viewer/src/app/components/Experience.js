import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThree } from '@react-three/fiber';
import { disposeAll } from 'utils/disposeAll';
import useStore from 'store';
import Core from './Core';
import axios from 'axios';

const Experience = ({ XR8 }) => {
  const navigate = useNavigate();
  const npointId = useStore((state) => state.npointId);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const setProjectData = useStore((state) => state.setProjectData);
  const selectedQuasar = useStore((state) => state.selectedQuasar);
  const setThreeState = useThree(({ set }) => set);
  const { renderer, scene, camera } = XR8.Threejs.xrScene();

  useEffect(() => {
    if (activeQuasar) return;
    // not sure if this is fully clearing the scene
    disposeAll(scene);
    renderer.renderLists.dispose();
    axios
      .get(`https://api.npoint.io/${npointId}`)
      .then((res) => {
        setProjectData(res.data, selectedQuasar);
        navigate(`/catcher/?projectId=${npointId}&quasarId=${selectedQuasar}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    npointId,
    selectedQuasar,
    setProjectData,
    activeQuasar,
    scene,
    renderer,
    navigate,
  ]);

  const appRef = useRef();

  useEffect(() => {
    if (scene && activeQuasar && camera) {
      camera.position.y = 1.8;
      // Set 8th wall camera and scene as three.js instances
      setThreeState({
        camera,
        scene,
      });
      // Add the app to 8thWall's ThreeJS scene
      scene.add(appRef.current);
    }
  }, [scene, camera, activeQuasar, setThreeState]);

  return <group ref={appRef}>{activeQuasar ? <Core /> : null}</group>;
};

export default Experience;
