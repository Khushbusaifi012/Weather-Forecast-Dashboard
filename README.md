# Weather Report App

A weather dashboard built with Django as the backend and React as the frontend. The backend uses OpenWeather API and serves current weather plus forecast data to the React UI.

## Features

- Current weather for any city
- 5-day forecast cards
- Overview panel with real temperature min/max and humidity
- Dashboard-style UI with search and tabs

## Project structure

- `backend/`: Django API project
- `frontend/`: React application
- `backend/.env`: OpenWeather API key configuration

## Setup

### Backend

1. Open a terminal in the project root.
2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install backend requirements:
   ```powershell
   pip install -r backend\requirements.txt
   ```
4. Create or update `backend/.env` with your OpenWeather key:
   ```text
   OPENWEATHER_API_KEY=YOUR_API_KEY_HERE
   ```
5. Run migrations and start the backend server:
   ```powershell
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

The backend API will be available at:

- `http://127.0.0.1:8000/api/weather/?city=London`

### Frontend

1. Open a new terminal.
2. Install frontend dependencies:
   ```powershell
   cd frontend
   npm install
   ```
3. Start the React development server:
   ```powershell
   npm start
   ```

The frontend UI will run at:

- `http://localhost:3000`

## Usage

- Enter a city name in the search box.
- The React app calls the Django backend at `http://127.0.0.1:8000/api/weather/`.
- The backend fetches current weather and forecast data from OpenWeather.
- The `Overview` card now shows real `temp_max`, `temp_min`, and `humidity` values.

## Important notes

- Keep your OpenWeather API key private.
- If you change frontend host/origin, update `CORS_ALLOWED_ORIGINS` in `backend/weather_project/settings.py`.
- If the backend returns `401 Unauthorized`, verify your API key in `backend/.env`.

## Troubleshooting

- If `npm install` fails, delete `node_modules` and run `npm install` again.
- If backend requests fail, make sure Django is running on `http://127.0.0.1:8000`.
- Confirm the backend is using the correct `.env` file and that `OPENWEATHER_API_KEY` is valid.
