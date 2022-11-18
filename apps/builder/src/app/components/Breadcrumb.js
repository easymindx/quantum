import { useEffect, useState } from 'react';
import { Breadcrumb as Crumb, Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';

const Breadcrumb = () => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState([]);

  useEffect(() => {
    setCurrentRoute(routes.find((route) => route.path === location.pathname));
  }, [location]);

  return (
    <Container className="mb-4">
      <Crumb>
        <LinkContainer to="/">
          <Crumb.Item href="#">Home</Crumb.Item>
        </LinkContainer>

        {currentRoute?.crumbtrail?.map((item) => {
          const isLast = item === currentRoute.crumbtrail.slice(-1)[0];

          return (
            <LinkContainer to={item.path}>
              <Crumb.Item href="#" active={isLast}>
                {item.name}
              </Crumb.Item>
            </LinkContainer>
          );
        })}
      </Crumb>
    </Container>
  );
};
export default Breadcrumb;

const routes = [
  {
    path: '/',
    crumbtrail: [
      {
        path: '/',
        name: 'Dashboard',
      },
    ],
  },
  {
    path: '/objects',
    crumbtrail: [
      {
        path: '/',
        name: 'Dashboard',
      },
      {
        path: '/objects',
        name: 'Objects',
      },
    ],
  },
  {
    path: '/artefacts',
    crumbtrail: [
      {
        path: '/',
        name: 'Dashboard',
      },
      {
        path: '/artefacts',
        name: 'Artefacts',
      },
    ],
  },
  {
    path: '/locations',
    crumbtrail: [
      {
        path: '/',
        name: 'Dashboard',
      },
      {
        path: '/locations',
        name: 'Locations',
      },
    ],
  },
];
