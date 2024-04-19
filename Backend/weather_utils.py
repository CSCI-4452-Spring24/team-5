#weather-utils.py

def extract_current(data):
    """extracts and assigns field based key values from JSON response data"""
    current_weather_JSON = {
        "last_updated": data['current'].get('last_updated', 00:00:00),
        "temp_c": data['current'].get('temp_c', 0),
        "temp_f": data['current'].get('temp_f', 0),
        "wind_mph": data['current'].get('wind_mph', 0),
        "wind_dir": data['current'].get('wind_dir', 'N/A')
        "precip_mm": data['current'].get('precip_mm'),
        "precip_in": data['current'].get('precip_in'),
        "humidity": data['current'].get('humidity', 0),
        "cloud_cover": data['current'].get('cloud', 0),
        "feelslike_c": data['current'].get('feelslike_c', 0),
        "feelslike_f": data['current'].get('feelslike_f', 0)        
    }
    return current_weather_JSON

def extract_condition(data):
    """Extract weather conditions."""
    weather_conditions = {
        "text": data['condition']['text'],
        "icon_url": data['condition']['icon'],
        "code": data['condition']['code']
    }

    return weather_conditions

def extract_forecast_data(forecast_data):
    """Extracts forecast information from API response data for daily and hourly forecasts."""
    daily_forecasts = []
    for day in forecast_data['forecastday']:
        daily = {
            'date': day['date'],
            'max_temp_c': day['day'].get('maxtemp_c', 0),
            'min_temp_c': day['day'].get('mintemp_c', 0),
            'avg_temp_c': day['day'].get('avgtemp_c', 0),
            'max_wind_mph': day['day'].get('maxwind_mph', 0),
            'total_precip_mm': day['day'].get('totalprecip_mm', 0),
            'chance_of_rain': day['day'].get('daily_chance_of_rain', 0),
            'humidity': day['day'].get('avghumidity', 0)
        }
        hourly_forecasts = []
        for hour in day['hour']:
            hourly = {
                'time': hour['time'],
                'temperature_c': hour['temp_c'] if 'temp_c' in hour else None,
                'will_it_rain': hour['will_it_rain'],
                'chance_of_rain': hour['chance_of_rain'],
                'condition': hour['condition']['text']
            }
            hourly_forecasts.append(hourly)
        daily['hourly_forecasts'] = hourly_forecasts
        daily_forecasts.append(daily)
    return daily_forecasts