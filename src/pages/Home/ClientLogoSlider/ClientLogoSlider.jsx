import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Import your images directly
import amazon from '../../../assets/brands/amazon.png';
import amazonVector from '../../../assets/brands/amazon_vector.png';
import casio from '../../../assets/brands/casio.png';
import moonstar from '../../../assets/brands/moonstar.png';
import randstad from '../../../assets/brands/randstad.png';
import startPeople from '../../../assets/brands/start-people 1.png';
import start from '../../../assets/brands/start.png';

const ClientLogoSlider = () => {
  // Client logos data with imported images
  const clients = [
    { id: 1, name: 'Amazon', logo: amazon },
    { id: 2, name: 'Amazon Vector', logo: amazonVector },
    { id: 3, name: 'Casio', logo: casio },
    { id: 4, name: 'Moonstar', logo: moonstar },
    { id: 5, name: 'Randstad', logo: randstad },
    { id: 6, name: 'Start People', logo: startPeople },
    { id: 7, name: 'Start', logo: start },
  ];

  return (
    <section className="py-20 ">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-xl font-semibold text-center mb-8">
          We've helped thousands of sales teams
        </h3>

        <div className="relative px-10"> {/* Added padding for arrows */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={5}
            loop={true}
            autoplay={{
              delay: 1000, // Changed to 2.5s delay for better UX
              disableOnInteraction: false,
              reverseDirection: false, // Right-to-left
            }}
            speed={1000} // Slower animation for better visibility
            breakpoints={{
              0: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 5,
                spaceBetween: 40
              }
            }}
            className="py-4" // Added padding
          >
            {clients.map((client) => (
              <SwiperSlide key={client.id}>
                <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="max-h-16 w-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <p className="text-center text-gray-500 mt-8 italic">
          "These companies trust our delivery services every day"
        </p>
      </div>
    </section>
  );
};

export default ClientLogoSlider;