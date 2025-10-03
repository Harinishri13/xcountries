import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [countries, setCountries] = useState([]);
  const fetchCountryData = async () => {
    const res = await fetch("https://xcountries-backend.labs.crio.do/all");
    const data = await res.json();
    setCountries(data);
  };
  useEffect(() => {
    fetchCountryData();
  }, []);

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
