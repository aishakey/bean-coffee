import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";
import "./home.css";
import travelBean from "../assets/bean-travel.svg";
import coffeeBean from "../assets/bean-coffee.svg";
import hatBean from "../assets/bean-hat.svg";
import cupImg from "../assets/cup.svg";
import searchIcon from "../assets/search.svg";

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
      <main className="main-content">
        <section className="hero-section">
          <img
            src={cupImg}
            alt="Cup with words coming out"
            className="cup-img"
          />
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
                    {suggestions.map((suggestion) => {
                      const className = suggestion.active
                        ? "suggestion-item--active"
                        : "suggestion-item";
                      return (
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                          key={suggestion.placeId}
                        >
                          <span>{suggestion.description}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        </section>

        <section className="action-section">
          <div className="action-item">
            <img src={travelBean} alt="Coffee Beans" />
            <p>Review Globally</p>
          </div>
          <div className="action-item">
            <img src={hatBean} alt="Latte Art" />
            <p>Personalize Your Profile</p>
          </div>
          <div className="action-item">
            <img src={coffeeBean} alt="Coffee Cups" />
            <p>Find Your Perfect Match</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
