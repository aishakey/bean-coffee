import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCoffeeShops } from "../services/coffeeshopService";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import FilterModal from "../components/FilterModal";
import "./coffeeshops.css";
import searchIcon from "../assets/search.svg";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

const Coffeeshops = () => {
  const [coffeeShops, setCoffeeShops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minReviews, setMinReviews] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchFilteredCoffeeShops = async (term = "", minRev = "") => {
    setIsLoading(true);
    try {
      const shops = await getCoffeeShops(term, minRev);
      setCoffeeShops(shops);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching coffee shops:", error);
      setError("Failed to fetch coffee shops.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationQuery = queryParams.get("location");
    if (locationQuery) {
      setSearchTerm(locationQuery);
      fetchFilteredCoffeeShops(locationQuery, minReviews);
    } else {
      fetchFilteredCoffeeShops();
    }
  }, [location.search, minReviews]);

  const handleLocationSelect = async (address) => {
    setSearchTerm(address);
    geocodeByAddress(address)
      .then(() => {
        fetchFilteredCoffeeShops(address);
      })
      .catch((error) => console.error("Error", error));
  };

  const updateFilters = (newSearchTerm, newMinReviews) => {
    setSearchTerm(newSearchTerm);
    setMinReviews(newMinReviews);
    fetchFilteredCoffeeShops(newSearchTerm, newMinReviews);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <ErrorMessage message={error} onClose={() => setError("")} />;
  }

  return (
    <div className="coffee-shops-container">
      <div className="search-and-filter">
        <button className="filter-btn" onClick={toggleFilterModal}>
          Filter
        </button>
        <div className="search-input-container">
          <img src={searchIcon} alt="Search" className="search-icon" />
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
                    placeholder: "Search locations...",
                    className: "search-bar",
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
      </div>

      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={toggleFilterModal}
          updateFilters={updateFilters}
          currentFilters={{ searchTerm, minReviews }}
        />
      )}

      <h2>Coffee Shops</h2>
      {coffeeShops.length > 0 ? (
        <div className="coffee-shops-list">
          {coffeeShops.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/coffeeshops/${shop._id}`)}
              className="coffee-shop-card"
            >
              <img
                src={shop.mainPhoto}
                alt="Coffee Shop Main"
                className="coffee-shop-image"
              />

              <h3>{shop.name}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>No coffee shops found.</p>
      )}
    </div>
  );
};

export default Coffeeshops;
