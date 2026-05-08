import { useEffect, useState } from "react";

export default function Weather() {
  const CITIES = [
    { name: "Kansas City", lat: 38.88, lon: -94.35 },
    { name: "St. Louis", lat: 38.63, lon: -90.2 },
    { name: "Springfield", lat: 37.21, lon: -93.29 },
    { name: "Columbia", lat: 38.95, lon: -92.33 },
    { name: "Joplin", lat: 37.08, lon: -94.51 },
    { name: "Jefferson City", lat: 38.58, lon: -92.17 },
  ];

  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchWeather(lat: number, lon: number) {
    setLoading(true);
    setError(null);
    try {
      // Open-Meteo API for current weather at a given latitude and longitude. Does not require an API key.
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();

      //Expecting data.current_weather response to include temperature, windspeed, etc.
      //see https://open-meteo.com/en/docs for details on the API response structure
      setWeatherData(data.current_weather);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchWeather(selectedCity.lat, selectedCity.lon);
  }, [selectedCity]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Missouri Weather</h1>
      <p className="text-zinc-400 mb-10">
        Live weather data for various cities across Missouri, powered by the
        Open-Meteo API.
      </p>

      {/* ── Controls ── */}
      <div className="flex flex-wrap gap-4 mb-10 items-center">
        <select
          value={selectedCity.name || CITIES[0].name}
          onChange={(e) => {
            const city = CITIES.find((c) => c.name === e.target.value);
            if (city) setSelectedCity(city);
          }}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors disabled:opacity-50 text-white"
        >
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {weatherData && <pre> {JSON.stringify(weatherData, null, 2)}</pre>}
      </div>
    </div>
  );
}
