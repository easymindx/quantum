import {
  Container,
  Nav,
  Navbar,
  Offcanvas,
  Card,
  Row,
  Col,
  InputGroup,
  Form,
  Button,
} from 'react-bootstrap';

import useStore from '../store';
import { FaTwitterSquare, FaGlobe } from 'react-icons/fa';
import { useRef, useState } from 'react';

const OffcanvasExample = () => {
  const setActiveQuasar = useStore((state) => state.setActiveQuasar);
  const activeQuasar = useStore((state) => state.activeQuasar);
  const projectData = useStore((state) => state.projectData);
  const npointId = useStore((state) => state.npointId);
  const setNpointId = useStore((state) => state.setNpointId);
  const [projectCode, setProjectCode] = useState('1');
  const offCanvasRef = useRef();

  const closeOffCanvas = () => offCanvasRef?.current?.backdrop?.click();

  const expand = false; // breakpoint to expand the offcanvas

  return (
    <div className="top-bar ">
      <Navbar
        key={expand}
        variant="dark"
        bg="black"
        expand={expand}
        className="px-2"
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
                  <h2 className="h5 text-white mb-0">Nearby Quasars</h2>
                  <hr className="border-white" />
                </Col>
              </Row>

              <Row>
                {projectData?.quasars?.map((quasar, index) => (
                  <Col xs={4} className="mb-3" key={`mini-${index}`}>
                    <Card
                      style={{
                        opacity: activeQuasar?.id === quasar.id ? 1 : 0.4,
                      }}
                    >
                      <Card.Img
                        className={
                          activeQuasar?.id === quasar.id
                            ? 'bg-dark'
                            : 'bg-black'
                        }
                        onClick={() => {
                          setActiveQuasar(quasar);
                          closeOffCanvas();
                        }}
                        src={quasar.imageSrc}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row>
                <Col>
                  <hr className="border-white" />
                  <h2 className="h5 text-white">Project loader</h2>
                  <p className="text-white mb-2">
                    If you know the secret code to another Quasars sighting then
                    enter it here:
                  </p>
                </Col>
              </Row>

              <Row>
                <Col>
                  <InputGroup className="mb-3">
                    <Form.Control
                      aria-label="Project ID"
                      aria-describedby="basic-addon2"
                      onChange={(e) => setProjectCode(e.target.value)}
                      className="bg-black text-white border-dark"
                      defaultValue={npointId}
                    />
                    <Button
                      className="load-button"
                      variant="primary"
                      onClick={() => setNpointId(projectCode)}
                    >
                      Load
                    </Button>
                  </InputGroup>
                </Col>
              </Row>

              <Nav className="justify-content-end flex-grow-1 pe-3 ">
                <h2 className="h5 text-white mb-0">Vital Resources</h2>
                <hr className="border-white" />
                <Nav.Link
                  className="text-white"
                  target="_blank"
                  // href={`https://twitter.com/${projectData?.socials?.twitter}`}
                  href={`https://twitter.com/quasarsofficial`}
                >
                  <FaTwitterSquare
                    size={'1.5rem'}
                    className="me-2"
                    color="#1DA1F2"
                  />
                  {/* Follow Us @{projectData?.socials?.twitter} */}
                  Follow Us @QuasarsOfficial
                </Nav.Link>
                <Nav.Link
                  className="text-white"
                  target="_blank"
                  // href={projectData?.website}
                  href={'http://quasarsofficial.com'}
                >
                  <FaGlobe size={'1.5rem'} className="me-2" color="#2b2b2b" />
                  {/* Visit {projectData?.projectName} */}
                  Visit QuasarsOfficial.com
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
