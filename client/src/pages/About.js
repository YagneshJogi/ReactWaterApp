import React from 'react';

function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-4xl font-bold text-center mb-8">About Our Team</h1>
          
          <p className="text-lg text-base-content/70 mb-8">
            We are a team of four driven and passionate individuals, working together to build an innovative IoT-based water monitoring system. Our combined expertise in both software and hardware domains allows us to deliver a seamless and intelligent solution that addresses real-world water management challenges.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-primary">Software Development Team</h2>
                <p className="text-base-content/70">
                  Yagnesh Jogi and Atharv Kulkarni form the core of our software development team. They are responsible for designing and implementing the backend architecture, database integration, and user interface of the system. Their work ensures smooth communication between the IoT devices and the cloud, enabling real-time monitoring and efficient data handling. With a strong focus on performance, security, and user experience, they are building a robust platform that powers the system's intelligence.
                </p>
              </div>
            </div>

            <div className="card bg-base-200 hover:shadow-lg transition-all duration-300">
              <div className="card-body">
                <h2 className="card-title text-primary">Hardware Development Team</h2>
                <p className="text-base-content/70">
                  On the hardware side, Manaswa Mahalunge and Parag Pinjani are leading the charge. They are responsible for building the physical components of the system, including sensor integration, microcontroller programming, and overall circuit design. Their hands-on skills and deep understanding of electronics ensure accurate data collection, reliable system performance, and practical deployment in real-world environments.
                </p>
              </div>
            </div>
          </div>

          <p className="text-lg text-base-content/70 mb-12">
            Together, our team bridges the gap between digital intelligence and physical implementation. With a shared vision and complementary skill sets, we collaborate closely to prototype, test, and refine our solution. Each member brings unique strengths, and our combined efforts reflect a strong commitment to innovation, precision, and sustainability. We aim to create a product that not only solves water monitoring challenges but also contributes to smarter, more responsible water usage.
          </p>

          <div className="divider"></div>

          <div className="text-center space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="https://github.com/your-repo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                GitHub Repository
              </a>
              <a 
                href="mailto:contact@example.com"
                className="btn btn-primary"
              >
                Contact Us
              </a>
            </div>
            <p className="text-base-content/60">
              Copyright © 2025 - All rights reserved by Droplet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About; 