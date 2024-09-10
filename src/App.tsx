import { useState } from 'react';
import GradientEditor from './GradientEditor';

const App = () => {
  const [defaultValue, setDefaultValue] = useState(
    'radial-gradient(circle, rgb(250,84,28) 0%, rgb(54,207,201) 25%, rgb(255,255,255) 50%, rgb(235,47,150) 75%)'
  );
  const onChange = (value: string) => setDefaultValue(value);
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 100px'
      }}
    >
      <div
        style={{ backgroundImage: defaultValue, height: 800, width: '100%', marginRight: 100 }}
      />
      <GradientEditor defaultValue={defaultValue} onChange={onChange} />
    </div>
  );
};

export default App;
