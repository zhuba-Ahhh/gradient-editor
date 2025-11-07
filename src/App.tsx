import { useEffect, useState } from 'react';
import GradientEditor from './GradientEditor';
import { gradientPresets } from './const';
import GradientDisplay from './components/GradientDisplay';
import PresetGallery from './components/PresetGallery';
import styles from './App.module.less';

const App = () => {
  const [defaultValue, setDefaultValue] = useState<string>('');

  const onChange = (value: string) => {
    setDefaultValue(value);
    localStorage.setItem('gradient', value);
  };

  useEffect(() => {
    const storedGradient = localStorage.getItem('gradient');
    if (storedGradient) {
      setDefaultValue(storedGradient);
    }
  }, []);

  const handlePresetClick = (css: string) => {
    setDefaultValue(css);
    localStorage.setItem('gradient', css);
  };

  return (
    <div className={styles.app}>
      <div className={styles.mainContainer}>
        <GradientDisplay gradientValue={defaultValue} />
        <div className={styles.editorContainer}>
          <PresetGallery
            presets={gradientPresets}
            onPresetClick={handlePresetClick}
          />
          <GradientEditor defaultValue={defaultValue} onChange={onChange} />
        </div>
      </div>
    </div>
  );
};

export default App;
