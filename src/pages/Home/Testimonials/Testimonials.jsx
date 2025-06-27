import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import testimonials from './testimonials.json';
import reviewQuote from '../../../assets/reviewQuote.png'; // fix asset path

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          What Our Customers Are Saying
        </h2>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            }
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col justify-between min-h-[340px]">
                <img src={reviewQuote} alt="Quote Icon" className="h-12 w-12 -ml-2" />

                <p className="text-[#606060] italic mb-6 line-clamp-4">
                  "{testimonial.quote}"
                </p>

                <div className="border-t border-dashed pt-4 mt-auto">
                  <div className="flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="ml-4">
                      <h4 className="text-[20px] font-extrabold text-[#03373D]">
                        {testimonial.name}
                      </h4>
                      <p className="text-[#606060]">{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
