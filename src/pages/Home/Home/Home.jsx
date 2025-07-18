import React from 'react';
import Banner from '../Banner/Banner';
import HowItWorks from '../HowItWorks/HowItWorks';
import OurServices from '../OurServices/OurServices';
import ClientLogoSlider from '../ClientLogoSlider/ClientLogoSlider';
import FeatureCards from '../FeatureCards/FeatureCards';
import Merchant from '../Merchant/Merchant';
import Testimonials from '../Testimonials/Testimonials';
import FAQ from '../FAQ/FAQ';

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <ClientLogoSlider></ClientLogoSlider>
      <FeatureCards></FeatureCards>
      <Merchant></Merchant>
      <Testimonials></Testimonials>
      <FAQ></FAQ>
    </div>
  );
};

export default Home;