/**
 * Weather page — live current conditions for a handful of Missouri
 * cities, fetched from the free Open-Meteo API (no API key needed).
 */
import { useEffect, useState } from "react";

const CITIES = [
  { name: "Kansas City", lat: 38.88, lon: -94.35 },
  { name: "St. Louis", lat: 38.63, lon: -90.2 },
  { name: "Springfield", lat: 37.21, lon: -93.29 },
  { name: "Columbia", lat: 38.95, lon: -92.33 },
  { name: "Joplin", lat: 37.08, lon: -94.51 },
  { name: "Jefferson City", lat: 38.58, lon: -92.17 },
];

interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  is_day: number;
}

/**
 * Map an Open-Meteo WMO weather code to a short human-readable label.
 * See https://open-meteo.com/en/docs — "WMO Weather interpretation codes".
 */
function describeWeatherCode(code: number): string {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code <= 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow Showers";
  return "Thunderstorm";
}

export default function Weather() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-fetch whenever the selected city changes. The AbortController in
  // the cleanup cancels any in-flight request so a slow response for a
  // previously selected city can't overwrite the current one.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchWeather() {
      setLoading(true);
      setError(null);
      try {
        // Units are requested explicitly so the display labels (°F / mph)
        // always match — Open-Meteo defaults to °C and km/h otherwise.
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${String(selectedCity.lat)}&longitude=${String(selectedCity.lon)}` +
            `&current_weather=true&temperature_unit=fahrenheit&wind_speed_unit=mph`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = (await response.json()) as {
          current_weather?: CurrentWeather;
        };
        if (!data.current_weather) {
          throw new Error("Unexpected API response shape");
        }
        setWeatherData(data.current_weather);
        setLoading(false);
      } catch (err) {
        // An abort just means the user picked another city — ignore it.
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
        setLoading(false);
      }
    }

    void fetchWeather();
    return () => {
      controller.abort();
    };
  }, [selectedCity]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-light mb-4">Missouri Weather</h1>
      <p className="text-zinc-400 mb-10">
        Live weather data for various cities across Missouri, powered by the
        Open-Meteo API.
      </p>

      <div className="flex flex-wrap gap-4 mb-10 items-center">
        <select
          value={selectedCity.name}
          onChange={(e) => {
            const city = CITIES.find((c) => c.name === e.target.value);
            if (city) setSelectedCity(city);
          }}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors text-white"
        >
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <p className="text-zinc-400 animate-pulse">Loading weather data...</p>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && weatherData && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Temperature</p>
            <p className="text-4xl font-light">
              {Math.round(weatherData.temperature)}°F
            </p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Wind Speed</p>
            <p className="text-4xl font-light">
              {Math.round(weatherData.windspeed)} mph
            </p>
          </div>
          <div className="bg-zinc-800 rounded-xl p-6">
            <p className="text-zinc-400 text-sm mb-1">Condition</p>
            <p className="text-4xl font-light">
              {describeWeatherCode(weatherData.weathercode)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
