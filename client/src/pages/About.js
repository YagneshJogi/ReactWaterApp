import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
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
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text.primary};
  font-size: ${props => props.theme.typography.h1.fontSize};
  margin-bottom: ${props => props.theme.spacing.xl};
  text-align: center;
`;

const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const TeamCard = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  padding: ${props => props.theme.spacing.lg};
  box-shadow: ${props => props.theme.shadows.sm};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.md};
  }
`;

const TeamTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  font-size: ${props => props.theme.typography.h2.fontSize};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const Description = styled.p`
  color: ${props => props.theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ContactSection = styled.div`
  text-align: center;
  margin-top: ${props => props.theme.spacing.xxl};
  padding-top: ${props => props.theme.spacing.xl};
  border-top: 1px solid ${props => props.theme.colors.background};
`;

const LinkButton = styled.a`
  display: inline-block;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  margin: 0 ${props => props.theme.spacing.sm};
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

function About() {
  return (
    <AboutContainer>
      <Card>
        <Title>About Our Team</Title>
        <Description>
          We are a team of four driven and passionate individuals, working together to build an innovative IoT-based water monitoring system. Our combined expertise in both software and hardware domains allows us to deliver a seamless and intelligent solution that addresses real-world water management challenges.
        </Description>

        <TeamGrid>
          <TeamCard>
            <TeamTitle>Software Development Team</TeamTitle>
            <Description>
              Yagnesh Jogi and Atharv Kulkarni form the core of our software development team. They are responsible for designing and implementing the backend architecture, database integration, and user interface of the system. Their work ensures smooth communication between the IoT devices and the cloud, enabling real-time monitoring and efficient data handling. With a strong focus on performance, security, and user experience, they are building a robust platform that powers the system's intelligence.
            </Description>
          </TeamCard>

          <TeamCard>
            <TeamTitle>Hardware Development Team</TeamTitle>
            <Description>
              On the hardware side, Manaswa Mahalunge and Parag Pinjani are leading the charge. They are responsible for building the physical components of the system, including sensor integration, microcontroller programming, and overall circuit design. Their hands-on skills and deep understanding of electronics ensure accurate data collection, reliable system performance, and practical deployment in real-world environments.
            </Description>
          </TeamCard>
        </TeamGrid>

        <Description>
          Together, our team bridges the gap between digital intelligence and physical implementation. With a shared vision and complementary skill sets, we collaborate closely to prototype, test, and refine our solution. Each member brings unique strengths, and our combined efforts reflect a strong commitment to innovation, precision, and sustainability. We aim to create a product that not only solves water monitoring challenges but also contributes to smarter, more responsible water usage.
        </Description>

        <ContactSection>
          <LinkButton href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
            GitHub Repository
          </LinkButton>
          <LinkButton href="mailto:contact@example.com">
            Contact Us
          </LinkButton>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            Copyright © 2025 - All rights reserved by Droplet
          </p>
        </ContactSection>
      </Card>
    </AboutContainer>
  );
}

export default About; 