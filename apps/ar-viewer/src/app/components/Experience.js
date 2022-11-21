import { memo, useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import Core from './Core';

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
  }, [camera]);

  return (
    <group ref={appRef} visible={true}>
      <Core />
      <directionalLight intensity={2} position={[5, 5, 0]} />
      <directionalLight intensity={2} position={[-5, 5, 0]} />
      <hemisphereLight intensity={0.25} />
    </group>
  );
};

export default memo(Experience);
