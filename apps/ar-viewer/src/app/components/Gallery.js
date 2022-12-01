import { useSpring, animated } from '@react-spring/three';
import React, {
  useRef,
  memo,
  useMemo,
  useEffect,
  Fragment,
  useState,
  Suspense,
} from 'react';
import * as THREE from 'three';
import useStore from '../store';
import { calculatePositions } from '../utils/calculatePositions';
import { useFrame } from '@react-three/fiber';
import GalleryAsset from './GalleryAsset';
import Ring from './Ring';

const Gallery = ({ model }) => {
  const groupRef = useRef();
  const domeRef = useRef();

  const [layerIndex, setLayerIndex] = useState(0);
  const currentLevel = useStore((state) => state.currentLevel);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const itemDetails = useStore((state) => state.itemDetails);

  const galleryRadius = 2;

  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    scale: 1,
    rotation: [0, Math.PI, 0],
    config: { friction: 40, duration: 500 },

    onRest: () => {
      api.start((i) => {
        return {
          scale: 1,
          opacity: 1,
        };
      });
    },
  }));

  useEffect(() => {
    if (currentLevel === layerIndex) return;
    setTimeout(() => {
      setLayerIndex(currentLevel);
    }, 500);
    api.start((i) => {
      return {
        scale: 0.6,
        opacity: 0,
      };
    });
  }, [api, currentLevel, layerIndex]);

  useFrame((state, delta) => {
    if (!isDesktopMode || itemDetails) return;
    groupRef.current.rotation.y += delta * 0.075;
  });

  const calculatedGalleryLayout = useMemo(() => {
    return activeQuasar?.gallery.map((item, index) => {
      return calculatePositions(item.assets, galleryRadius - 0.2);
    });
  }, [activeQuasar, galleryRadius]);

  const assetGallery = calculatedGalleryLayout[layerIndex];

  useEffect(() => {
    if (!isDesktopMode) return;
    model?.scene?.traverse((node) => {
      if (node.isMesh) {
        if (node.name.includes('QUASAR_SKIN_OUT_M_003')) {
          domeRef.current.material = node.material;
          domeRef.current.material.envMapIntensity = 1;
        }
      }
    });
  }, [isDesktopMode, model]);

  const memoAssetGallery = useMemo(
    () =>
      assetGallery?.map((asset, index) => {
        return (
          <Fragment key={index}>
            <Suspense fallback={null}>
              <GalleryAsset
                initialPosition={[asset.x, asset.y, asset.z]}
                initialRotation={[0, asset.rotation, 0]}
                activePosition={[asset.activeX, asset.activeY, asset.activeZ]}
                url={asset.url}
                type={asset.type}
                externalLink={asset?.externalLink}
                frame={asset?.frame}
                title={asset?.title}
                description={asset?.description}
                id={`asset-${index}-levelIndex-${currentLevel}`}
              />
            </Suspense>
          </Fragment>
        );
      }),
    [assetGallery, currentLevel],
  );

  return (
    <group ref={groupRef}>
      <mesh ref={domeRef} visible={isDesktopMode}>
        <sphereGeometry
          attach="geometry"
          args={[galleryRadius + 0.1, 32, 32, 0, Math.PI * 2, 0, 1.4]}
        />
        <meshStandardMaterial attach="material" side={THREE.DoubleSide} />
      </mesh>

      {/* Merge meshes and memoize these. https://github.com/pmndrs/drei#merged */}
      <Ring offset={-0.22} isRandom radius={galleryRadius} />
      <Ring offset={-0.11} radius={galleryRadius} />
      <Ring offset={0} isRandom radius={galleryRadius} />
      <Ring offset={0.11} radius={galleryRadius} />
      <Ring offset={0.22} isRandom radius={galleryRadius} />
      <animated.group {...spring}>{memoAssetGallery}</animated.group>
    </group>
  );
};

export default memo(Gallery);
