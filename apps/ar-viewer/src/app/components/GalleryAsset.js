/* eslint-disable import/no-anonymous-default-export */
import React, {
  memo,
  useRef,
  useState,
  useEffect,
  Suspense,
  useCallback,
} from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import GifLoader from 'three-gif-loader';
import useStore from '../store';
import { Html } from '@react-three/drei';

const gifLoader = new GifLoader();
const textureLoader = new THREE.TextureLoader();

const outerFrameColor = '#000';
const innerFrameColor = '#fff';

THREE.Object3D.prototype.lookAtWorld = function (vector) {
  this.parent.parent.worldToLocal(vector);
  this.lookAt(vector);
};

const GalleryAsset = ({
  initialPosition,
  initialRotation,
  activePosition,
  url,
  externalUrl,
  type,
  id,
}) => {
  const video = type === 'video' ? document.createElement('video') : false;
  const [videoEl, setVideoEl] = useState();

  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const [isClicked, setIsClicked] = useState(false);
  const [imageDims, setImageDims] = useState({
    width: 0,
    height: 0,
    aspectRatio: 1,
  });
  const [texture, setTexture] = useState(null);

  const groupRef = useRef();
  const meshRef = useRef();

  useEffect(() => {
    const texture = () => {
      if (type === 'video') {
        video.setAttribute('id', id);
        video.src = url;
        video.muted = true;
        video.loop = true;
        video.autoplay = false;
        video.crossOrigin = 'anonymous';
        video.playsInline = true;
        video.currentTime = 1;
        video.oncanplaythrough = () => {
          setImageDims({
            width: video.videoWidth,
            height: video.videoHeight,
            aspectRatio: video.videoHeight / video.videoWidth,
          });
          setVideoEl(video);
          console.log('video', video);
        };
        return new THREE.VideoTexture(video);
      } else if (type === 'gif') {
        return gifLoader.load(url, (image) => {
          const { width, height } = image;
          if (width === 0 || height === 0) return;
          setImageDims({ width, height, aspectRatio: height / width });
        });
      } else {
        return textureLoader.load(url, ({ image }) => {
          const { width, height } = image;
          if (width === 0 || height === 0) return;
          setImageDims({ width, height, aspectRatio: height / width });
        });
      }
    };

    setTexture(texture);
  }, [type, url]);

  // function with callback
  // function with callback

  const _handleClick = () => {
    if (videoEl) {
      if (!isClicked) {
        videoEl.currentTime = 0;
        videoEl.play();
        videoEl.muted = false;
      } else {
        var isPlaying =
          videoEl.currentTime > 0 &&
          !videoEl.paused &&
          !videoEl.ended &&
          videoEl.readyState > videoEl.HAVE_CURRENT_DATA;
        if (isPlaying) {
          videoEl.pause();
        }
      }
    }
    setIsClicked((isClicked) => !isClicked);
  };

  const { position, rotation } = useSpring({
    position: isClicked ? activePosition : initialPosition,
    rotation: initialRotation,
    // panelPosition: isClicked ? [0, 1, 0.5] : [0, -1, 0.5],
    // panelScale: isClicked ? [1, 1, 1] : [0.5, 0, 0.5],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  // TODO: need to make this more accurate so that all image are rougly the same height

  useEffect(() => {
    if (!texture) return;
    texture.center = new THREE.Vector2(0.5, 0.5);
    texture.rotation = Math.PI;
    texture.flipY = false;
    // dont stretch the texture
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }, [texture]);

  useEffect(() => {
    const { aspectRatio } = imageDims;
    const scaleMultiplier = 3;
    groupRef.current.scale.set(
      scaleMultiplier / aspectRatio,
      scaleMultiplier,
      1
    );
  }, [imageDims]);

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={() => _handleClick()}
    >
      <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1]} rotation={[0, 2.3, 0]}>
        <cylinderGeometry
          attach="geometry"
          args={[1.2, 1.2, 1.2, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          attach="material"
          color={outerFrameColor}
          side={THREE.BackSide}
          castShadow
          transparent={true}
          opacity={1}
        />
      </mesh>
      <mesh
        position={[0, 0, 0.01]}
        scale={[1.2, 1.2, 1]}
        rotation={[0, 2.3, 0]}
      >
        <cylinderGeometry
          attach="geometry"
          args={[1.1, 1.1, 1.1, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          attach="material"
          color={innerFrameColor}
          side={THREE.BackSide}
          transparent={true}
          opacity={1}
        />
      </mesh>

      <mesh
        ref={meshRef}
        position={[0, 0, 0.02]}
        scale={[1.2, 1.2, 1]}
        rotation={[0, 2.3, 0]}
      >
        <cylinderGeometry
          attach="geometry"
          args={[1, 1, 1, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          side={THREE.BackSide}
          attach="material"
          map={texture}
        />
      </mesh>

      <spotLight position={[0, -1, 0]} intensity={0.15} />

      {/* {isClicked && isGalleryMode && (
        <animated.group
          position={panelPosition}
          scale={panelScale}
          onClick={() => window.open(externalUrl, '_blank')}
        >
          <mesh
            position={[0, 0, 0]}
            scale={[1.4, 0.5, 1]}
            rotation={[0, 2.24, 0]}
          >
            <cylinderGeometry
              attach="geometry"
              args={[1.1, 1.1, 1.1, 32, 1, true, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              attach="material"
              color={innerFrameColor}
              side={THREE.DoubleSide}
              transparent={true}
              opacity={0.5}
            />
          </mesh>

        </animated.group>
      )} */}
    </animated.group>
  );
};

export default memo(GalleryAsset);
