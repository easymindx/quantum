import { memo, useEffect, useRef } from 'react';
import { useThree } from 'react-three-fiber';
import useStore from '../store';
import Core from './Core';

const Experience = (props) => {
  const { scene, camera } = props.XR8.Threejs.xrScene();
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
