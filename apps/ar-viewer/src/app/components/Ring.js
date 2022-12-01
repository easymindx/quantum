import { memo } from 'react';
import * as THREE from 'three';
import randomcolor from 'randomcolor';

const Ring = ({ offset, isRandom, radius }) => {
  const meshMaterial = {
    side: THREE.BackSide,
    transparent: false,
    opacity: 1,
    thickness: 3,
    roughness: 0.6,
    clearcoat: 0.9,
    clearcoatRoughness: 0.3,
    transmission: 1,
    // ior: 1.2,
    envMapIntensity: 5,
    attenuationDistance: 5,
  };

  return (
    <mesh position={[0, offset, 0]}>
      <cylinderGeometry
        attach="geometry"
        args={[radius, radius, 0.1, 32, 1, true]}
      />
      <meshPhysicalMaterial
        attach="material"
        {...meshMaterial}
        color={isRandom ? randomcolor() : '#fff'}
      />
    </mesh>
  );
};

export default memo(Ring);
