#weather-utils.py

def extract_current(data):
    e = 'error'
    """extracts and assigns field based key values from JSON response data"""
    current_weather_JSON = {
        "last_updated": data['current'].get('last_updated', e),
        "temp_c": data['current'].get('temp_c', e),
        "temp_f": data['current'].get('temp_f', e),
        "wind_mph": data['current'].get('wind_mph', e),
        "wind_dir": data['current'].get('wind_dir', e),
        "precip_mm": data['current'].get('precip_mm', e),
        "precip_in": data['current'].get('precip_in', e),
        "humidity": data['current'].get('humidity', e),
        "cloud_cover": data['current'].get('cloud', e),
        "feelslike_c": data['current'].get('feelslike_c', e),
        "feelslike_f": data['current'].get('feelslike_f', e),
        "text": data['current']['condition']['text'],
        "icon_url": data['current']['condition']['icon']   
    }
    return current_weather_JSON

def extract_forecast_data(forecast_data):
    #error handling for JSON/field object issues
    if 'forecast' not in forecast_data or 'forecastday' not in forecast_data['forecast']:
        return [] #return empty if errror

    daily_forecasts = []
    for day in forecast_data['forecast']['forecastday']:
        day_data = day.get('day', {})
        daily = {
            'date': day['date'],
            'max_temp_c': day_data.get('maxtemp_c', 0),
            'min_temp_c': day_data.get('mintemp_c', 0),
            'avg_temp_c': day_data.get('avgtemp_c', 0),
            'max_wind_mph': day_data.get('maxwind_mph', 0),
            'total_precip_mm': day_data.get('totalprecip_mm', 0),
            'chance_of_rain': day_data.get('daily_chance_of_rain', 0),  # Corrected key for daily chance of rain
            'humidity': day_data.get('avghumidity', 0),
            'condition_text': day_data.get('condition', {}).get('text', 'No data'),
            'condition_icon': day_data.get('condition', {}).get('icon', 'No data')
        }
        hourly_forecasts = []
        for hour in day.get('hour', []):
            condition = hour.get('condition', {})
            hourly = {
                'time': hour['time'],
                'temperature_c': hour.get('temp_c', 0),
                'will_it_rain': hour.get('will_it_rain', 0),
                'chance_of_rain': hour.get('chance_of_rain', 0),
                'text': condition.get('text', 'No data'),
                'icon_url': condition.get('icon', 'No data')
            }
            hourly_forecasts.append(hourly)
        daily['hourly_forecasts'] = hourly_forecasts
        daily_forecasts.append(daily)
    return daily_forecasts
