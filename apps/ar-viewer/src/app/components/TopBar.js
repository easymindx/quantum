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
  NavLink,
} from 'react-bootstrap';

import useStore from '../store';
import { FaGlobe } from 'react-icons/fa';
import { GiWoodFrame } from 'react-icons/gi';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PROJECTS } from 'constants/data';

const TopBar = () => {
  const navigate = useNavigate();
  const { projectId, quasarIdx } = useParams();
  const offCanvasRef = useRef();
  const projectData = useStore((state) => state.projectData);
  const [projectCode, setProjectCode] = useState();

  const closeTopbar = () => {
    offCanvasRef.current.backdrop.click();
  };

  const handleSelectProject = (id) => {
    navigate(`/catcher/${id}/0`);
    closeTopbar();
  };

  const handleSelectQuasar = (idx) => {
    navigate(`/catcher/${projectId}/${idx}`);
    closeTopbar();
  };

  const handleLoadProject = () => {
    if (projectCode) {
      navigate(`/catcher/${projectCode}/0`);
      closeTopbar();
    }
  };

  return (
    <div className="top-bar ">
      <Navbar variant="dark" bg="black" expand={false} className="px-2">
        <Container fluid>
          <Navbar.Brand href="#">
            <img
              src="../assets/logo.webp"
              alt="logo"
              width="160"
              className="d-inline-block align-top "
            />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Offcanvas
            ref={offCanvasRef}
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
              <Offcanvas.Title>
                {projectData?.projectName || 'Control Center'}
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="d-flex flex-column ">
              <Row>
                <Col>
                  <h2 className="h6 text-white mb-0">Nearby Quasars</h2>
                  <hr className="border-white" />
                </Col>
              </Row>

              <Row>
                {projectData?.quasars?.map((quasar, idx) => (
                  <Col xs={4} className="mb-3" key={`mini-${idx}`}>
                    <Card
                      style={{
                        opacity: Number(quasarIdx) === idx ? 1 : 0.4,
                        border:
                          Number(quasarIdx) === idx
                            ? '2px solid #5a5a5a'
                            : 'none',
                      }}
                    >
                      <Card.Img
                        className={
                          Number(quasarIdx) === idx ? 'bg-dark' : 'bg-black'
                        }
                        onClick={() => handleSelectQuasar(idx)}
                        src={quasar.imageSrc}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row>
                <Col>
                  <h2 className="h6 text-white">Project loader</h2>
                  <hr className="border-white" />
                  <p className="text-white mb-2 small">
                    If you have a secret code to another Quasar sighting then
                    enter it below, or choose a public gallery.
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
                    />
                    <Button
                      className="load-button"
                      variant="primary"
                      onClick={handleLoadProject}
                    >
                      Load
                    </Button>
                  </InputGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  {PROJECTS.map(({ id, title }) => (
                    <p key={id} className="text-white mb-2 small">
                      <NavLink
                        className="text-decoration-underline"
                        onClick={() => handleSelectProject(id)}
                      >
                        {title}
                        {projectId === id && <span>(loaded)</span>}
                      </NavLink>
                    </p>
                  ))}
                </Col>
              </Row>

              <Nav className="justify-content-end flex-grow-1 pe-3 ">
                <h2 className="h6 text-white mb-0">Vital Resources</h2>
                <hr className="border-white" />
                <Nav.Link
                  className="text-white small"
                  target="_blank"
                  href={`https://twitter.com/quasarsofficial`}
                >
                  <img
                    alt="twitter"
                    src="../assets/twitter.png"
                    width="25px"
                    className="me-2"
                  />
                  Follow Us @QuasarsOfficial
                </Nav.Link>
                <Nav.Link
                  className="text-white small"
                  target="_blank"
                  href={'https://quasarsofficial.com'}
                >
                  <FaGlobe size={'1.5rem'} className="me-2" color="#fff" />
                  Visit QuasarsOfficial.com
                </Nav.Link>
                <Nav.Link
                  className="text-white small"
                  target="_blank"
                  href={'https://frahm.art'}
                >
                  <GiWoodFrame size={'1.5rem'} className="me-2" color="#fff" />
                  Frames by frahm.art
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
};

export default TopBar;
