import React, { useRef, useEffect, memo, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import GalleryFrame from './GalleryFrame';
import useStore from '../store';
import useGalleryAsset from 'hooks/useGalleryAsset';

const GalleryAsset = (props) => {
  const {
    id,
    type,
    url,
    frame,
    initialPosition,
    initialRotation,
    activePosition,
  } = props;
  const setItemDetails = useStore((state) => state.setItemDetails);
  const itemDetails = useStore((state) => state.itemDetails);
  const { texture, videoElement, aspectRatio } = useGalleryAsset({
    type,
    url,
    frame,
  });
  const isPicked = useMemo(() => itemDetails?.id === id, [id, itemDetails]);
  const groupRef = useRef();
  const assetRef = useRef();
  const mountRef = useRef();
  const outerMountRef = useRef();

  const handleClick = () => {
    if (videoElement) {
      if (!isPicked) {
        videoElement.currentTime = 0;
        videoElement.play();
        videoElement.muted = false;
      } else {
        var isPlaying =
          videoElement.currentTime > 0 &&
          !videoElement.paused &&
          !videoElement.ended &&
          videoElement.readyState > videoElement.HAVE_CURRENT_DATA;
        if (isPlaying) {
          videoElement.pause();
        }
      }
    }
    setItemDetails(isPicked ? null : props);
  };

  const { position, rotation } = useSpring({
    position: isPicked ? activePosition : initialPosition,
    rotation: isPicked
      ? [
          initialRotation[0],
          initialRotation[1] + Math.PI * 2,
          initialRotation[2],
        ]
      : initialRotation,
    config: { mass: 3, tension: 200, friction: 30, clamp: !isPicked },
  });

  useEffect(() => {
    if (!texture) return;
    const scaleMultiplier = 0.5;
    const assetBounds = [scaleMultiplier / aspectRatio, scaleMultiplier];
    const mountPadding = 0.1;
    assetRef.current.scale.set(...assetBounds);
    mountRef.current.scale.set(
      ...assetBounds.map((bound) => bound + mountPadding),
    );
    outerMountRef.current.scale.set(
      ...assetBounds.map((bound) => bound + mountPadding + 0.1),
    );
  }, [texture, aspectRatio]);

  return texture ? (
    <animated.group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={handleClick}
    >
      {frame && <GalleryFrame url={frame.src} aspectRatio={aspectRatio} />}

      <mesh position={[0, 0, 0.0]} ref={outerMountRef}>
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color={'#000'}
          side={frame ? THREE.FrontSide : THREE.DoubleSide}
          transparent={true}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.011]} ref={mountRef}>
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color={'#fff'}
          side={THREE.FrontSide}
          transparent={true}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={assetRef} position={[0, 0, 0.012]} rotation={[0, 0, 0]}>
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          side={THREE.FrontSide}
          attach="material"
          map={texture}
        />
      </mesh>
    </animated.group>
  ) : null;
};

export default memo(GalleryAsset);
