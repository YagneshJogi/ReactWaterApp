import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ref, push, set } from 'firebase/database';
import { database } from '../firebase';

const DashboardContainer = styled.div`
  padding: ${props => props.theme.spacing.md};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
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
    props.theme.colors.status.success : 
    props.theme.colors.status.error
  };
  color: white;
  font-size: ${props => props.theme.typography.body2.fontSize};
  font-weight: 500;
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
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
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
  border: 1px solid ${props => props.theme.colors.text.secondary};
  border-radius: ${props => props.theme.borderRadius.md};
  flex: 1;
  font-size: ${props => props.theme.typography.body1.fontSize};
  transition: border-color 0.2s;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }

  &:disabled {
    background-color: ${props => props.theme.colors.background};
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.xl};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: ${props => props.theme.typography.body1.fontSize};
  font-weight: 500;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
    transform: translateY(-1px);
  }

  &:disabled {
    background-color: ${props => props.theme.colors.text.secondary};
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.status.error};
  margin-bottom: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.status.error};
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/data');
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
    } catch (err) {
      setError('Failed to save data to Firebase');
      console.error('Error saving data:', err);
    } finally {
      setIsSaving(false);
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
    </DashboardContainer>
  );
}

export default Dashboard; 