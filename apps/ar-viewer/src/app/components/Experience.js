import { memo, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import useStore from '../store';
import Core from './Core';
import * as THREE from 'three';
import { disposeAll } from '../utils/disposeAll';

const Experience = ({ XR8 }) => {
  const { scene, camera } = XR8.Threejs.xrScene();
  const setDefaultCamera = useThree(({ set }) => set);
  const npointId = useStore((state) => state.npointId);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const setProjectData = useStore((state) => state.setProjectData);
  const selectedQuasar = useStore((state) => state.selectedQuasar);

  console.log('Experience');

  useEffect(() => {
    console.log('Load remote data');
    fetch(`https://api.npoint.io/${npointId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data);
        setProjectData(data, selectedQuasar);
      });
  }, [npointId, selectedQuasar, setProjectData]);

  const appRef = useRef();

  useEffect(() => {
    if (scene && activeQuasar && camera) {
      console.log('Init Scene');
      // Dispose of the previous scene when switching quasars
      disposeAll(scene);
      // Add the app to 8thWall's ThreeJS scene
      scene.add(appRef.current);
      // Add a point light from the camera
      const light = new THREE.PointLight(0xffffff, 0.3, 100);
      light.position.set(0, 1, 0);
      camera.add(light);
      camera.position.y = 2.5;
      // Set the default camera to use ThreeJS's camera
      setDefaultCamera({
        camera,
        scene,
      });
    }
  }, [scene, camera, activeQuasar, setDefaultCamera]);

  return (
    <group ref={appRef}>
      {activeQuasar && <Core />}
      <hemisphereLight intensity={1} />
    </group>
  );
};

export default Experience;
