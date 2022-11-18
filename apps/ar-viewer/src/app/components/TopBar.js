import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Card, Row, Col } from 'react-bootstrap';

import useStore from '../store';
import { FaTwitterSquare, FaBeer } from 'react-icons/fa';
import { useEffect, useRef } from 'react';

const OffcanvasExample = () => {
  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const offCanvasRef = useRef();

  const closeOffCanvas = () => offCanvasRef?.current?.backdrop?.click();

  const expand = false;
  return (
    <div className="top-bar">
      <Navbar
        key={expand}
        variant="dark"
        bg="black"
        expand={expand}
        className="mx-2"
      >
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="https://storage.googleapis.com/assets.quasarsofficial.com/demo/logo.webp"
              alt="logo"
              width="160"
              className="d-inline-block align-top "
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            ref={offCanvasRef}
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
            className="bg-light text-dark"
          >
            <Offcanvas.Header
              closeButton
              style={{
                backgroundColor: '#111',
                color: 'white',
              }}
            >
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Control Center
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column ">
              <Row>
                <Col>
                  <h2 className="h5">Nearby Quasars</h2>

                  <hr />
                </Col>
              </Row>

              <Row>
                <Col xs={4} className="mb-3">
                  <Card
                    className={`${
                      activeQuasar === quasars[1]
                        ? 'bg-white '
                        : 'bg-transparent'
                    } text-dark`}
                    style={{
                      width: 100,
                      height: 100,
                      border:
                        activeQuasar === quasars[1] ? '1px solid #bbb' : 'none',
                    }}
                  >
                    <Card.Img
                      onClick={() => {
                        setActiveQuasar(quasars[1]);
                        closeOffCanvas();
                      }}
                      style={{ height: 100 }}
                      src="https://storage.googleapis.com/assets.quasarsofficial.com/brands/coca-cola/Screenshot%202022-11-16%20at%2018.54.58.png"
                    />
                  </Card>
                </Col>
                <Col xs={4} className="mb-3">
                  <Card
                    className={`${
                      activeQuasar === quasars[0]
                        ? 'bg-white '
                        : 'bg-transparent'
                    } text-dark`}
                    style={{
                      width: 100,
                      height: 100,
                      border:
                        activeQuasar === quasars[0] ? '1px solid #bbb' : 'none',
                    }}
                  >
                    <Card.Img
                      onClick={() => {
                        setActiveQuasar(quasars[0]);
                        closeOffCanvas();
                      }}
                      src="https://storage.googleapis.com/assets.quasarsofficial.com/brands/coca-cola/QUASAR_BATCH037_COLA_FRAME00133.png"
                    />
                  </Card>
                </Col>

                {/*  <Col xs={4} className="mb-3">
                  <Card
                    className={`${
                      activeQuasar === quasars[2] ? 'bg-white ' : 'bg-transparent'
                    } text-dark`}
                    style={{ border: activeQuasar === quasars[2] ? '1px solid #bbb' : 'none' }}
                  >
                    <Card.Img
                      onClick={() => {
                        setActiveQuasar(quasars[2]);
                        closeOffCanvas();
                      }}
                      src="https://storage.googleapis.com/assets.quasarsofficial.com/quasar-app/QUASAR_BATCH006_FRAME1650.png"
                    />
                  </Card>
                </Col> */}
              </Row>

              <Nav className="justify-content-end flex-grow-1 pe-3 ">
                <h2 className="h5">Vital Resources</h2>
                <hr />
                <Nav.Link
                  className="text-dark"
                  target="_blank"
                  href="https://twitter.com/quasarsofficial"
                >
                  <FaTwitterSquare
                    size={'1.5rem'}
                    className="me-2"
                    color="#1DA1F2"
                  />
                  Follow Us @CocaCola
                </Nav.Link>
                <Nav.Link
                  className="text-dark"
                  target="_blank"
                  href="https://www.coca-cola.com/"
                >
                  <FaBeer size={'1.5rem'} className="me-2" color="#2b2b2b" />
                  Visit CocaCola.com
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
};

export default OffcanvasExample;
