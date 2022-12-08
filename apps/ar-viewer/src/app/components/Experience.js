import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import useStore from 'store';
import Core from './Core';

const Experience = ({ XR8 }) => {
  const appRef = useRef();
  const activeQuasar = useStore((state) => state.activeQuasar);
  const setThreeState = useThree(({ set }) => set);
  const { scene, camera } = XR8.Threejs.xrScene();

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
