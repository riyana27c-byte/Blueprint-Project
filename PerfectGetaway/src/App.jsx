import { useEffect, useState } from "react";
// IMPORT styles.css INSTEAD DELETE APP.CSS WEEK 4
import "./App.css";

function App() {

  const [weather, setWeather] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: ""
  });
  const [showResultDropdown, setShowResultDropdown] = useState(false);
  const [resultGroup, setResultGroup] = useState(""); // "A" or "B"
  const [showDropdown, setShowDropdown] = useState(false);
  const [totalCost, setTotalCost] = useState(null);
  const cityCoords = {
    "New York City": { lat: 40.7128, lon: -74.0060 },
    "Dubai": { lat: 25.276987, lon: 55.296249 },
    "Paris": { lat: 48.8566, lon: 2.3522 },
    "Shanghai": { lat: 31.2304, lon: 121.4737 },
    "Orlando": { lat: 28.5383, lon: -81.3792 },
    "Florence": { lat: 43.7696, lon: 11.2558 },
    "Athens": { lat: 37.9838, lon: 23.7275 },
    "Rio de Janeiro": { lat: -22.9068, lon: -43.1729 },
    "Los Angeles": { lat: 34.0522, lon: -118.2437 },
    "Tokyo": { lat: 35.6762, lon: 139.6503 }
  };

  useEffect(() => {
    if (!selectedDestination){
      return;
    }
    const coords = cityCoords[selectedDestination];
    const lat = coords.lat;
    const lon = coords.lon;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setWeather(data);
      })
    .catch((error) => console.log("Weather fetch error:", error));
  }, [selectedDestination]);

  useEffect(() => {
     if (!selectedDestination){
      return;
     }
    const coords = cityCoords[selectedDestination];
    const url = `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${coords.lon},${coords.lat},5000&limit=10&apiKey=7733a6218fbe43dd92160b961a1366bf`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.features) {
          setDestinations(data.features);
        }
        else {
          setDestinations([]);
        }
      })
    .catch((err) => console.error("Error fetching destinations:", err));
  }, [selectedDestination]);

  const [formData, setFormData] = useState({
    flight: "",
    hotel: "",
    nights: "",
    food: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    const flight = Number(formData.flight);
    const hotel = Number(formData.hotel);
    const nights = Number(formData.nights);
    const food = Number(formData.food);
    const total = flight + hotel * nights + food * nights;
    setTotalCost(total);
  };

  return (
   <div className="app-container">
      <header>
        <h1>Perfect Getaway</h1>
        <p>Plan your perfect vacation in seconds!</p>
      </header>

      <nav>
        <ul>
          <li>
            <a href="#PickDestOptions">Pick Your Travel Destination</a>
          </li>
          <li>
            <a href="#TravelCalculator">Trip Cost Calculator</a>
          </li>
          <li>
           <a href="#DestinationWeather">Destination Weather</a>
          </li>
        </ul>
      </nav>

      <main>
        <section id="PickDestOptions">
          <h2>Pick your Travel Destination</h2>
          <button onClick={() => setShowDropdown(true)}>
            I know my Travel Destination!
          </button>
          <button onClick={() => setShowQuiz(true)}>
            I need help picking a Travel Destination!
          </button>
          {showDropdown && (
          <div className="destination-dropdown">
                    <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
        >
          <option value="">Select a destination...</option>
          {Object.keys(cityCoords).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
          </div>
        )}
        {showQuiz && !showDropdown &&!showResultDropdown && (
  <div className="quiz-box">
    <h3>Vacation Quiz</h3>

    {/* Question 1 */}
    <p>1. Vacation vibe?</p>
    <label>
      <input
        type="radio"
        name="q1"
        value="A"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q1: e.target.value }))}
      />
      A. Fast, diverse
    </label>

    <label>
      <input
        type="radio"
        name="q1"
        value="B"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q1: e.target.value }))}
      />
      B. Slow, relaxing
    </label>


    {/* Question 2 */}
    <p>2. What’s your ideal day?</p>
    <label>
      <input
        type="radio"
        name="q2"
        value="A"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q2: e.target.value }))}
      />
      A. Skyscrapers, modern, crowds, nightlife
    </label>

    <label>
      <input
        type="radio"
        name="q2"
        value="B"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q2: e.target.value }))}
      />
      B. Museums, old architecture, history, scenery
    </label>


    {/* Question 3 */}
    <p>3. Who are you traveling with?</p>
    <label>
      <input
        type="radio"
        name="q3"
        value="A"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q3: e.target.value }))}
      />
      A. Alone
    </label>

    <label>
      <input
        type="radio"
        name="q3"
        value="B"
        onChange={(e) => setAnswers((prev) => ({ ...prev, q3: e.target.value }))}
      />
      B. With family/friends
    </label>


    {/* Submit button */}
    <br />
    <button 
      onClick={() => {
        const countA = Object.values(answers).filter((v) => v === "A").length;
        const countB = Object.values(answers).filter((v) => v === "B").length;

        if (countA > countB) setResultGroup("A");
        else setResultGroup("B");

        setShowResultDropdown(true);
      }}
      disabled={!answers.q1 || !answers.q2 || !answers.q3}
    >
      See My Destination!
    </button>
  </div>
)}
{showResultDropdown && (
  <div className="destination-dropdown">
    <h3>Recommended Destinations:</h3>

    <select value={selectedDestination}
  onChange={(e) => setSelectedDestination(e.target.value)}>
      <option value="">Choose a destination...</option>

      {resultGroup === "A" && (
        <>
          <option value="New York City">New York City</option>
          <option value="Dubai">Dubai</option>
          <option value="Shanghai">Shanghai</option>
          <option value="Tokyo">Tokyo</option>
          <option value="Orlando">Orlando</option>
          <option value="Los Angeles">Los Angeles</option>
        </>
      )}

      {resultGroup === "B" && (
        <>
          <option value="Paris">Paris</option>
          <option value="Florence">Florence</option>
          <option value="Athens">Athens</option>
          <option value="Rio de Janeiro">Rio de Janeiro</option>
        </>
      )}
    </select>
  </div>
)}
{destinations.length > 0 && (
  <div className="results">
    <h3>Top things to do in {selectedDestination}:</h3>
    <p>
      {destinations.map((tourism) => (
        <li key={tourism.properties.place_id}>
          {tourism.properties.name} - {tourism.properties.address_line1}
        </li>
      ))}
    </p>
  </div>
)}


        </section>

        <section id="TravelCalculator">
          <h2>Trip Cost Calculator</h2>
          <div className="row">
            <form onSubmit={handleSubmit}>
            <label htmlFor="flight">Flight Cost:</label>
            <input
              name="flight"
              value={formData.flight}
              onChange={handleInputChange}
              placeholder="Enter a number"
              required
            />

            <label htmlFor="hotel">Hotel Cost per Night:</label>
            <input
              name="hotel"
              value={formData.hotel}
              onChange={handleInputChange}
              placeholder="Enter a number"
              required
            />

            <label htmlFor="nights">Number of Nights:</label>
            <input
              name="nights"
              value={formData.nights}
              onChange={handleInputChange}
              placeholder="Enter a number"
            ></input>

            <label htmlFor="food">Food Cost per Day:</label>
            <input
              name="food"
              value={formData.food}
              onChange={handleInputChange}
              placeholder="Enter a number"
            ></input>

            <button type="submit">Submit</button>
          </form>
          </div>
            {totalCost !== null && (
    <h3>Total Cost: ${totalCost}</h3>
  )}
        </section>
        <section id="DestinationWeather">
          <h2>Destination Weather</h2>
        {weather ? (
        <div>
          <p>Temperature: {weather.hourly.temperature_2m[0]} °C</p>
          <p>Feels Like: {weather.hourly.apparent_temperature[0]} °C</p>
          <p>Humidity: {weather.hourly.relative_humidity_2m[0]}%</p>
          <p>Precipitation: {weather.hourly.precipitation[0]} mm</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
        </section>
      </main>

      <footer>
        <p>Have a Great Trip!</p>
      </footer>
    </div>
  );
}

export default App;