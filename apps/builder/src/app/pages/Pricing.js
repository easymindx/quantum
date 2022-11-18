import { Row, Col, Container, Card } from 'react-bootstrap';

import Chart from '../components/Chart';
import Plans from '../components/Pricing/Plans';
import PricingHeader from '../components/Pricing/PricingHeader';

export function Pricing() {
  return (
    <Container className="mb-4">
      <PricingHeader />
      <div className="container">
        <Plans />
      </div>
    </Container>
  );
}
export default Pricing;
