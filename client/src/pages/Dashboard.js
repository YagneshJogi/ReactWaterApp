import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';
import { NotificationManager } from '../components/Notification';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: #ffffff;
  backdrop-filter: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.lg};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.h2.fontSize};
  margin: 0;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  background-color: ${props => props.connected ? 
    'rgba(34, 197, 94, 0.9)' : 
    'rgba(239, 68, 68, 0.9)'
  };
  backdrop-filter: blur(4px);
  color: white;
  font-size: ${props => props.theme.typography.body2.fontSize};
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const DataItem = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.lg};
  background: #ffffff;
  backdrop-filter: none;
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const Label = styled.div`
  font-size: ${props => props.theme.typography.body2.fontSize};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Value = styled.div`
  font-size: ${props => props.theme.typography.h2.fontSize};
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.md};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  padding: ${props => props.theme.spacing.md};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: ${props => props.theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  flex: 1;
  font-size: ${props => props.theme.typography.body1.fontSize};
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    background: rgba(255, 255, 255, 0.95);
    outline: none;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
  }

  &:disabled {
    background: rgba(243, 244, 246, 0.8);
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background: rgba(37, 99, 235, 0.9);
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.body1.fontSize};
  font-weight: 500;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(29, 78, 216, 0.95);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: rgba(156, 163, 175, 0.8);
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  margin-bottom: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background: #ffffff;
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid #dc2626;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

function Dashboard() {
  const [sensorData, setSensorData] = useState({
    temp: 0,
    tds: 0,
    do: 0,
    ntu: 0,
    ntu_lin: 0
  });
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const newNotification = { message, type };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        // Get the current hostname (will be localhost or local IP)
        const hostname = window.location.hostname;
        const response = await fetch(`http://${hostname}:5000/api/data`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (isMounted) {
          setSensorData({
            temp: parseFloat(data.temp).toFixed(2),
            tds: parseFloat(data.tds).toFixed(2),
            do: parseFloat(data.do).toFixed(2),
            ntu: parseFloat(data.ntu).toFixed(2),
            ntu_lin: parseFloat(data.ntu_lin).toFixed(2)
          });
          setError('');
          setConnectionStatus('Connected to ESP32');
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch sensor data. Please check ESP32 connection.');
          setConnectionStatus('Connection Error');
          setIsLoading(false);
          console.error('Error fetching data:', err);
        }
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSave = async () => {
    if (!source.trim()) {
      setError('Please enter a source name');
      return;
    }

    setIsSaving(true);
    try {
      const readingsRef = ref(database, 'readings');
      const newReadingRef = push(readingsRef);
      await set(newReadingRef, {
        ...sensorData,
        source: source.trim(),
        timestamp: new Date().toISOString()
      });
      setError('');
      setSource('');
      addNotification('Reading saved successfully');
    } catch (err) {
      setError('Failed to save data to Firebase');
      console.error('Error saving data:', err);
      addNotification('Failed to save reading', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (readingId) => {
    try {
      const readingRef = ref(database, `readings/${readingId}`);
      await set(readingRef, null);
      addNotification('Reading deleted successfully');
    } catch (error) {
      console.error('Error deleting reading:', error);
      addNotification('Failed to delete reading', 'error');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave();
    }
  };

  if (isLoading) {
    return (
      <DashboardContainer>
        <Card>
          <CardHeader>
            <Title>Loading Sensor Data...</Title>
          </CardHeader>
        </Card>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <Card>
        <CardHeader>
          <Title>Current Sensor Readings</Title>
          <StatusBadge connected={connectionStatus === 'Connected to ESP32'}>
            {connectionStatus}
          </StatusBadge>
        </CardHeader>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <DataGrid>
          <DataItem>
            <Label>Temperature</Label>
            <Value>{sensorData.temp}°C</Value>
          </DataItem>
          <DataItem>
            <Label>TDS</Label>
            <Value>{sensorData.tds} ppm</Value>
          </DataItem>
          <DataItem>
            <Label>Dissolved Oxygen</Label>
            <Value>{sensorData.do} mg/L</Value>
          </DataItem>
          <DataItem>
            <Label>Turbidity (Quadratic)</Label>
            <Value>{sensorData.ntu} NTU</Value>
          </DataItem>
          <DataItem>
            <Label>Turbidity (Linear)</Label>
            <Value>{sensorData.ntu_lin} NTU</Value>
          </DataItem>
        </DataGrid>
        <InputGroup>
          <Input
            type="text"
            placeholder="Enter water source (e.g., tap, lake, well)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSaving}
          />
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </InputGroup>
      </Card>
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </DashboardContainer>
  );
}

export default Dashboard; 