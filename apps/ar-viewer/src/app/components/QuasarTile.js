/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { memo, Suspense } from 'react';
import { Container, Card, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

const QuasarTile = ({ id, name }) => {
  const navigate = useNavigate();

  const setCurrentQuasar = useStore((state) => state.disengageQuasar);

  const _handleSelect = (quasar) => {
    setCurrentQuasar(`${id}.glb`);
    navigate('catcher');
  };

  return (
    <Card className="quasar-tile-wrapper mb-4">
      <Card.Img
        width="100%"
        onClick={() => _handleSelect()}
        variant="top"
        src={`/quasars/png/${id}.png`}
      />
      <Card.Body>
        <Card.Title>Quasar {name}</Card.Title>
        <Card.Body></Card.Body>
      </Card.Body>
    </Card>
  );
};

export default memo(QuasarTile);
