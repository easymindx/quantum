/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useEffect, useState } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import useStore from '../../store';
import { MdOutlineCenterFocusWeak, MdOutlineInfo } from 'react-icons/md';
import { useThree } from 'react-three-fiber';

const QuasarController = ({ XR8 }) => {
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const releaseQuasar = useStore((state) => state.releaseQuasar);
  const exitGalleryMode = useStore((state) => state.exitGalleryMode);
  const enterGalleryMode = useStore((state) => state.enterGalleryMode);
  const currentLevel = useStore((state) => state.currentLevel);

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

  return !isCaught ? (
    <div className="d-flex justify-content-center align-items-center action-bar">
      {!isGalleryMode && (
        <p className="mb-0 h6">Tap the Quasar to catch or release!</p>
      )}
    </div>
  ) : (
    <div className="d-flex justify-content-center align-items-center action-bar">
      {/* <div className="d-flex align-items-center">
        {isGalleryMode ? (
          <p className="mb-0 h6">
            Level {currentLevel + 1} / 3 <br />
            <span className="small">Swipe rings up / down</span>
          </p>
        ) : (
          <p className="mb-0 h6">Tap Quasar to release</p>
        )}
      </div> */}

      <Button
        onClick={() => recenter()}
        className="mx-1"
        variant="outline-light"
        size="md"
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
            size="md"
          >
            {isGalleryMode ? 'Exit Gallery Mode' : 'Enter Gallery Mode'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuasarController;
