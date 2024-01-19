import React from "react";
import "./about.css";
import coffeeBean from "../assets/bean-coffee.svg";
import speechBox from "../assets/dialog-box.svg";

const About = () => {
  return (
    <div className="about-page">
      <div className="speech-box-container">
        <img src={coffeeBean} alt="Coffee Bean" className="about-bean" />
        <img src={speechBox} alt="Speech Box" className="speech-box" />
        <div className="about-text">
          <p>
            Bean was created out of love for coffee and
            <br /> the community that surrounds it. Our mission is to connect
            people
            <br /> with coffeeshops around the globe that not only serve a great
            cup of coffee but also offer the perfect environment tailored to
            each individual's needs. We understand that the modern coffee lover
            often seeks more than just a caffeine fix. Whether it's the
            ambiance, the seating arrangements, the selection of food, or the
            suitability for work or study, we're here to guide you to your ideal
            spot.
          </p>
          <p>
            In a world where ratings are ubiquitous, we choose to step away from
            the stars and focus on what really matters - personal experience and
            fit. Bean doesn't believe in a one-size-fits-all rating system.
            Instead, we believe in personalized matches that respect your unique
            set of preferences. With Bean, you're not just finding a coffeeshop;
            you're discovering a space where productivity, relaxation, and
            community thrive in harmony with your personal rhythm.
          </p>
          <p>
            Join us on this journey to explore,
            <br /> connect, and find your space - one cup at a time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
