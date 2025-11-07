import React from 'react';
import styles from './GradientDisplay.module.less';

interface GradientDisplayProps {
  gradientValue: string;
}

const GradientDisplay: React.FC<GradientDisplayProps> = ({ gradientValue }) => {
  return (
    <div
      className={styles.display}
      style={{ backgroundImage: gradientValue }}
    />
  );
};

export default GradientDisplay;
