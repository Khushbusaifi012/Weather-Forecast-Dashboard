import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response


def _flatten_current_weather(data):
    return {
        'city': data.get('name'),
        'country': data.get('sys', {}).get('country'),
        'temperature': data.get('main', {}).get('temp'),
        'temp_min': data.get('main', {}).get('temp_min'),
        'temp_max': data.get('main', {}).get('temp_max'),
        'description': data.get('weather', [{}])[0].get('description'),
        'icon': data.get('weather', [{}])[0].get('icon'),
        'humidity': data.get('main', {}).get('humidity'),
        'wind_speed': data.get('wind', {}).get('speed'),
        'sunrise': data.get('sys', {}).get('sunrise'),
        'sunset': data.get('sys', {}).get('sunset'),
    }


def _build_forecast_list(forecast_data):
    forecast_items = []
    seen_dates = set()

    for item in forecast_data.get('list', []):
        dt_txt = item.get('dt_txt', '')
        if '12:00:00' not in dt_txt:
            continue

        date = dt_txt.split(' ')[0]
        if date in seen_dates:
            continue

        seen_dates.add(date)
        forecast_items.append({
            'date': date,
            'temp': item.get('main', {}).get('temp'),
            'icon': item.get('weather', [{}])[0].get('icon'),
            'description': item.get('weather', [{}])[0].get('description'),
        })
        if len(forecast_items) >= 5:
            break

    if not forecast_items:
        for item in forecast_data.get('list', [])[:5]:
            forecast_items.append({
                'date': item.get('dt_txt', '').split(' ')[0],
                'temp': item.get('main', {}).get('temp'),
                'icon': item.get('weather', [{}])[0].get('icon'),
                'description': item.get('weather', [{}])[0].get('description'),
            })

    return forecast_items


def _build_forecast_chart(forecast_data):
    chart_items = []
    for item in forecast_data.get('list', [])[:8]:
        dt_txt = item.get('dt_txt', '')
        label = dt_txt.split(' ')[1][:5] if dt_txt else ''
        chart_items.append({
            'label': label,
            'temp': item.get('main', {}).get('temp'),
        })
    return chart_items


@api_view(['GET'])
def current_weather(request):
    city = request.query_params.get('city', 'London')
    api_key = settings.OPENWEATHER_API_KEY
    if not api_key:
        return Response({'error': 'OpenWeather API key is not configured.'}, status=500)

    current_url = 'https://api.openweathermap.org/data/2.5/weather'
    forecast_url = 'https://api.openweathermap.org/data/2.5/forecast'
    params = {
        'q': city,
        'appid': api_key,
        'units': 'metric',
    }

    current_resp = requests.get(current_url, params=params)
    if current_resp.status_code != 200:
        payload = current_resp.json()
        if current_resp.status_code == 401:
            return Response(
                {'error': 'OpenWeather API key unauthorized. Check backend .env OPENWEATHER_API_KEY.'},
                status=401,
            )
        return Response(payload, status=current_resp.status_code)

    forecast_resp = requests.get(forecast_url, params=params)
    if forecast_resp.status_code != 200:
        payload = forecast_resp.json()
        if forecast_resp.status_code == 401:
            return Response(
                {'error': 'OpenWeather API key unauthorized. Check backend .env OPENWEATHER_API_KEY.'},
                status=401,
            )
        return Response(payload, status=forecast_resp.status_code)

    current_data = current_resp.json()
    forecast_data = forecast_resp.json()

    result = _flatten_current_weather(current_data)
    result['forecast'] = _build_forecast_list(forecast_data)
    result['chart'] = _build_forecast_chart(forecast_data)

    return Response(result)
