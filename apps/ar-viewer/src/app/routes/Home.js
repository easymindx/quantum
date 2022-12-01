/* eslint-disable jsx-a11y/no-redundant-roles */

import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

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
      <Row>
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

          <p className="my-4 small">
            Quasars © 2022 Quantum Art. All Rights Reserved.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
