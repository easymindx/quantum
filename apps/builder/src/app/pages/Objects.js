import { useEffect, useState } from 'react';
import {
  Button,
  Row,
  Col,
  Stack,
  Container,
  Card,
  Modal,
} from 'react-bootstrap';
import ModelViewer from '../components/ModelViewer';
import { useMediaQuery } from 'react-responsive';
import ModelPreviewCard from '../components/ModelPreviewCard';
import useStore from '../store';

const Objects = () => {
  const projectData = useStore((state) => state.projectData);

  const isMedium = useMediaQuery({
    query: '(min-width: 768px)',
  });

  return (
    <Container>
      <Stack
        direction={isMedium ? 'horizontal' : 'vertical'}
        className="justify-content-between mb-2"
      >
        <div>
          <h1>Objects</h1>
          <p>
            These are the current project assets that are available to locate in
            the Metaverse.
          </p>
        </div>
        <Button variant="dark">Add a new object</Button>
      </Stack>

      <Row>
        {projectData?.data?.map((asset, index) => (
          <Col sm={12} md={4} lg={3} key={index}>
            <ModelPreviewCard asset={asset} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default Objects;
