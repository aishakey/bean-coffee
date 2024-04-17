import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import "./home.css";
import searchIcon from "../assets/search.svg";
import backgroundImage from "../assets/coffee-main.svg";
import coffeeTable from "../assets/coffee-table.svg";
import user1 from "../assets/user1.svg";
import user2 from "../assets/user2.svg";
import user3 from "../assets/user3.svg";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleLocationSelect = async (address) => {
    setSearchTerm(address);
    geocodeByAddress(address)
      .then(() => {
        navigate(`/coffeeshops?location=${encodeURIComponent(address)}`);
      })
      .catch((error) => console.error("Error", error));
  };

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="hero-content">
          <h1>DISCOVER COFFEE SPOTS THAT MOVE YOU</h1>
          <p>
            Explore the global coffee scene with Bean—your guide to the world's
            unique cafés. Seamlessly rate, review, and connect with fellow
            coffee enthusiasts as you journey through cities and cultures. Your
            next coffee discovery awaits.
          </p>
          <div className="search-input-wrapper">
            <img src={searchIcon} alt="Search" className="search-input-icon" />
            <PlacesAutocomplete
              value={searchTerm}
              onChange={setSearchTerm}
              onSelect={handleLocationSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => (
                <div>
                  <input
                    {...getInputProps({
                      placeholder: "Search location...",
                      className: "search-input",
                    })}
                  />
                  <div className="autocomplete-dropdown-container">
                    {loading && <div>Loading...</div>}
                    {suggestions.map((suggestion) => (
                      <div
                        {...getSuggestionItemProps(suggestion, {
                          className: suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item",
                        })}
                        key={suggestion.placeId}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        </div>
      </section>

      {/* Why Us? Section */}
      <section className="why-us-section">
        <div className="why-us-content">
          <h3>WHY BEAN?</h3>
          <h1>Brew your next adventure</h1>
          <p>
            Explore, rate, and review the world’s finest cafés — all in one app.
            Dive into local coffee cultures, connect with fellow coffee
            aficionados, and curate your own global café map. Perfect for nomads
            who love their coffee as much as their travels.{" "}
          </p>
          <a href="/about" className="about-btn">
            About
          </a>
        </div>
        <img src={coffeeTable} alt="Why Us" className="why-us-image" />
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2>START SIPPING</h2>
        <h1>Discover coffee in three simple steps</h1>
        <div className="first">
          <h1 className="num">1</h1>
          <h3>SEARCH</h3>
          <p>Find coffee shops near you or in your next destination</p>
        </div>
        <div className="second">
          <h1 className="num">2</h1>
          <h3>VISIT & EXPERIENCE</h3>
          <p>Check out the place and enjoy your cup of coffee</p>
        </div>
        <div className="third">
          <h1 className="num">3</h1>
          <h3>REVIEW & SHARE</h3>
          <p>Leave your feedback and help the community grow</p>
        </div>
        <a href="/signup" className="signup-btn">
          Check it out
        </a>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h3>HEAR FROM FELLOW NOMADS</h3>
        <div className="testimonial-cards">
          {/* Testimonial Card 1 */}
          <div className="testimonial-card">
            <blockquote>
              “Bean is my go-to app on the road. Found incredible hidden gems in
              every city I've visited!”
            </blockquote>
            <img src={user1} alt="User 1" className="user-photo" />
            <p>Lena Durs</p>
          </div>

          {/* Testimonial Card 2 */}
          <div className="testimonial-card">
            <blockquote>
              “Every coffee lover traveling should have this app. It's changed
              how I explore new places.”{" "}
            </blockquote>
            <img src={user2} alt="User 2" className="user-photo" />
            <p>Jane Lato</p>
          </div>

          {/* Testimonial Card 3 */}
          <div className="testimonial-card">
            <blockquote>
              “I love being a part of Bean coffee community. The reviews are
              always spot on and helpful!”{" "}
            </blockquote>
            <img src={user3} alt="User 3" className="user-photo" />
            <p>Zane Roman</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
