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
      console.log("API Response:", data); // Debug: log the actual API response

      // Process the data based on actual API structure
      const validCountries = data
        .filter((country) => country && (country.common || country.name)) // Handle both possible field names
        .map((country, index) => {
          // Determine the correct field names
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

      console.log("Processed countries:", validCountries); // Debug: log processed data
      setCountries(validCountries);
      setFilteredCountries(validCountries);
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching data: ${err.message}`);
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

      {/* Results count */}
      <div className="results-info">
        {filteredCountries.length === 0 && searchTerm ? (
          <p>No countries found matching "{searchTerm}"</p>
        ) : (
          <p>
            Showing {filteredCountries.length} countries out of{" "}
            {countries.length} total
          </p>
        )}
      </div>

      {/* Debug info - remove in production */}
      {countries.length > 0 && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          Debug: Loaded {countries.length} countries
        </div>
      )}

      {/* Countries grid */}
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <div className="country-card" key={country.id}>
            <img
              src={country.flag}
              alt={`Flag of ${country.name}`}
              width={100}
              height={60}
              style={{ objectFit: "cover" }}
              onError={(e) => {
                console.log(
                  `Failed to load flag for ${country.name}: ${country.flag}`
                );
                e.target.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNjAiIGZpbGw9IiNlMWUxZTEiLz48dGV4dCB4PSI1MCIgeT0iMzAiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZsYWcgbm90IGZvdW5kPC90ZXh0Pjwvc3ZnPg=";
              }}
            />
            <p>{country.name}</p>
            {/* Debug info for each country - remove in production */}
            <small style={{ color: "#999", fontSize: "10px" }}>
              {country.flag ? "✓" : "✗"} Flag
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
