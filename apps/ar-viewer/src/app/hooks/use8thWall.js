import { useEffect, useState } from 'react';
import * as THREE from 'three';
import use8thWallScripts from './use8thWallScripts';

export const use8thWall = (appKey, canvas) => {
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
            name: 'quasars',
            onerror: (err) => {
              console.error('AR init error', err);
            },
            onAttach: () => {
              setXR8Object(XR8);
              setThreeObject({
                scene: XR8.Threejs.xrScene().camera,
                camera: XR8.Threejs.xrScene().scene,
              });
            },
            onStart: ({ canvas }) => {
              // const { camera, renderer } = XR8.Threejs.xrScene(); // Get the 3js sceen from xr3js.
              // Sync the xr controller's 6DoF position and camera paremeters with our scene.
              // XR8.XrController.updateCameraProjectionMatrix({
              //   origin: camera.position,
              //   facing: camera.quaternion,
              // });
            },
          });

          XR8.run({
            canvas,
            allowedDevices: XR8.XrConfig.device().ANY, //XR8.XrConfig.device().MOBILE_AND_HEADSETS
            sessionConfiguration: {
              optionalFeatures: {
                defaultEnvironment: {
                  // disabled: true,
                },
              },
            },
          });
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
