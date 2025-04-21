import styled from 'styled-components';

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const CardTitle = styled.h3`
  color: #1a365d;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const CardContent = styled.div`
  color: #2d3748;
`;

export const ValueDisplay = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #2b6cb0;
  text-align: center;
  margin: 12px 0;
`;

export const Unit = styled.span`
  font-size: 1rem;
  color: #4a5568;
  margin-left: 4px;
`; 