import React from 'react'
import Banner from '../componetns/Home/Banner'
import Hero from '../componetns/Home/Hero'
import Features from '../componetns/Home/Features'
import Testimonial from '../componetns/Home/Testimonial'
import CallToAction from '../componetns/Home/CallToAction'
import Footer from '../componetns/Home/Footer'

const Home = () => {
  return (
    <div>
      <Banner/>
      <Hero/>
      <Features/>
      <Testimonial/>
      <CallToAction/>
      <Footer/>
    </div>
  )
}

export default Home