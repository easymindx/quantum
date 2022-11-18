/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import { Table } from 'react-bootstrap';

const GeoTracker = ({ isGeolocationAvailable, isGeolocationEnabled, coords }) => {
  return !isGeolocationAvailable ? (
    <div>Your browser does not support Geolocation</div>
  ) : !isGeolocationEnabled ? (
    <div>Geolocation is not enabled</div>
  ) : coords ? (
    <Table>
      <tbody>
        <tr>
          <th>lat</th>
          <th>lon</th>
          <th>alt</th>
          {/* <th>heading</th> */}
          <th>speed</th>
        </tr>
        <tr>
          <td>{coords.latitude?.toFixed(3)}</td>
          <td>{coords.longitude?.toFixed(3)}</td>
          <td>{coords.altitude?.toFixed(2)}</td>
          {/* <td>{coords.heading}</td> */}
          <td>{coords.speed?.toFixed(2)}</td>
        </tr>
      </tbody>
    </Table>
  ) : (
    <div>Getting current location &hellip; </div>
  );
};

export default GeoTracker;
