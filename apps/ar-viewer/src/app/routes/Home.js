/* eslint-disable jsx-a11y/no-redundant-roles */

import { PROJECTS } from 'constants/data';
import { Container, Row, Col, Button, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`catcher/${PROJECTS[0].id}/0`);
  };

  const handleSelectProject = (id) => {
    navigate(`catcher/${id}/0`);
  };

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
              Quasars, a new vision of the metaverse. Coming to Earth soon{' '}
              <span role="img" aria-label="Rocket">
                🚀
              </span>{' '}
              In design collaboration with 0xfar. By Quantum
            </p>
            <p>
              This is an early beta version of the AR Viewer. There may still be
              glitches. If you have a problem loading then please refresh the
              page.
            </p>
          </div>
          <Button onClick={handleSearch}>Begin the Search</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="text-white mb-2 small text-center">
            {PROJECTS.map(({ id, title }) => (
              <NavLink
                className="text-decoration-underline py-1"
                onClick={() => handleSelectProject(id)}
              >
                {title}
              </NavLink>
            ))}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
