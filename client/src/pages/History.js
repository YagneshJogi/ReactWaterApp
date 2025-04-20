import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase';

const HistoryContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ReadingList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ReadingCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  border-left: 4px solid #2196f3;
`;

const ReadingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #666;
`;

const ReadingData = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const DataItem = styled.div`
  text-align: center;
`;

const Label = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const Value = styled.div`
  font-weight: bold;
  color: #2196f3;
`;

function History() {
  const [readings, setReadings] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const readingsRef = ref(database, 'readings');
    
    const handleData = (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const readingsArray = Object.entries(data).map(([id, reading]) => ({
            id,
            ...reading
          }));
          setReadings(readingsArray.reverse()); // Most recent first

          // Extract unique sources
          const uniqueSources = [...new Set(readingsArray.map(r => r.source))];
          setSources(uniqueSources);
        } else {
          setReadings([]);
          setSources([]);
        }
        setError('');
      } catch (err) {
        setError('Error processing data from Firebase');
        console.error('Error processing data:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleError = (error) => {
      setError('Failed to fetch data from Firebase');
      console.error('Firebase error:', error);
      setLoading(false);
    };

    // Set up the listener
    onValue(readingsRef, handleData, handleError);

    // Cleanup function
    return () => {
      off(readingsRef);
    };
  }, []);

  const filteredReadings = selectedSource === 'all'
    ? readings
    : readings.filter(reading => reading.source === selectedSource);

  return (
    <HistoryContainer>
      <Card>
        <h2>Historical Readings</h2>
        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
        <FilterGroup>
          <Select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            <option value="all">All Sources</option>
            {sources.map(source => (
              <option key={source} value={source}>{source}</option>
            ))}
          </Select>
        </FilterGroup>
        {loading ? (
          <div>Loading data...</div>
        ) : filteredReadings.length === 0 ? (
          <div>No readings found</div>
        ) : (
          <ReadingList>
            {filteredReadings.map(reading => (
              <ReadingCard key={reading.id}>
                <ReadingHeader>
                  <div>{reading.source}</div>
                  <div>{new Date(reading.timestamp).toLocaleString()}</div>
                </ReadingHeader>
                <ReadingData>
                  <DataItem>
                    <Label>Temperature</Label>
                    <Value>{reading.temp}°C</Value>
                  </DataItem>
                  <DataItem>
                    <Label>TDS</Label>
                    <Value>{reading.tds} ppm</Value>
                  </DataItem>
                  <DataItem>
                    <Label>Dissolved Oxygen</Label>
                    <Value>{reading.do} mg/L</Value>
                  </DataItem>
                  <DataItem>
                    <Label>Turbidity</Label>
                    <Value>{reading.ntu} NTU</Value>
                  </DataItem>
                </ReadingData>
              </ReadingCard>
            ))}
          </ReadingList>
        )}
      </Card>
    </HistoryContainer>
  );
}

export default History; 