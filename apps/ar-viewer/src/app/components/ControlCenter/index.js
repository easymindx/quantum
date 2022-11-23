/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { memo, Suspense, useEffect, useRef } from 'react';
import { useGeolocated } from 'react-geolocated';
import GeoTracker from './GeoTracker';
// import QuasarSelector from './QuasarSelector';
import QuasarController from './QuasarController';
import ActionSheet from 'actionsheet-react';
import { calcCrow } from '../../utils/geo';
import useStore from '../../store';
import { useGLTF } from '@react-three/drei';
import { Routes, Route, useParams } from 'react-router-dom';
import { useSpring, animated } from '@react-spring/web';
import { Button } from 'react-bootstrap';

const QuasarLoader = () => {
  // const activeQuasar = useStore((state) => state.activeQuasar);
  // const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  // const [nearbyQuasars, setNearbyQuasars] = React.useState([]);
  // const isEngaged = useStore((state) => state.isEngaged);
  // const levaControls = useStore((state) => state.levaControls);
  // const { revealHidden } = levaControls;

  // get id param from the url
  const query = new URLSearchParams(window.location.search);
  // query api for quasar data
  // const id = query.get('id');
  // const quasarList = id ? [quasars.find((quasar) => quasar.id === id.toString())] : quasars;

  // const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
  //   positionOptions: {
  //     enableHighAccuracy: true,
  //   },
  //   watchPosition: true,
  //   userDecisionTimeout: 5000,
  // });

  // useEffect(() => {
  //   if (!coords) return;

  //   const nearbyQuasars = quasars.filter((quasar) => {
  //     const distance =
  //       calcCrow(coords.latitude, coords.longitude, quasar.geo.lat, quasar.geo.lon) * 1000;
  //     return distance < 100;
  //   });
  //   setNearbyQuasars(nearbyQuasars);
  // }, [coords]);

  // useEffect(() => {
  //   quasars.map((quasar) => {
  //     useGLTF.preload(`${quasar.modelSrc}`);
  //   });
  // }, []);

  // useEffect(() => {
  //   const nearbyQuasars = quasars.filter((quasar) => {
  //     const distance =
  //       calcCrow(coords.latitude, coords.longitude, quasar.geo.lat, quasar.geo.lon) * 1000;
  //     return distance < 100;
  //   });
  //   setNearbyQuasars(nearbyQuasars);
  // }, []);

  const sheetRef = useRef();

  const itemDetails = useStore((state) => state.itemDetails);
  const { bottom } = useSpring({
    bottom: itemDetails ? 0 : -200,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return (
    // <>
    //   {isEngaged && <QuasarController />}
    //   <>
    //     {/* <GeoTracker
    //         coords={coords}
    //         isGeolocationAvailable={isGeolocationAvailable}
    //         isGeolocationEnabled={isGeolocationEnabled}
    //       /> */}
    //     <QuasarSelector
    //       isVisible={isEngaged}
    //       nearbyQuasars={revealHidden ? quasarList : nearbyQuasars}
    //     />
    //   </>
    // </>
    // <QuasarSelector
    //   isVisible={isEngaged}
    //   nearbyQuasars={revealHidden ? quasarList : nearbyQuasars}
    // />
    <>
      <QuasarController />

      <animated.div
        className="actionsheet d-flex justify-content-center align-items-center flex-column"
        style={{ bottom }}
      >
        <h6 className="mb-1">{itemDetails?.title}</h6>
        <p>
          <small>{itemDetails?.description}</small>
        </p>
        {itemDetails?.externalLink && (
          <Button
            onClick={() => window.open(itemDetails?.externalLink, '_blank')}
            className="mx-1"
            variant="outline-light"
            size="sm"
          >
            Find out more
          </Button>
        )}
      </animated.div>
    </>
  );
};

export default QuasarLoader;
