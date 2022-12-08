import QuasarController from './QuasarController';
import useStore from 'store';
import { useSpring, animated } from '@react-spring/web';
import { Button } from 'react-bootstrap';

const ControlCenter = () => {
  const itemDetails = useStore((state) => state.itemDetails);
  const { bottom } = useSpring({
    bottom: itemDetails ? 0 : -200,
    config: { mass: 1, tension: 200, friction: 20 },
  });

  return itemDetails ? (
    <animated.div
      className="actionsheet d-flex justify-content-center align-items-center flex-column"
      style={{ bottom }}
    >
      <h6 className="mb-1">{itemDetails?.title}</h6>
      <p>{itemDetails?.description}</p>
      <div>
        <Button
          onClick={() => useStore.setState({ itemDetails: null })}
          className="mx-1"
          variant="outline-light"
          size="sm"
        >
          Close
        </Button>
        {itemDetails?.externalLink && (
          <Button
            onClick={() => window.open(itemDetails?.externalLink, '_blank')}
            className="mx-1"
            variant="outline-light"
            size="sm"
          >
            Find out more
          </Button>
        )}
      </div>
    </animated.div >
  ) : (
    <QuasarController />
  )
};

export default ControlCenter;
