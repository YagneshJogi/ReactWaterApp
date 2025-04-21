import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationItem = styled.div`
  background: ${props => props.type === 'success' 
    ? 'rgba(34, 197, 94, 0.9)' 
    : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease-out;
  max-width: 300px;
  backdrop-filter: blur(4px);
  border: 1px solid ${props => props.type === 'success' 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;

const Icon = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 4px;
`;

const Message = styled.span`
  flex: 1;
  font-size: 0.95rem;
  font-weight: 500;
`;

const Notification = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <NotificationItem type={type}>
      <Icon>{type === 'success' ? '✓' : '✕'}</Icon>
      <Message>{message}</Message>
    </NotificationItem>
  );
};

export const NotificationManager = ({ notifications, onRemove }) => {
  return (
    <NotificationContainer>
      {notifications.map((notification, index) => (
        <Notification
          key={index}
          message={notification.message}
          type={notification.type}
          onClose={() => onRemove(index)}
        />
      ))}
    </NotificationContainer>
  );
};

export default Notification; 