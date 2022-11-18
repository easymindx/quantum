import { Container, Col, Row } from 'react-bootstrap';

const footerLinks = {
  Features: ['Random feature', 'Random feature', 'Team feature'],
  About: ['Pricing plans', 'The Team', 'Privacy and Terms'],
  Resources: ['Overview', 'Developers', 'Another resource'],
  Support: ['Email Us', 'Twitter', 'Discord'],
};

const Footer = () => {
  const linkSections = Object.entries(footerLinks).map(([header, links]) => {
    return (
      <Col key={header} md={3}>
        <h5>{header}</h5>
        <ul className="list-unstyled text-small">
          {links.map((link) => (
            <li key={link}>
              <a href="top" className="text-muted">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </Col>
    );
  });
  return (
    <footer className="pt-4 my-md-5 pt-md-4 border-top">
      <Container>
        <Row>{linkSections}</Row>
      </Container>
    </footer>
  );
};

export default Footer;
