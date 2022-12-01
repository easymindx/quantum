import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

const customThreejsPipelineModule = () => {
  let scene3;
  let isSetup = false;

  const xrScene = () => {
    return scene3;
  };

  const trySetup = ({ canvas, canvasWidth, canvasHeight, GLctx }) => {
    console.log('Starting customThreejsPipelineModule...');
    if (isSetup) {
      return;
    }
    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(
      60.0 /* initial field of view; will get set based on device info later. */,
      canvasWidth / canvasHeight,
      0.01,
      1000.0,
    );
    scene.add(camera);

    const renderer = new window.THREE.WebGLRenderer({
      canvas,
      context: GLctx,
      alpha: false,
      antialias: true,
    });
    renderer.autoClear = false;
    renderer.setClearAlpha(0.0);
    renderer.setSize(canvasWidth, canvasHeight);
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    renderPass.clear = false;
    renderPass.clearDepth = true;
    composer.addPass(renderPass);

    scene3 = { scene, camera, renderer, composer };
    // Overwrite the default threejs getter in 8thwall so that you can get the effect composer as well
    window.XR8.Threejs.xrScene = xrScene;
    const e = new Event('customthreejsload');
    document.dispatchEvent(e);
    isSetup = true;
  };

  return {
    name: 'customthreejs',
    onStart: (args) => trySetup(args),
    onAttach: (args) => trySetup(args),
    onDetach: () => {
      isSetup = false;
    },
    onUpdate: ({ processCpuResult }) => {
      const realitySource =
        processCpuResult.reality || processCpuResult.facecontroller;

      if (!realitySource) {
        return;
      }

      const { rotation, position, intrinsics } = realitySource;
      const { camera } = scene3;

      for (let i = 0; i < 16; i++) {
        camera.projectionMatrix.elements[i] = intrinsics[i];
      }

      // Fix for broken raycasting in r103 and higher. Related to:
      //   https://github.com/mrdoob/three.js/pull/15996
      // Note: camera.projectionMatrixInverse wasn't introduced until r96 so check before setting
      // the inverse
      if (camera.projectionMatrixInverse) {
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
      }

      if (rotation) {
        camera.setRotationFromQuaternion(rotation);
      }
      if (position) {
        camera.position.set(position.x, position.y, position.z);
      }
    },
    onCanvasSizeChange: ({ canvasWidth, canvasHeight }) => {
      if (!isSetup) {
        return;
      }
      const { renderer } = scene3;
      renderer.setSize(canvasWidth, canvasHeight);
    },
    onRender: () => {
      // renderer.render(scene, camera)
      scene3.composer.render();
    },
    // Get a handle to the xr scene, camera and renderer. Returns:
    // {
    //   scene: The Threejs scene.
    //   camera: The Threejs main camera.
    //   renderer: The Threejs renderer.
    //   composer: The Threejs effect composer
    // }
    xrScene,
  };
};

export default customThreejsPipelineModule;
