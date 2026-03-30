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
4. Create a backend environment file:
   - Copy `backend\.env.example` to `backend\.env`
   - Add your `OPENWEATHER_API_KEY`
   - Set `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, and `CORS_ALLOWED_ORIGINS`

5. Run migrations and start the backend server:
   ```powershell
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend

1. Open a new terminal.
2. Install frontend dependencies:
   ```powershell
   cd frontend
   npm install
   ```
3. Create a frontend environment file:
   - Copy `frontend\.env.example` to `frontend\.env`
   - For local development, keep `REACT_APP_API_BASE=http://127.0.0.1:8000`
   - For Render deployment, update `REACT_APP_API_BASE` to your backend service URL
4. Start the React development server:
   ```powershell
   npm start
   ```

The frontend UI will run at:

- `http://localhost:3000`

## Usage

- Enter a city name in the search box.
- The backend fetches current weather and forecast data from OpenWeather.
- The `Overview` card now shows real `temp_max`, `temp_min`, and `humidity` values.

## Render deployment

### Backend on Render

1. Create a new Web Service on Render using the repository branch.
2. Set build and start commands:
   - Build command: `cd backend && pip install -r requirements.txt`
   - Start command: `cd backend && gunicorn weather_project.wsgi:application`
3. Add render environment variables:
   - `OPENWEATHER_API_KEY` = your OpenWeather API key
   - `DJANGO_SECRET_KEY` = a secure secret value
   - `DJANGO_DEBUG` = `False`
   - `DJANGO_ALLOWED_HOSTS` = your-backend-service.onrender.com
   - `CORS_ALLOWED_ORIGINS` = `https://your-frontend-service.onrender.com`
4. After deployment, copy the backend service URL for the frontend.

### Frontend on Render

1. Create a new Static Site on Render using the same repository branch.
2. Set build command and publish directory:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/build`
3. Add render environment variable:
   - `REACT_APP_API_BASE` = `https://your-backend-service.onrender.com`
4. Deploy and use the generated frontend URL.

> Important: The frontend `REACT_APP_API_BASE` must match your backend Render URL exactly. The backend `CORS_ALLOWED_ORIGINS` must include the frontend origin.

## Important notes

- Keep your OpenWeather API key private.
- If you change frontend host/origin, update `CORS_ALLOWED_ORIGINS` in `backend/weather_project/settings.py` and Render environment variables.

## Troubleshooting

- If `npm install` fails, delete `node_modules` and run `npm install` again.
- If backend requests fail, make sure Django is running on `http://127.0.0.1:8000` locally or that Render URLs are correct.
