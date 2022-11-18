import React, { Fragment, useMemo, memo } from 'react';
import * as THREE from 'three';
import Image from './GalleryAssets/Image';
import Video from './GalleryAssets/Video';
import useStore from '../store';
import { calculatePositions } from '../utils/math';
import { UnrealBloomPass } from 'three-stdlib';
import { extend } from 'react-three-fiber';
import { Effects, MeshReflectorMaterial } from '@react-three/drei';

extend({ UnrealBloomPass });

// const ringEffects = {
//   opacity: 1,
//   toneMapped: false,
//   side: THREE.DoubleSide,
// };

// const materialRingsOuter = new THREE.MeshBasicMaterial({
//   ...ringEffects,
//   color: '#000',
// });

// const materialRingsCenter = new THREE.MeshBasicMaterial({
//   ...ringEffects,
//   color: '#000',
//   opacity: 0,
// });

// const geometryRings = new THREE.CylinderBufferGeometry(12.9, 12.9, 1, 32, 1, 1);

// Main component

const Level = ({ levelIndex }) => {
  const activeQuasar = useStore((state) => state.activeQuasar);

  const calculatedGalleryLayout = useMemo(() => {
    return activeQuasar.gallery.map((item, index) => {
      return calculatePositions(item.assets, 10);
    });
  }, [activeQuasar]);

  const assetGallery = calculatedGalleryLayout[levelIndex];

  return (
    <group>
      {/* <MeshReflectorMaterial
        reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      >
        <mesh position={[0, 1, 0]} geometry={geometryRings} material={materialRingsOuter} />
        <mesh position={[0, -1, 0]} geometry={geometryRings} material={materialRingsOuter} />
      </MeshReflectorMaterial> */}
      {/* <mesh
        position={[0, 0, 0]}
        geometry={geometryRings}
        material={materialRingsCenter}
        scale={[1, 7, 1.2]}
      /> */}
      {/* <mesh position={[0, -1.375, 0]} geometry={geometryRings} material={materialRingsOuter} /> */}
      {/* <directionalLight position={[0, 0, -5]} intensity={0.1} /> */}
      {assetGallery.map((asset, index) => {
        return (
          <Fragment key={index}>
            {asset.type === 'video' && (
              <Video
                initialPosition={[asset.x, asset.y, asset.z]}
                initialRotation={[0, asset.rotation, 0]}
                activePosition={[asset.activeX, asset.activeY, asset.activeZ]}
                url={asset.url}
                externalUrl={asset.linkOut}
              />
            )}
            {asset.type === 'image' || asset.type === 'gif' ? (
              <Image
                initialPosition={[asset.x, asset.y, asset.z]}
                initialRotation={[0, asset.rotation, 0]}
                activePosition={[asset.activeX, asset.activeY, asset.activeZ]}
                url={asset.url}
                type={asset.type}
                externalUrl={asset.linkOut}
              />
            ) : null}
          </Fragment>
        );
      })}
    </group>
  );
};

// https://codesandbox.io/s/jflps?file=/src/App.js:2700-2714
// https://codesandbox.io/s/bloom-hdr-workflow-gltf-whnhyr?file=/src/App.js

export default memo(Level);
