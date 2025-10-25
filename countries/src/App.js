import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch country data (using the same API)
  const fetchCountryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://xcountries-backend.labs.crio.do/all");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      // ✅ Correctly extract fields from API response
      const validCountries = data.map((country, index) => ({
        id: `${country.name?.common?.replace(/\s+/g, "-")}-${index}`,
        name: country.name?.common || "Unknown",
        flag: country.flags?.png || "",
      }));

      setCountries(validCountries);
      setFilteredCountries(validCountries);
    } catch (err) {
      console.error("Error fetching data", err); // ✅ For test visibility
      setError("Error fetching data"); // ✅ Simple message expected by tests
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle search filtering
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

  // ✅ Fetch data on mount
  useEffect(() => {
    fetchCountryData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRetry = () => {
    fetchCountryData();
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="App">
        <p>Loading countries...</p>
      </div>
    );
  }

  // ✅ Error state
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
      {/* ✅ Search Input */}
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

      {/* ✅ Results Info */}
      <div className="results-info">
        {filteredCountries.length === 0 && searchTerm ? (
          <p>No countries found matching "{searchTerm}"</p>
        ) : (
          <p>Showing {filteredCountries.length} countries</p>
        )}
      </div>

      {/* ✅ Country Grid */}
      <div className="countries-grid" data-testid="countries-grid">
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
