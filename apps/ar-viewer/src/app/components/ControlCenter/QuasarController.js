/* eslint-disable jsx-a11y/no-redundant-roles */
import React, { useEffect, useState } from 'react';
import { Container, Button, Badge } from 'react-bootstrap';
import useStore from '../../store';
import { MdOutlineCenterFocusWeak, MdOutlineInfo } from 'react-icons/md';

const QuasarController = ({ XR8 }) => {
  const isGalleryMode = useStore((state) => state.isGalleryMode);
  const isCaught = useStore((state) => state.isCaught);
  const catchQuasar = useStore((state) => state.catchQuasar);
  const releaseQuasar = useStore((state) => state.releaseQuasar);
  const exitGalleryMode = useStore((state) => state.exitGalleryMode);
  const enterGalleryMode = useStore((state) => state.enterGalleryMode);
  const currentLevel = useStore((state) => state.currentLevel);

  const recenter = () => {
    //recenter the camera
    XR8.XrController.recenterCamera();
    // setTimeout(() => {
    //   catchQuasar();
    // }, 200);
    // releaseQuasar();
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

      <div className="d-flex align-items-center justify-content-center">
        {isCaught && (
          <>
            {isGalleryMode && (
              <Button
                onClick={() => recenter()}
                className="mx-1"
                variant="outline-light"
                size="md"
              >
                Center
              </Button>
            )}
            <Button
              onClick={() =>
                isGalleryMode ? exitGalleryMode() : enterGalleryMode()
              }
              className="mx-1 "
              variant={isGalleryMode ? 'light' : 'light'}
              size="md"
            >
              {isGalleryMode ? 'Exit Gallery Mode' : 'Enter Gallery Mode'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default QuasarController;
