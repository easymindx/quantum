import { Row, Col, Container, Card } from 'react-bootstrap';

import Chart from '../components/Chart';

export function Dashboard() {
  return (
    <Container className="mb-4">
      <Row className="mb-2">
        <Col>
          <h1>Welcome, Alexx</h1>
          <p>Here are the engagement stats for the last 30 days.</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card bg="light" text="white">
            <Card.Body>
              <Chart />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
export default Dashboard;
