/* eslint-disable import/no-anonymous-default-export */
import { useFrame, useThree } from '@react-three/fiber';
import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
  memo,
  Suspense,
} from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import useStore from '../../store';
import { Html } from '@react-three/drei';

const video = document.createElement('video');
video.muted = true;
video.loop = true;
video.autoplay = false;
video.crossOrigin = 'anonymous';
video.playsInline = true;

const outerFrameColor = '#000';
const innerFrameColor = '#fff';

// TODO: Combine this with the Image component to create a single component that can handle both videos and images

const Video = ({
  initialPosition,
  initialRotation,
  activePosition,
  url,
  externalUrl,
  ifClicked,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [yScale, setYScale] = useState(0);

  const [imageDims, setImageDims] = useState({
    width: 0,
    height: 0,
    aspectRatio: 1,
  });
  const [texture, setTexture] = useState(null);
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const groupRef = useRef();
  const meshRef = useRef();

  video.oncanplaythrough = () => {
    setImageDims({
      width: video.videoWidth,
      height: video.videoHeight,
      aspectRatio: video.videoHeight / video.videoWidth,
    });
    setYScale(yScale);
  };

  useEffect(() => {
    const texture = () => {
      return new THREE.VideoTexture(video);
    };

    video.src = url;
    video.currentTime = 1;
    // bug with video not displaying on first load
    video.play();

    var isPlaying =
      video.currentTime > 0 &&
      !video.paused &&
      !video.ended &&
      video.readyState > video.HAVE_CURRENT_DATA;

    if (isPlaying) {
      video.pause();
    }

    setTexture(texture);
  }, [url]);

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
    if (imageDims.aspectRatio < 1) {
      groupRef.current.scale.set(4.5, 3.5, 1);
    } else if (imageDims.aspectRatio > 1) {
      groupRef.current.scale.set(
        3.5 / imageDims.aspectRatio >= 3.5 ? 3.5 : 3.5 / imageDims.aspectRatio,
        3.5,
        1
      );
    } else {
      groupRef.current.scale.set(3.5, 3.5, 1);
    }
  }, [imageDims]);

  const _handleClick = () => {
    video.currentTime = 0;
    if (!isClicked) {
      setTimeout(function () {
        video.play();
        video.muted = false;
      }, 100);
    } else {
      setTimeout(function () {
        video.pause();
        video.muted = true;
      }, 100);
    }
    setIsClicked((isClicked) => !isClicked);
  };

  const { position, rotation, panelPosition, panelScale } = useSpring({
    position: isClicked ? activePosition : initialPosition,
    rotation: initialRotation,
    panelPosition: isClicked ? [0, -0.55, 0.5] : [0, -2, 0.5],
    panelScale: isClicked ? [1, 1, 1] : [0.5, 0, 0.5],
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={() => _handleClick()}
    >
      <mesh position={[0, 0, 0]} scale={[1.2, 1.2, 1]} rotation={[0, 2.3, 0]}>
        <cylinderBufferGeometry
          attach="geometry"
          args={[1.2, 1.2, 1.2, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          attach="material"
          color={outerFrameColor}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={1}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.01]}
        scale={[1.2, 1.2, 1]}
        rotation={[0, 2.3, 0]}
      >
        {/* <planeGeometry attach="geometry" /> */}
        <cylinderBufferGeometry
          attach="geometry"
          args={[1.1, 1.1, 1.1, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          attach="material"
          color={innerFrameColor}
          side={THREE.DoubleSide}
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
        <cylinderBufferGeometry
          attach="geometry"
          args={[1, 1, 1, 32, 1, true, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          side={THREE.BackSide}
          attach="material"
          map={texture}
        />
      </mesh>

      {isClicked && isGalleryMode && (
        <animated.group
          position={panelPosition}
          scale={panelScale}
          onClick={() => window.open(externalUrl, '_blank')}
        >
          <animated.mesh
            position={[0, 0, 0]}
            scale={[1.4, 0.3, 1]}
            rotation={[0, 2.24, 0]}
          >
            <cylinderBufferGeometry
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
          </animated.mesh>
          <Html position={[-0.1, 0.1, 0]}>
            <img
              onClick={() => window.open(externalUrl, '_blank')}
              width="80"
              src="https://www.pngall.com/wp-content/uploads/12/Gesture-Click-PNG-File.png"
            />
          </Html>
        </animated.group>
      )}
    </animated.group>
  );
};

export default Video;
