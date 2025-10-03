import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://xcountries-backend.labs.crio.do/all");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setCountries(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch countries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountryData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="App">
        <p>Loading countries...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="App">
        <p>Error loading countries: {error}</p>
        <button onClick={fetchCountryData}>Retry</button>
      </div>
    );
  }

  // Show countries data
  return (
    <div className="App">
      {countries.map((country) => {
        return (
          <div id="box" key={country.abbr}>
            <img src={country.flag} alt={country.name} width={100} />
            <p>{country.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
