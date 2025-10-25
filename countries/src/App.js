import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        "https://countries-search-data-prod-812920491762.asia-south1.run.app/countries"
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Process the data - assuming the API returns array of countries with name and flag properties
      const processedCountries = data.map((country, index) => ({
        name: country.name || country.common || "Unknown Country",
        flag: country.flag || country.png || "",
        id: `country-${index}`,
      }));

      setCountries(processedCountries);
      setFilteredCountries(processedCountries);
    } catch (err) {
      const errorMessage = `Failed to fetch countries: ${err.message}`;
      setError(errorMessage);
      console.error(errorMessage); // Log error to console as required
    } finally {
      setLoading(false);
    }
  };

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
  }, [searchTerm, countries]);

  useEffect(() => {
    fetchCountryData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    fetchCountryData();
  };

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
        <p>Error loading countries</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {/* Results info */}
      <div className="results-info">
        {filteredCountries.length === 0 && searchTerm ? (
          <p>No countries found matching "{searchTerm}"</p>
        ) : (
          <p>Showing {filteredCountries.length} countries</p>
        )}
      </div>

      {/* Countries grid */}
      <div className="countries-container">
        {filteredCountries.map((country) => (
          <div
            className="countryCard" // Exact class name as required
            key={country.id}
          >
            <img
              src={country.flag}
              alt={`Flag of ${country.name}`}
              className="country-flag"
            />
            <p className="country-name">{country.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
