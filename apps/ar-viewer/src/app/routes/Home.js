/* eslint-disable jsx-a11y/no-redundant-roles */

import { Container, Row, Col, Button, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import useStore from '../store';

const Home = () => {
  const navigate = useNavigate();
  const npointId = useStore((state) => state.npointId);
  const setNpointId = useStore((state) => state.setNpointId);

  return (
    <Container
      fluid
      className="home-wrapper vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <Row>
        <Col>
          <img width={300} src="../assets/logo.webp" alt="Logo" />
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="text-center">
          <h2 className="my-4 h4">AR Viewer - Art Basel Demo</h2>
          <div className="my-4">
            <p>
              Quasars, a new vision of the metaverse. Coming to Earth soon 🚀 In
              design collaboration with 0xfar. By Quantum
            </p>
            <p>
              This is an early beta version of the AR Viewer. There may still be
              glitches. If you have a problem loading then please refresh the
              page.
            </p>
          </div>
          <Button variant="outline-light" onClick={() => navigate('catcher')}>
            Begin the Search
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-white mb-2 small text-center">
            <NavLink
              className="text-decoration-underline py-1"
              onClick={() => {
                setNpointId('830360b5f6a82edd4912');
                navigate('catcher');
              }}
            >
              Quantum Art
            </NavLink>

            <NavLink
              className="text-decoration-underline py-1"
              onClick={() => {
                setNpointId('762b08b394182b77740f');
                navigate('catcher');
              }}
            >
              Punks Gallery
            </NavLink>

            <NavLink
              className="text-decoration-underline py-1"
              onClick={() => {
                setNpointId('f6099f67668d69ff87b2');
                navigate('catcher');
              }}
            >
              WME Agency
            </NavLink>

            <NavLink
              className="text-decoration-underline py-1"
              onClick={() => {
                setNpointId('9c2bfdfd376f473d072c');
                navigate('catcher');
              }}
            >
              Curio Cards Full Set
            </NavLink>

            <NavLink
              className="text-decoration-underline py-1"
              onClick={() => {
                setNpointId('4d7719691b367df71b54');
                navigate('catcher');
              }}
            >
              Alexx's Cyber Brokers
            </NavLink>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
