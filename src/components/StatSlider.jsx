import { useState, useEffect } from 'react';
import { Slider, Typography, Row, Col } from 'antd';

const { Text } = Typography;

const StatSlider = ({ label, value, onChange }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const getStatColor = (val, isFatigue = false) => {
    if (isFatigue) {
      // Reverse logic for fatigue: 0 = good (green), 100 = bad (red)
      if (val <= 33) return '#2ed573'; // Low fatigue = good (green)
      if (val <= 66) return '#ffa502'; // Medium fatigue = warning (orange)
      return '#ff4757'; // High fatigue = bad (red)
    } else {
      // Normal logic for other stats: higher = better
      if (val <= 33) return '#ff4757';
      if (val <= 66) return '#ffa502';
      return '#2ed573';
    }
  };

  const getStatLabel = (val, isFatigue = false) => {
    if (isFatigue) {
      // Reverse logic for fatigue
      if (val <= 33) return 'FRESH'; // Low fatigue = fresh
      if (val <= 66) return 'TIRED'; // Medium fatigue = tired
      return 'EXHAUSTED'; // High fatigue = exhausted
    } else {
      // Normal logic for other stats
      if (val <= 33) return 'LOW';
      if (val <= 66) return 'MEDIUM';
      return 'HIGH';
    }
  };

  const handleChange = (newValue) => {
    setDisplayValue(newValue);
    onChange(newValue);
  };

  // Check if this is a fatigue slider based on the label
  const isFatigueSlider = label.toLowerCase().includes('fatigue') || label.includes('😴');
  const colorData = getStatColor(displayValue, isFatigueSlider);
  const labelText = getStatLabel(displayValue, isFatigueSlider);

  return (
    <div className="stat-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: '1rem' }}>
        <Col>
          <Text strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
            {label}
          </Text>
        </Col>
        <Col>
          <Text 
            strong 
            style={{
              fontSize: '1.3rem',
              color: colorData,
              textShadow: `0 0 10px ${colorData}50`
            }}
          >
            {displayValue} ({labelText})
          </Text>
        </Col>
      </Row>
      
      <Slider
        min={0}
        max={100}
        value={displayValue}
        onChange={handleChange}
        trackStyle={{ backgroundColor: colorData }}
        handleStyle={{ 
          borderColor: colorData,
          backgroundColor: '#ffffff',
          boxShadow: `0 0 15px ${colorData}80`
        }}
        railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
      />
    </div>
  );
};

export default StatSlider;