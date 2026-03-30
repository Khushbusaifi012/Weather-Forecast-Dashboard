import { useEffect, useState } from 'react';
import axios from 'axios';

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const API_BASE_URL = process.env.REACT_APP_API_BASE || 'http://127.0.0.1:8000';

function formatDay(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return days[date.getDay()];
}

function formatTime(epoch) {
  if (!epoch) return '--';
  return new Date(epoch * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getChartHeight(value, max) {
  if (!max || max <= 0) return '12%';
  return `${Math.max((value / max) * 100, 12)}%`;
}

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/weather/`, {
        params: { city },
      });
      setWeather(response.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.statusText ||
        'Unable to load weather.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const chartData = weather?.chart || [];
  const chartMax = chartData.length > 0 ? Math.max(...chartData.map((point) => point.temp || 0)) : weather?.temp_max || 1;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand-panel">
          <div className="brand-mark">W</div>
          <div>
            <h1>Weather</h1>
            <p>Dashboard</p>
          </div>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">O</div>
          <div>
            <p className="profile-name">OpenWeather</p>
            <p className="profile-role">Weather Enthusiast</p>
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <h2>Weather Dashboard</h2>
            <p>Live weather, forecast, and performance overview.</p>
          </div>
          <div className="search-box">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Search city..."
              onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
            />
            <button onClick={fetchWeather}>Search</button>
          </div>
        </header>

        {loading && <div className="alert-banner">Loading weather...</div>}
        {error && <div className="alert-banner error-banner">{error}</div>}

        <div className="top-tabs">
          <button className="tab-item active">Home</button>
          <button className="tab-item">Forecast</button>
          <button className="tab-item">Analytics</button>
          <button className="tab-item">Settings</button>
        </div>

        <section className="hero-grid">
          <article className="hero-card">
            <div className="hero-top">
              <div>
                <p className="label">Current location</p>
                <h3>{weather?.city ?? 'Loading...'}</h3>
                <span>{weather?.country ?? '...'}</span>
              </div>
              <div className="weather-icon">
                {weather && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                    alt={weather.description}
                  />
                )}
              </div>
            </div>

            <div className="hero-metrics">
              <div>
                <p className="temp-value">{weather ? Math.round(weather.temperature) : '--'}°</p>
                <p className="temp-label">Feels like {weather ? Math.round(weather.temperature) : '--'}°</p>
              </div>
              <div>
                <p className="weather-text">{weather?.description || 'Sunny'}</p>
                <p className="weather-small">
                  Humidity {weather?.humidity ?? '--'}% • Wind {weather?.wind_speed ?? '--'} m/s
                </p>
              </div>
            </div>

            <div className="mini-widgets">
              <div>
                <p>Humidity</p>
                <strong>{weather?.humidity ?? '--'}%</strong>
              </div>
              <div>
                <p>Wind</p>
                <strong>{weather?.wind_speed ?? '--'} m/s</strong>
              </div>
              <div>
                <p>Sunrise</p>
                <strong>{weather ? formatTime(weather.sunrise) : '--'}</strong>
              </div>
              <div>
                <p>Sunset</p>
                <strong>{weather ? formatTime(weather.sunset) : '--'}</strong>
              </div>
            </div>
          </article>

          <article className="summary-card">
            <div className="summary-top">
              <p>Today</p>
              <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="summary-chart">
              <div className="summary-value">{weather ? Math.round(weather.temperature) : '--'}°C</div>
              <p>Weather is {weather?.description ?? 'clear'} with steady conditions through the day.</p>
            </div>
            <div className="summary-items">
              <div>
                <p>Feels good</p>
                <strong>{weather ? Math.round(weather.temperature) : '--'}°</strong>
              </div>
              <div>
                <p>Air quality</p>
                <strong>Good</strong>
              </div>
              <div>
                <p>Rain chance</p>
                <strong>15%</strong>
              </div>
            </div>
          </article>
        </section>

        <section className="forecast-section">
          <div className="section-header">
            <h3>Next 5 Days</h3>
            <button>See all</button>
          </div>
          <div className="forecast-list">
            {(weather?.forecast || []).map((item) => (
              <div key={item.date} className="forecast-day-card">
                <p>{formatDay(item.date)}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                  alt={item.description}
                />
                <strong>{Math.round(item.temp)}°</strong>
                <span>{item.description}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="overview-card">
          <div className="overview-header">
            <div>
              <h3>Overview</h3>
              <p>Temperature, humidity and rainfall performance.</p>
            </div>
          </div>
          <div className="overview-content">
            <div className="overview-chart">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="chart-bar"
                  style={{ height: getChartHeight(item.temp, chartMax) }}
                  title={`${item.label} ${Math.round(item.temp)}°`}
                />
              ))}
            </div>
            <div className="overview-statistics">
              <div>
                <p>High</p>
                <strong>{weather?.temp_max ? `${Math.round(weather.temp_max)}°` : '--'}</strong>
              </div>
              <div>
                <p>Low</p>
                <strong>{weather?.temp_min ? `${Math.round(weather.temp_min)}°` : '--'}</strong>
              </div>
              <div>
                <p>Humidity</p>
                <strong>{weather?.humidity ?? '--'}%</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
