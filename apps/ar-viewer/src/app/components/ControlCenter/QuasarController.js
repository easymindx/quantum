/* eslint-disable jsx-a11y/no-redundant-roles */
import React from 'react';
import { Button } from 'react-bootstrap';
import useStore from '../../store';

const QuasarController = ({ XR8 }) => {
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const releaseQuasar = useStore((state) => state.releaseQuasar);
  const exitGalleryMode = useStore((state) => state.exitGalleryMode);
  const enterGalleryMode = useStore((state) => state.enterGalleryMode);

  // get the three camera

  const recenter = () => {
    const { XR8 } = window;
    XR8.XrController.recenter();
  };

  const leaveGallery = () => {
    const { XR8 } = window;
    XR8.XrController.recenter();
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
            variant={isGalleryMode ? 'light' : 'light'}
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
