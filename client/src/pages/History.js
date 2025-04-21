import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ref, onValue, off, remove } from 'firebase/database';
import { database } from '../firebase';
import { NotificationManager } from '../components/Notification';

const HistoryContainer = styled.div`
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const Card = styled.div`
  background: #ffffff;
  backdrop-filter: none;
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  width: 100%;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  font-size: 0.95rem;
  width: 100%;
  max-width: 300px;
  cursor: pointer;
  color: #1e293b;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:hover {
    border-color: #2563eb;
  }
`;

const ReadingList = styled.div`
  display: grid;
  gap: 1rem;
  width: 100%;
  justify-items: center;
`;

const ReadingCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const DeleteButton = styled.button`
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(239, 68, 68, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(220, 38, 38, 0.95);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    background: rgba(252, 165, 165, 0.8);
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ReadingHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  color: #1e293b;
  text-align: center;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }

  .source {
    font-weight: 600;
    font-size: 1.1rem;
    color: #2563eb;
  }

  .timestamp {
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const ReadingData = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.25rem;
  width: 100%;
  justify-items: center;
`;

const DataItem = styled.div`
  text-align: center;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    background: #f1f5f9;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
`;

const Value = styled.div`
  font-weight: 600;
  color: #1e293b;
  font-size: 1.25rem;
`;

const DeleteAllButton = styled(DeleteButton)`
  background: rgba(220, 38, 38, 0.9);
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  
  &:hover {
    background: rgba(185, 28, 28, 0.95);
  }

  &:disabled {
    background: rgba(252, 165, 165, 0.8);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;
  color: #1e293b;
  margin: 0 auto;
  text-align: center;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ModalMessage = styled.p`
  margin-bottom: 1.5rem;
  color: #64748b;
  font-size: 1rem;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const ModalButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &.cancel {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #e2e8f0;
      transform: translateY(-1px);
    }
  }

  &.confirm {
    background: #dc2626;
    color: white;
    border: none;

    &:hover {
      background: #b91c1c;
      transform: translateY(-1px);
    }

    &:disabled {
      background: #fca5a5;
      cursor: not-allowed;
      transform: none;
    }
  }
`;

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
`;

const Title = styled.h2`
  margin: 0;
  color: #1e293b;
  font-size: 2rem;
  font-weight: 600;
  width: 100%;
  text-align: left;
`;

function History() {
  const [readings, setReadings] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'success') => {
    const newNotification = { message, type };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

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

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const readingRef = ref(database, `readings/${id}`);
      await remove(readingRef);
      addNotification('Reading deleted successfully');
    } catch (error) {
      console.error('Error deleting reading:', error);
      addNotification('Failed to delete reading', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setLoading(true);
      const readingsRef = ref(database, 'readings');
      await remove(readingsRef);
      addNotification('All readings deleted successfully');
      setShowDeleteAllModal(false);
    } catch (error) {
      console.error('Error deleting all readings:', error);
      addNotification('Failed to delete all readings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <HistoryContainer>
      <Card>
        <PageHeader>
          <Title>Historical Readings</Title>
          <DeleteAllButton onClick={() => setShowDeleteAllModal(true)}>
            Delete Whole History
          </DeleteAllButton>
        </PageHeader>
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
                  <div>
                    <div className="source">{reading.source}</div>
                    <div className="timestamp">{new Date(reading.timestamp).toLocaleString()}</div>
                  </div>
                  <DeleteButton 
                    onClick={() => handleDelete(reading.id)}
                    disabled={deletingId === reading.id}
                  >
                    {deletingId === reading.id ? 'Deleting...' : 'Delete'}
                  </DeleteButton>
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

      {showDeleteAllModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Delete All History</ModalTitle>
            <ModalMessage>
              Are you sure you want to delete all historical readings? This action cannot be undone.
            </ModalMessage>
            <ModalButtons>
              <ModalButton 
                className="cancel"
                onClick={() => setShowDeleteAllModal(false)}
              >
                Cancel
              </ModalButton>
              <ModalButton 
                className="confirm"
                onClick={handleDeleteAll}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete All'}
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      <NotificationManager 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </HistoryContainer>
  );
}

export default History; 