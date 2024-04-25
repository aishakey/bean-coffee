import React, { useState } from "react";
import "./about.css";
import largePhoto from "../assets/largePhoto.svg";
import verticalPhoto from "../assets/verticalPhoto.svg";
import sideImage from "../assets/sideImage.svg";

const About = () => {
  const [imageLoaded, setImageLoaded] = useState({
    large: false,
    vertical: false,
    side: false,
  });

  return (
    <div className="about-page">
      <h1>
        OUR PHILOSOPHY &<br /> BRAND IDENTITY
      </h1>
      <div
        className={`image-placeholder ${imageLoaded.large ? "" : "loading"}`}
      >
        <img
          src={largePhoto}
          alt="Large View"
          className="large-photo"
          onLoad={() => setImageLoaded({ ...imageLoaded, large: true })}
          style={{
            opacity: imageLoaded.large ? 1 : 0,
            transition: "opacity 0.5s ease-in",
          }}
        />
      </div>
      <div className="lower-section">
        <div
          className={`image-placeholder ${
            imageLoaded.vertical ? "" : "loading"
          }`}
        >
          <img
            src={verticalPhoto}
            alt="Vertical View"
            className="vertical-photo"
            onLoad={() => setImageLoaded({ ...imageLoaded, vertical: true })}
            style={{
              opacity: imageLoaded.vertical ? 1 : 0,
              transition: "opacity 0.5s ease-in",
            }}
          />
        </div>

        <div className="text-beside-vertical">
          <p>
            Bean was created out of love for coffee and the community that
            surrounds it. Our mission is to connect people with coffeeshops
            around the globe that not only serve a great cup of coffee but also
            offer the perfect environment tailored to each individual's needs.
          </p>
          <p>
            We understand that the modern coffee lover often seeks more than
            just a caffeine fix. Whether it's the ambiance, the seating
            arrangements, the selection of food, or the suitability for work or
            study, we're here to guide you to your ideal spot. In a world where
            ratings are ubiquitous, we choose to step away from the stars and
            focus on what really matters - personal experience and fit.
          </p>
        </div>
      </div>
      <div className="text-and-image">
        <p>
          Bean doesn't believe in a one-size-fits-all rating system. Instead, we
          believe in personalized matches that respect your unique set of
          preferences. With Bean, you're not just finding a coffeeshop; you're
          discovering a space where productivity, relaxation, and community
          thrive in harmony with your personal rhythm.
        </p>
        <div
          className={`image-placeholder ${imageLoaded.side ? "" : "loading"}`}
        >
          <img
            src={sideImage}
            alt="Side View"
            className="side-image"
            onLoad={() => setImageLoaded({ ...imageLoaded, side: true })}
            style={{
              opacity: imageLoaded.side ? 1 : 0,
              transition: "opacity 0.5s ease-in",
            }}
          />
        </div>
      </div>
      <h2 className="center-text">
        JOIN US ON THIS JOURNEY TO EXPLORE, CONNECT, AND FIND YOUR SPACE - ONE
        CUP AT A TIME.
      </h2>
      <a href="/signup" className="join-button">
        Join
      </a>
    </div>
  );
};

export default About;
