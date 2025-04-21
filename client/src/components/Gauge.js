import React from 'react';
import styled from 'styled-components';

const GaugeContainer = styled.div`
  position: relative;
  width: 200px;
  height: 100px;
  margin: 20px auto;
  overflow: hidden;
`;

const GaugeBackground = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #e2e8f0;
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
`;

const GaugeFill = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${props => props.color};
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
  transform: rotate(${props => (props.percentage - 50) * 1.8}deg);
  transform-origin: center center;
  transition: transform 0.5s ease-out;
`;

const GaugeValue = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color};
`;

const Gauge = ({ value, min, max, unit, warningThreshold, dangerThreshold }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getColor = () => {
    if (percentage >= dangerThreshold) return '#e53e3e';
    if (percentage >= warningThreshold) return '#ed8936';
    return '#38a169';
  };

  return (
    <GaugeContainer>
      <GaugeBackground />
      <GaugeFill percentage={percentage} color={getColor()} />
      <GaugeValue color={getColor()}>
        {value.toFixed(1)} {unit}
      </GaugeValue>
    </GaugeContainer>
  );
};

export default Gauge; 