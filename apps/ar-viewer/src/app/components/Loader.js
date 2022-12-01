import { memo } from 'react';
import { Html, useProgress } from '@react-three/drei';
import { CircleProgress } from 'react-gradient-progress';

const Loader = () => {
  const { progress } = useProgress();

  return (
    <group position={[0, 0.5, -5]}>
      <Html center>
        <CircleProgress
          percentage={Number(progress.toFixed())}
          strokeWidth={10}
        />
      </Html>
    </group>
  );
};

export default memo(Loader);
