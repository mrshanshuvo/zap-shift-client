import React from 'react';
import location from '../../../assets/location-merchant.png';

const Merchant = () => {
  return (
    <section
      data-aos="fade-up"
      className="p-20 rounded-[2rem] bg-[#03373D] bg-[url('assets/be-a-merchant-bg.png')] bg-no-repeat "
    >
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Merchant and Customer Satisfaction is Our First Priority
            </h2>

            <p className="text-lg text-[#DADADA] mb-8 leading-relaxed">
              We offer the lowest delivery charge with the highest value along with
              100% safety of your product. Pathao courier delivers your parcels in every
              corner of Bangladesh right on time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-[#CAEB66] font-medium rounded-lg shadow-sm cursor-pointer">
                Become a Merchant
              </button>
              <button className="px-6 py-3 border border-[#CAEB66] text-[#CAEB66] font-medium rounded-lg cursor-pointer">
                Earn with Profast Courier
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/3">
            <div className="rounded-xl overflow-hidden h-80 w-full flex items-center justify-center">
              <img src={location} alt="Merchant location" className="object-contain h-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Merchant;
