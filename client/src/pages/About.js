import React, { useState } from 'react';
import styled from 'styled-components';
import SystemInfo from '../components/SystemInfo';
import Specs from '../components/Specs';
import Team from '../components/Team';

const Container = styled.div`
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

const Title = styled.h1`
  color: #1e293b;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin: 2rem 0;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin: 1.5rem 0;
  }
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#2563eb' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#1e293b'};
  border: 1px solid ${props => props.active ? '#2563eb' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;
  text-align: center;

  &:hover {
    background: ${props => props.active ? '#1d4ed8' : '#f8fafc'};
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

const ContentContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  margin: 1rem auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0.5rem auto;
  }
`;

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SystemInfo />;
      case 'specs':
        return <Specs />;
      case 'team':
        return <Team />;
      default:
        return <SystemInfo />;
    }
  };

  return (
    <Container>
      <Title>About Smart Water Quality Monitoring System</Title>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'overview'} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </Tab>
        <Tab 
          active={activeTab === 'specs'} 
          onClick={() => setActiveTab('specs')}
        >
          Specifications
        </Tab>
        <Tab 
          active={activeTab === 'team'} 
          onClick={() => setActiveTab('team')}
        >
          Our Team
        </Tab>
      </TabContainer>

      <ContentContainer>
        {renderContent()}
      </ContentContainer>
    </Container>
  );
};

export default About; 