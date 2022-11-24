import { memo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import useStore from '../store';
import Core from './Core';
import * as THREE from 'three';

const Experience = ({ XR8 }) => {
  const { scene, camera } = XR8.Threejs.xrScene();
  const setDefaultCamera = useThree(({ set }) => set);
  const isDesktopMode = useStore((state) => state.isDesktopMode);

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
      // add 3 point lights to the scene
      const light = new THREE.PointLight(0xffffff, 0.5, 100);
      light.position.set(0, 1, 0);
      camera.add(light);
      camera.position.y = 1;
      setDefaultCamera({
        camera,
        scene,
      });
    }
  }, [camera]);

  return (
    <group ref={appRef} visible={true}>
      <Core />
    </group>
  );
};

export default memo(Experience);
