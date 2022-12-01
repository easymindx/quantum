/* eslint-disable import/no-anonymous-default-export */
import React, { useRef, useState, useEffect, Suspense, memo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import GifLoader from 'three-gif-loader';
import useStore from '../store';
import { Preload, useGLTF } from '@react-three/drei';

const gifLoader = new GifLoader();
const textureLoader = new THREE.TextureLoader();

const GalleryAsset = ({
  initialPosition,
  initialRotation,
  activePosition,
  url,
  title,
  description,
  frame,
  externalLink,
  type,
  id,
}) => {
  const setItemDetails = useStore((state) => state.setItemDetails);
  const itemDetails = useStore((state) => state.itemDetails);
  const video = type === 'video' ? document.createElement('video') : false;

  const [videoEl, setVideoEl] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const [imageDims, setImageDims] = useState(null);
  const [texture, setTexture] = useState(null);
  const groupRef = useRef();
  const assetRef = useRef();
  const mountRef = useRef();
  const outerMountRef = useRef();
  const frameRef = useRef();

  // TESTING FRAMES

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
  }, [id, type, url]); // Warning... do NOT add 'video' into the callback array. It will cause an infinite loop.

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
    setItemDetails(
      !isClicked
        ? {
            id: id,
            title: title,
            description: description,
            externalLink: externalLink,
          }
        : null,
    );
  };

  useEffect(() => {
    if (!itemDetails || itemDetails.id !== id) {
      setIsClicked(false);
    }
  }, [id, itemDetails]);

  const { position, rotation } = useSpring({
    position: isClicked ? activePosition : initialPosition,
    rotation: isClicked
      ? [
          initialRotation[0],
          initialRotation[1] + Math.PI * 2,
          initialRotation[2],
        ]
      : initialRotation,
    config: { mass: 3, tension: 200, friction: 30, clamp: !isClicked },
  });

  useEffect(() => {
    if (!imageDims) return;
    const { aspectRatio } = imageDims;
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
  }, [imageDims, url]);

  const Frame = ({ frameSrc, imageSrc }) => {
    const { scene } = useGLTF(frameSrc);
    const copiedScene = scene.clone();

    useEffect(() => {
      // if you put 'copiedScene' here.. it messes up again. No idea why.
      const frameBox = new THREE.Box3().setFromObject(scene);

      let frameBounds = {
        x: Math.abs(frameBox.max.x - frameBox.min.x),
        y: Math.abs(frameBox.max.y - frameBox.min.y),
        z: Math.abs(frameBox.max.z - frameBox.min.z),
      };

      let outerMountBounds = {
        x: Math.abs(outerMountRef.current.scale.x),
        y: Math.abs(outerMountRef.current.scale.y),
        z: 0.05,
      };

      let lengthRatios = [
        outerMountBounds.x / frameBounds.x,
        outerMountBounds.y / frameBounds.y,
        outerMountBounds.z / frameBounds.z,
      ];

      frameRef.current.scale.set(...lengthRatios);

      copiedScene.traverse((child) => {
        if (child.isMesh && frame?.reTextureize) {
          // TODO: Get better naming of meshes from Frahm (the frame makers)
          if (child.name.includes('instance')) {
            const { color, roughness, metalness } = child.material;
            const newMaterial = new THREE.MeshPhysicalMaterial({
              color,
              roughness,
              metalness,
            });

            child.material = newMaterial;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });
    }, [copiedScene, imageSrc, scene]);

    return <primitive object={copiedScene} />;
  };

  return (
    <animated.group ref={groupRef} position={position} rotation={rotation}>
      {frame && texture && (
        <animated.group ref={frameRef} position={[0, 0, 0.01]}>
          <Suspense fallback={null}>
            <Preload all />
            <Frame frameSrc={frame.src} imageSrc={url} />
          </Suspense>
        </animated.group>
      )}

      <mesh position={[0, 0, 0.0]} ref={outerMountRef}>
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color={'#000'}
          side={frame ? THREE.FrontSide : THREE.DoubleSide}
          transparent={true}
        />
      </mesh>
      <mesh position={[0, 0, 0.011]} ref={mountRef}>
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color={'#fff'}
          side={THREE.FrontSide}
          transparent={true}
        />
      </mesh>
      <mesh
        ref={assetRef}
        position={[0, 0, 0.012]}
        rotation={[0, 0, 0]}
        onClick={() => _handleClick()}
      >
        <planeGeometry attach="geometry" />
        <meshStandardMaterial
          side={THREE.FrontSide}
          attach="material"
          map={texture}
        />
      </mesh>
    </animated.group>
  );
};

export default memo(GalleryAsset);
