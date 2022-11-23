import React, { Fragment, useMemo, memo } from 'react';
import Image from './GalleryAssets/Image';
import useStore from '../store';
import { calculatePositions } from '../utils/math';

const Layer = ({ levelIndex }) => {
  const activeQuasar = useStore((state) => state.activeQuasar);

  const calculatedGalleryLayout = useMemo(() => {
    return activeQuasar.gallery.map((item, index) => {
      return calculatePositions(item.assets, 15);
    });
  }, [activeQuasar]);

  const assetGallery = calculatedGalleryLayout[levelIndex];

  return (
    <group>
      {assetGallery.map((asset, index) => {
        return (
          <Fragment key={index}>
            <Image
              initialPosition={[asset.x, asset.y, asset.z]}
              initialRotation={[0, asset.rotation, 0]}
              activePosition={[asset.activeX, asset.activeY, asset.activeZ]}
              url={asset.url}
              type={asset.type}
              externalUrl={asset.linkOut}
              id={`asset-${index}`}
            />
          </Fragment>
        );
      })}
    </group>
  );
};

// https://codesandbox.io/s/jflps?file=/src/App.js:2700-2714
// https://codesandbox.io/s/bloom-hdr-workflow-gltf-whnhyr?file=/src/App.js

export default memo(Layer);
