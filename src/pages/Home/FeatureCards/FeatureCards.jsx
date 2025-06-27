import React from 'react';
import liveTrackingImage from '../../../assets/live-tracking.png';
import safeDeliveryImage from '../../../assets/safe-delivery.png';
import callCenterImage from '../../../assets/24_7.jpg';

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      title: "Live Parcel Tracking",
      description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
      image: liveTrackingImage,
      alt: "Live parcel tracking screenshot"
    },
    {
      id: 2,
      title: "100% Safe Delivery",
      description: "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
      image: safeDeliveryImage,
      alt: "Safe delivery illustration"
    },
    {
      id: 3,
      title: "24/7 Call Center Support",
      description: "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
      image: callCenterImage,
      alt: "Customer support team"
    }
  ];

  return (
    <section className="py-24 mb-24 relative">
      {/* Top Dotted Line */}
      <div className="absolute top-0 left-0 w-full border-t-4 border-dotted border-[#03464D]"></div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-8">
            Why Choose Us?
          </h2>
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row h-full border border-gray-100"
            >
              {/* Image container - left side */}
              <div className="relative w-full sm:w-2/5 h-56 sm:h-auto bg-gray-50 flex items-center justify-center p-6">
                <img
                  src={feature.image}
                  alt={feature.alt}
                  className="max-h-48 sm:max-h-60 object-contain mx-auto"
                  loading="lazy"
                />
                {/* Vertical dotted line between image and text */}
                <div className="hidden sm:block absolute right-0 top-[15%] h-[70%] border-r-4 border-dotted border-[#03464D]"></div>
              </div>

              {/* Text content - right side */}
              <div className="w-full sm:w-3/5 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Dotted Line */}
      <div className="absolute bottom-0 left-0 w-full border-t-4 border-dotted border-[#03464D]"></div>
    </section>
  );
};

export default FeatureCards;
