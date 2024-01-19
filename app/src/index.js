import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

function Index() {
  const [isMapsApiLoaded, setMapsApiLoaded] = useState(false);

  useEffect(() => {
    window.initMap = function () {
      setMapsApiLoaded(true);
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      window.initMap = null;
    };
  }, []);

  return (
    <React.StrictMode>
      {isMapsApiLoaded ? <App /> : <div>Loading ...</div>}
    </React.StrictMode>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Index />);
