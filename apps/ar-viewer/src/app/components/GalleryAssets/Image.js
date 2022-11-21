/* eslint-disable import/no-anonymous-default-export */
import React, { memo, useRef, useState, useEffect, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import GifLoader from 'three-gif-loader';
import useStore from '../../store';
import { Backdrop, Html, Sparkles, Text } from '@react-three/drei';
const gifLoader = new GifLoader();
const textureLoader = new THREE.TextureLoader();

const outerFrameColor = '#000';
const innerFrameColor = '#fff';

THREE.Object3D.prototype.lookAtWorld = function (vector) {
  this.parent.parent.worldToLocal(vector);
  this.lookAt(vector);
};

const Image = ({
  initialPosition,
  initialRotation,
  activePosition,
  url,
  externalUrl,
  type,
}) => {
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
      if (type === 'gif') {
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

  const _handleClick = () => {
    setIsClicked((isClicked) => !isClicked);
  };

  const { position, rotation, panelPosition, panelScale } = useSpring({
    position: isClicked ? activePosition : initialPosition,
    rotation: initialRotation,
    panelPosition: isClicked ? [0, -0.55, 0.5] : [0, -2, 0.5],
    panelScale: isClicked ? [1, 1, 1] : [0.5, 0, 0.5],
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
          side={THREE.BackSide}
          transparent={true}
          opacity={1}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.01]}
        scale={[1.2, 1.2, 1]}
        rotation={[0, 2.3, 0]}
      >
        <cylinderBufferGeometry
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

      {/* {isClicked && isGalleryMode && (
        <animated.group
          position={panelPosition}
          scale={panelScale}
          onClick={() => window.open(externalUrl, '_blank')}
        >
          <animated.mesh position={[0, 0, 0]} scale={[1.4, 0.3, 1]} rotation={[0, 2.24, 0]}>
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
      )} */}
    </animated.group>
  );
};

export default memo(Image);
