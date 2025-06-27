import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { MdArrowOutward } from 'react-icons/md';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How does this posture corrector work?",
      answer: "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders."
    },
    {
      question: "Is it suitable for all ages and body types?",
      answer: "Yes, our posture corrector is designed with adjustable straps to accommodate various body types and is suitable for adults of all ages."
    },
    {
      question: "Does it really help with back pain and posture improvement?",
      answer: "Absolutely! Many users report significant reduction in back pain and noticeable posture improvement within weeks of regular use."
    },
    {
      question: "Does it have smart features like vibration alerts?",
      answer: "Our premium model includes smart vibration alerts that notify you when you're slouching, helping to reinforce good posture habits."
    },
    {
      question: "How will I be notified when the product is back in stock?",
      answer: "Simply enter your email on our product page to receive instant notification when inventory becomes available."
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Enhance posture, mobility, and well-being effortlessly with Posture Pro. Achieve proper alignment, reduce pain, and strengthen your body with ease!
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {faq.question}
              </h3>
              {activeIndex === index ? (
                <ChevronUpIcon className="h-5 w-5 cursor-pointer" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 cursor-pointer" />
              )}
            </button>
            {activeIndex === index && (
              <div className="p-6 pt-0 bg-gray-50">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="flex items-center justify-center space-x-4">
          <button
            className="px-6 py-3 cursor-pointer bg-[#CAEB66] text-xl font-bold rounded-lg shadow-md 
                 hover:bg-[#B4D850] focus:outline-none focus:ring-2 focus:ring-[#05555B] transition duration-300"
          >
            See More FAQ's
          </button>

          <button
            aria-label="See More"
            className="p-3 bg-black cursor-pointer text-[#CAEB66] rounded-full shadow-md 
                 hover:bg-[#222222] focus:outline-none focus:ring-2 focus:ring-[#05555B] 
                 flex items-center justify-center transition duration-300"
          >
            <MdArrowOutward size={24} />
          </button>
        </div>
      </div>

    </section>
  );
};

export default FAQ;