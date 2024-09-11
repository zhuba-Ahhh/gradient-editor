import { useState, useEffect, useCallback } from 'react';

import { ColorEditor, InputNumber, Panel, Select } from '../components';

import css from './index.module.less';
import { AddButton, Angle, Circle, Ellipse, Linear, MinusButton, Radial } from './icon';
import {
  ShapeType,
  GradientType,
  GradientStop,
  parseGradient,
  GradientEditorProps,
  shapeOptions,
  gradientOptions,
  ParseGradient
} from './constants';
import { uuid } from '../utils';
import GradientPanel from './GradientPanel';
import PanelRender from './PanelRender';

export default function GradientEditor({ defaultValue, onChange }: GradientEditorProps) {
  const [gradientType, setGradientType] = useState<GradientType>('linear');
  const [shapeType, setShapeType] = useState<ShapeType>('ellipse');
  const [deg, setDeg] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>([]);

  useEffect(() => {
    if (defaultValue) {
      const { type, direction, stops } = ParseGradient(defaultValue);
      setGradientType(type);
      if (type === 'linear' && direction) {
        setDeg(parseInt(direction));
      } else if (direction) {
        setShapeType(direction as ShapeType);
      }
      if (stops.length > 0) {
        setStops(stopSort(stops));
      }
    }
  }, [defaultValue]);

  const changeStops = (newStops: GradientStop[]) => {
    setStops(stopSort(newStops));
  };

  const stopSort = useCallback(
    (arr: GradientStop[]) => arr.sort((a, b) => (a.position || 0) - (b.position || 0)),
    []
  );

  const addColor = useCallback(() => {
    const { color = 'rgba(255,255,255,1)', position = 50 } = stops[stops.length - 1] || {};
    changeStops([
      ...stops,
      {
        // 可以继续对齐figma
        color: color,
        position: position + 10 <= 100 ? position + 10 : 100,
        id: uuid()
      }
    ]);
  }, [stops]);

  const removeColor = useCallback(
    (id: string) => {
      changeStops(stops.filter(({ id: _id }) => id !== _id));
    },
    [stops]
  );

  const generateGradientValue = (
    deg: number,
    gradientType: GradientType,
    shapeType: ShapeType,
    stops: GradientStop[]
  ) => {
    const direction = gradientType === 'linear' ? `${deg}deg` : shapeType;
    if (stops.length === 0) return '';
    return `${gradientType}-gradient(${direction}${stops
      .map((stop) => `, ${stop.color} ${stop.position}%`)
      .join('')})`;
  };

  const finalValue = generateGradientValue(deg, gradientType, shapeType, stops);
  const finalValueRight = generateGradientValue(90, 'linear', shapeType, stops);

  useEffect(() => {
    if (finalValue) {
      onChange?.(finalValue);
    }
  }, [finalValue, onChange]);

  const changeProperty = useCallback(
    (property: string, value: any, id: string, isSort = false) => {
      setStops((prevStops) => {
        const temp = prevStops.map((stop, i) =>
          stop.id === id ? { ...stop, [property]: value } : stop
        );
        return isSort ? stopSort(temp) : temp;
      });
    },
    [onChange, finalValue, stops]
  );

  const [curElementId, setCurElementId] = useState<string | null>(null);

  return (
    <div style={{ width: '320px', marginTop: 6 }}>
      <GradientPanel
        gradientColor={finalValueRight}
        stops={stops}
        setStops={changeStops}
        curElementId={curElementId}
        setCurElementId={setCurElementId}
      />
      <div style={{ marginTop: 60 }} />
      <PanelRender
        gradientColor={finalValueRight}
        stops={stops}
        setStops={changeStops}
        curElementId={curElementId}
        setCurElementId={setCurElementId}
      />
      <div className={css.top}>
        <Select
          tip="渐变类型"
          style={{ flex: 1 }}
          value={gradientType}
          options={gradientOptions}
          prefix={gradientType === 'radial' ? <Radial /> : <Linear />}
          onChange={(value) => setGradientType(value)}
        />
        {gradientType === 'linear' ? (
          <InputNumber
            tip="渐变线方向角度"
            prefix={<Angle />}
            prefixTip="角度"
            style={{ flex: 1 }}
            type={'number'}
            defaultUnitValue=""
            defaultValue={deg}
            onChange={(value) => setDeg(parseInt(value))}
          />
        ) : (
          <Select
            tip="辐射形状"
            style={{ flex: 1 }}
            value={shapeType}
            options={shapeOptions}
            prefix={shapeType === 'ellipse' ? <Ellipse /> : <Circle />}
            onChange={(value) => setShapeType(value)}
          />
        )}
        <Panel.Item style={{ width: 30, padding: 0 }} onClick={addColor}>
          <AddButton />
        </Panel.Item>
      </div>
      <div className={css.stops}>
        {stops?.length > 0 &&
          stops.map((stop) => {
            const { color, position, id } = stop;
            if (!color) return null;
            return (
              <div key={id} style={{ padding: '3px 0', display: 'flex', alignItems: 'center' }}>
                <Panel.Item style={{ flex: 1 }}>
                  <ColorEditor
                    value={color}
                    onChange={(color) => {
                      changeProperty('color', color, id);
                      setCurElementId(id);
                    }}
                  />
                </Panel.Item>
                <InputNumber
                  key={position}
                  tip="停靠位置"
                  // prefix={<PositionIcon />}
                  // prefixTip="位置"
                  style={{ flex: 1 }}
                  type={'number'}
                  defaultUnitValue=""
                  defaultValue={position}
                  onChange={(position) => {
                    let newPosition = Number(position);
                    newPosition = newPosition > 100 ? 100 : newPosition;
                    changeProperty('position', newPosition, id, true);
                    setCurElementId(id);
                  }}
                />
                <Panel.Item
                  style={{ width: 30, padding: 0 }}
                  className={stops.length <= 2 ? css.disabled : ''}
                  onClick={() => {
                    if (stops.length > 2) {
                      removeColor(id);
                    }
                  }}
                >
                  <MinusButton />
                </Panel.Item>
              </div>
            );
          })}
      </div>
    </div>
  );
}
