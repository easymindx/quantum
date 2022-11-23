/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import useStore from '../../store';

const QuasarController = ({ XR8 }) => {
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const releaseQuasar = useStore((state) => state.releaseQuasar);
  const exitGalleryMode = useStore((state) => state.exitGalleryMode);
  const enterGalleryMode = useStore((state) => state.enterGalleryMode);
  const isDesktopMode = useStore((state) => state.isDesktopMode);
  const currentLevel = useStore((state) => state.currentLevel);
  const setCurrentLevel = useStore((state) => state.setCurrentLevel);
  const activeQuasar = useStore((state) => state.activeQuasar);

  // get the three camera

  const recenter = () => {
    if (isDesktopMode) return;
    const { XR8 } = window;
    XR8.XrController.recenter();
  };

  const leaveGallery = () => {
    recenter();
    exitGalleryMode();
  };

  const handleRelease = () => {
    leaveGallery();
    releaseQuasar();
  };

  return !isCaught ? (
    <div className="d-flex justify-content-center align-items-center action-bar">
      {!isGalleryMode && <p className="mb-0 h6">Tap the Quasar!</p>}
    </div>
  ) : (
    <div className="d-flex justify-content-between align-items-center action-bar">
      <Dropdown onSelect={(eventKey) => setCurrentLevel(eventKey)}>
        <Dropdown.Toggle variant="outline-light" id="dropdown-basic" size="sm">
          Layer {currentLevel + 1}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {activeQuasar.gallery.map((layer, index) => (
            <Dropdown.Item
              key={`layer-${index}`}
              eventKey={index}
              active={currentLevel === index}
              href="#/action-1"
            >
              Layer {index + 1}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Button
        onClick={() => recenter()}
        className="mx-1"
        variant="outline-light"
        size="sm"
      >
        Center
      </Button>

      <div className="d-flex align-items-center justify-content-center">
        {isCaught && (
          <Button
            onClick={() =>
              isGalleryMode ? leaveGallery() : enterGalleryMode()
            }
            className="mx-1 "
            size="sm"
          >
            {isGalleryMode ? 'Exit Gallery Mode' : 'Enter Gallery Mode'}
          </Button>
        )}
      </div>

      {isCaught && (
        <Button
          onClick={() => handleRelease()}
          className="mx-1"
          variant="outline-light"
          size="sm"
        >
          Release
        </Button>
      )}
    </div>
  );
};

export default QuasarController;
