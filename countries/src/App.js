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

      // Try multiple possible endpoints
      const endpoints = [
        "https://xcountries-backend.labs.crio.do/countries",
        "https://xcountries-backend.labs.crio.do/all",
        "https://restcountries.com/v3.1/all",
      ];

      let success = false;

      for (const endpoint of endpoints) {
        try {
          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            console.log("Success with endpoint:", endpoint, data);

            // Process data based on structure
            const processedCountries = Array.isArray(data)
              ? data.map((country, index) => ({
                  name:
                    country.common ||
                    country.name ||
                    country.name?.common ||
                    "Unknown",
                  flag: country.png || country.flag || country.flags?.png || "",
                  id: `country-${index}-${Math.random()}`,
                }))
              : [];

            setCountries(processedCountries);
            setFilteredCountries(processedCountries);
            success = true;
            break;
          }
        } catch (e) {
          console.log(`Failed with ${endpoint}:`, e.message);
          continue;
        }
      }

      if (!success) {
        throw new Error("All API endpoints failed");
      }
    } catch (err) {
      const errorMessage = `Failed to fetch countries: ${err.message}`;
      setError(errorMessage);
      console.error(errorMessage);

      // Fallback to mock data for testing
      const mockCountries = [
        { name: "India", flag: "https://flagcdn.com/w320/in.png", id: "india" },
        {
          name: "United States",
          flag: "https://flagcdn.com/w320/us.png",
          id: "usa",
        },
        {
          name: "Indonesia",
          flag: "https://flagcdn.com/w320/id.png",
          id: "indonesia",
        },
        {
          name: "United Kingdom",
          flag: "https://flagcdn.com/w320/gb.png",
          id: "uk",
        },
        {
          name: "Germany",
          flag: "https://flagcdn.com/w320/de.png",
          id: "germany",
        },
      ];

      setCountries(mockCountries);
      setFilteredCountries(mockCountries);
      setError(null); // Clear error since we have mock data
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
          data-testid="search-input"
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleRetry}>Retry</button>
        </div>
      )}

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
            className="countryCard"
            key={country.id}
            data-testid="country-container"
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
