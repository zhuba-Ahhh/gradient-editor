import React, { useState } from 'react';
import styles from './PresetGradientCard.module.less';

interface PresetGradientCardProps {
  name: string;
  css: string;
  onClick: (css: string) => void;
}

const PresetGradientCard: React.FC<PresetGradientCardProps> = ({ name, css, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    onClick(css);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`${styles.card} ${isHovered ? styles.cardHovered : ''}`}
      style={{ background: css }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.cardLabel}>{name}</span>
    </div>
  );
};

export default PresetGradientCard;
