import React from 'react';
import PresetGradientCard from './PresetGradientCard';
import styles from './PresetGallery.module.less';

interface Preset {
  name: string;
  css: string;
}

interface PresetGalleryProps {
  presets: Preset[];
  onPresetClick: (css: string) => void;
}

const PresetGallery: React.FC<PresetGalleryProps> = ({ presets, onPresetClick }) => {
  return (
    <div className={styles.gallery}>
      <h3 className={styles.title}>预设渐变</h3>
      <div className={styles.cardsContainer}>
        {presets.map((preset, index) => (
          <PresetGradientCard
            key={index}
            name={preset.name}
            css={preset.css}
            onClick={onPresetClick}
          />
        ))}
      </div>
    </div>
  );
};

export default PresetGallery;