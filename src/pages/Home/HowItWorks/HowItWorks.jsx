// src/components/HowItWorks.js
import React, { useState } from 'react';
import howItWorksData from '../../Home/HowItWorks/howItWorksData.json';

const HowItWorks = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleFeature = (id) => {
    setActiveFeature(activeFeature === id ? null : id);
  };

  const visibleFeatures = isExpanded
    ? howItWorksData.features
    : howItWorksData.features.slice(0, 4);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 mb-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {howItWorksData.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {howItWorksData.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleFeatures.map((feature) => (
            <div
              key={feature.id}
              onClick={() => toggleFeature(feature.id)}
              className={`bg-white p-6 rounded-xl border-2 transition-all duration-300 cursor-pointer ${activeFeature === feature.id
                ? 'border-blue-500 shadow-lg transform -translate-y-1'
                : 'border-transparent hover:border-gray-200 hover:shadow-md'
                }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>

              {activeFeature === feature.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-2">Steps:</h4>
                  <ul className="space-y-2">
                    {feature.steps.map((step, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {howItWorksData.features.length > 4 && (
          <div className="text-center mt-10">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-6 py-2 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              {isExpanded ? 'Show Less' : 'Show More Features'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default HowItWorks;