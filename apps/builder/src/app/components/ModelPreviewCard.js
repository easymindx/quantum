import { useState } from 'react';
import { Button, Card, Modal } from 'react-bootstrap';
import ModelViewer from './ModelViewer';

const ModelPreviewCard = ({ asset }) => {
  const { imageSrc, modelSrc, project, name, description } = asset;

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  console.log('asset', asset);

  return (
    <>
      <Card>
        <Card.Img variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            Project: {project}
          </Card.Subtitle>

          <Card.Text>{description}</Card.Text>
          <Card.Link href="#">Edit</Card.Link>
          <Card.Link onClick={handleShow}>3D Viewer</Card.Link>
          <Card.Link href="#">Show QR</Card.Link>
        </Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose} animation={false} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ModelViewer src={modelSrc}></ModelViewer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelPreviewCard;
