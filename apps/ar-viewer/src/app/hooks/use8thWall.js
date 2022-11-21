import { useEffect, useState } from 'react';
import * as THREE from 'three';
import use8thWallScripts from './use8thWallScripts';

const use8thWall = (appKey, canvas) => {
  const areScriptsReady = use8thWallScripts(appKey);
  const [XR8Object, setXR8Object] = useState(null);
  const [ThreeObject, setThreeObject] = useState(null);

  useEffect(() => {
    if (!XR8Object && areScriptsReady && canvas) {
      const { XRExtras } = window;

      XRExtras.Loading.showLoading({
        onxrloaded: () => {
          const { XR8 } = window;

          window.THREE = THREE;

          XR8.XrController.configure({
            disableWorldTracking: false,
          });
          XR8.addCameraPipelineModules([
            XR8.GlTextureRenderer.pipelineModule(),
            XR8.Threejs.pipelineModule(),
            XR8.XrController.pipelineModule(),
            XRExtras.AlmostThere.pipelineModule(),
            XRExtras.Loading.pipelineModule(),
            XRExtras.RuntimeError.pipelineModule(),
          ]);

          XR8.addCameraPipelineModule({
            name: 'my app',
            onerror: (err) => {
              console.error('quasars error', err);
            },
            onAttach: ({ canvasWidth, canvasHeight }) => {
              const { camera } = XR8.Threejs.xrScene();
              setXR8Object(XR8);

              camera.position.set(0, 2, 0);
              XR8.XrController.updateCameraProjectionMatrix({
                origin: camera.position,
                facing: camera.quaternion,
              });

              setThreeObject({
                scene: XR8.Threejs.xrScene().camera,
                camera: XR8.Threejs.xrScene().scene,
              });
            },
          });

          XR8.run({ canvas });
        },
      });
    }
  }, [XR8Object, areScriptsReady, canvas]);

  return {
    XR8: XR8Object,
    XR8Three: ThreeObject,
  };
};

export default use8thWall;
