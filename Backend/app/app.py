from flask import Flask, request, render_template
import os
import requests
import json

app = Flask(__name__)

#print("Geocode API Key:", os.environ.get('GEOCODE_API_KEY'))
#print("Weather API Key:", os.environ.get('WEATHER_API_KEY'))


def get_lat_lon_from_zip(zip_code):
    geocode_api_key = os.environ.get('GEOCODE_API_KEY')
    url = f"https://api.opencagedata.com/geocode/v1/json?q={zip_code}&key={geocode_api_key}&countrycode=US"
    print(f"Requesting URL: {url}")
    response = requests.get(url)
    print(f"Geocoding API Response: {response.text}")
    if response.status_code == 200:
        data = response.json()
        lat = data['results'][0]['geometry']['lat']
        lon = data['results'][0]['geometry']['lng']
        return lat, lon
    else:
        print("Geocoding API request failed.")
        print(f"Error with request: {response.status_code}")
        print(response.text)
        return None, None

@app.route('/', methods=['GET', 'POST'])
def get_weather_info():
    if request.method == 'POST':
        zip_code = request.form.get('zip_code')
    else:
        return render_template('index.html')

    if not zip_code:
        return "ZIP code is required.", 400

    latitude, longitude = get_lat_lon_from_zip(zip_code)
    if latitude is None or longitude is None:
        return "Could not find latitude and longitude for the given ZIP code.", 404

    weather_api_key = os.environ.get('WEATHER_API_KEY')
    url = 'http://api.weatherapi.com/v1/current.json'
    params = {
        'key': weather_api_key,
        'q': f"{latitude},{longitude}"
    }

    response = requests.get(url, params=params)
    rainfall_message = "Unable to fetch rainfall data."
    weather_info = "Weather information not available."

    if response.status_code == 200:
        data = response.json()

        temperature = data['current'].get('temp_c', 0)
        feels_like_temp = data['current'].get('feelslike_c', 0)
        humidity = data['current'].get('humidity', 0)
        wind_speed = data['current'].get('wind_mph', 0)
        wind_dir = data['current'].get('wind_dir', 'null')
        #comment

        #f_temperature = data['current'].get('temp_c', 0)
        #f_humidity = data['current'].get('humidity', 0)
        #f_wind_speed = data['current'].get('wind_mph', 0)
        #f_rainfall = data['current']['precip_mm']
        #current_conditions = f"Temperature: {temperature}°C\nHumidity: {humidity}%\nFeels Like: {feels_like_temp}\nWind Speed: {wind_speed} MPH\n"
        #forecasted_conditions = f"FORECAST:\nTemperature: {f_temperature}°C\nHumidity: {f_humidity}%\nWind Speed: {f_wind_speed} MPH\nForecasted Precipitation: {forecasted_rain}"
        
        weather_info = f"Temperature: {temperature}°C\nHumidity: {humidity}%\nFeels Like: {feels_like_temp}°C\nWind Speed: {wind_speed} MPH from {wind_dir}\n"
        rainfall = data['current']['precip_mm']
        rainfall_message = f"Current Rainfall: {rainfall} mm"
        rainfall_threshold = 12.7
        if rainfall > rainfall_threshold:
            rainfall_message += " - Pick it up or dry it out!"
        else:
            rainfall_message += " - Rainfall is below the threshold."

    return_msg = "\n".join([weather_info, rainfall_message])
    return render_template('index.html', message=return_msg)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
