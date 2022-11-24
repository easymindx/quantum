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
      var light = new THREE.PointLight(0xffffff, 1);
      camera.add(light);
      camera.position.y = isDesktopMode ? 10 : 1.8;
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
