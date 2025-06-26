import React, { useState } from "react";
import {
  FaRocket,
  FaGlobeAsia,
  FaBoxOpen,
  FaMoneyBillWave,
  FaBuilding,
  FaExchangeAlt,
} from "react-icons/fa";
import servicesData from "../../Home/OurServices/servicesData.json";

const iconComponents = {
  FaRocket: FaRocket,
  FaGlobeAsia: FaGlobeAsia,
  FaBoxOpen: FaBoxOpen,
  FaMoneyBillWave: FaMoneyBillWave,
  FaBuilding: FaBuilding,
  FaExchangeAlt: FaExchangeAlt,
};

const OurServices = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#03373D] rounded-4xl text-center">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            {servicesData.title}
          </h2>
          <p className="text-lg text-white max-w-3xl mx-auto">
            {servicesData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.services.map((service) => {
            const IconComponent = iconComponents[service.icon];
            return (
              <div
                key={service.id}
                className={`bg-gray-50 p-8 rounded-xl border border-gray-100 flex flex-col justify-center items-center transition-all duration-300 ${hoveredCard === service.id
                  ? "transform -translate-y-2 shadow-lg bg-white"
                  : "hover:shadow-md"
                  }`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className="mb-5 transition-transform duration-300 rounded-full p-4"
                  style={{
                    transform:
                      hoveredCard === service.id ? "scale(1.1)" : "scale(1)",
                    background: "linear-gradient(135deg, #3b82f6, #60a5fa)", // Blue-500 to Blue-400
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconComponent className="h-10 w-10 text-white" />
                </div>

                <h3 className="text-2xl font-semibold text-[#03373D] mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
