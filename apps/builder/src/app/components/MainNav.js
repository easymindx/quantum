import { useState } from 'react';
import {
  Button,
  Container,
  Form,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Offcanvas,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import useStore from '../store';

function MainNav() {
  const expand = 'lg';
  const projectData = useStore((state) => state.projectData);
  const setProjectId = useStore((state) => state.setProjectId);

  const projects = [
    { name: 'Quantum', id: '1' },
    { name: 'Coca Cola', id: '2' },
  ];

  return (
    <Navbar bg="dark" expand={expand} className="mb-3" variant="dark">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="#">
            <Image src={'../../assets/logo.webp'} alt="Logo" height="30" />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-${expand}`}
          aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <LinkContainer to="/">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>

              <LinkContainer to="/objects">
                <Nav.Link>Objects</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/artefacts">
                <Nav.Link>Artefacts</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/locations">
                <Nav.Link>Locations</Nav.Link>
              </LinkContainer>
            </Nav>

            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="#action2">My Account</Nav.Link>
              <NavDropdown
                title={projectData?.projectName}
                onSelect={(eventKey) => setProjectId(eventKey)}
              >
                {projects.map((project) => (
                  <NavDropdown.Item eventKey={project.id}>
                    {project.name}
                  </NavDropdown.Item>
                ))}

                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">
                  Add new project
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {/* <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form> */}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

export default MainNav;
