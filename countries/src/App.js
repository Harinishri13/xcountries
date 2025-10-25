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

      const res = await fetch("https://xcountries-backend.labs.crio.do/all");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      // Process the data - handle both possible API response structures
      const validCountries = data
        .filter((country) => country && (country.common || country.name))
        .map((country, index) => {
          const countryName = country.common || country.name;
          const flagUrl = country.png || country.flag;

          return {
            ...country,
            name: countryName,
            flag: flagUrl,
            id:
              `${countryName?.replace(/\s+/g, "-")}-${index}` ||
              `country-${index}`,
          };
        });

      setCountries(validCountries);
      setFilteredCountries(validCountries);
    } catch (err) {
      const errorMessage = `Error fetching data: ${err.message}`;
      setError(errorMessage);
      console.error(errorMessage); // Ensure error is logged to console for tests
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
        <p>{error}</p>
        <button onClick={handleRetry}>Retry</button>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Search Bar - Ensure it has the correct attributes for tests */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for a country..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
          data-testid="search-input"
        />
      </div>

      {/* Results count */}
      <div className="results-info">
        {filteredCountries.length === 0 && searchTerm ? (
          <p>No countries found matching "{searchTerm}"</p>
        ) : (
          <p>Showing {filteredCountries.length} countries</p>
        )}
      </div>

      {/* Countries grid - Ensure proper structure for tests */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <div
            className="country-card"
            key={country.id}
            data-testid="country-container"
          >
            <img
              src={country.flag}
              alt={`Flag of ${country.name}`}
              width={100}
              height={60}
              style={{ objectFit: "cover" }}
              onError={(e) => {
                // Fallback for broken images
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNlMWUxZTEiLz48dGV4dCB4PSI1MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsYWcgbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=";
              }}
            />
            <p>{country.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
