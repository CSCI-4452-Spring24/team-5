from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import os
import requests
import weather_utils

#
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#default route definition for testing
@app.route('/')
def home():
    return "functional and responsive 4/21"

#geocoding logic
def get_lat_lon_from_zip(zip_code):
    geocode_api_key = os.environ.get('GEOCODE_API_KEY')
    url = f"https://api.opencagedata.com/geocode/v1/json?q={zip_code}&key={geocode_api_key}&countrycode=US"
    print(f"Requesting URL: {url}")
    response = requests.get(url)
    #print(f"Geocoding API Response: {response.text}")
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

#jsonify object will be returned to awsdomain.com/api/weather (target for axios in react app)
@app.route('/api/weather/', methods=['POST'])
def get_weather_info():

    #obtain zipcode from app input
    zip_code = request.json.get('zip_code')
    if not zip_code:
        return jsonify({"error" : "ZIP code is required."}), 400

    #process zip code resolution to lat/lon
    latitude, longitude = get_lat_lon_from_zip(zip_code)
    if latitude is None or longitude is None:
        return jsonify({"error" : " Could not find latitude and longitude for the given ZIP code."}), 404

    #authenticate weatherAPI connection w/ lat/lon
    weather_api_key = os.environ.get('WEATHER_API_KEY')
    current_url = 'http://api.weatherapi.com/v1/current.json'
    params = {
        'key': weather_api_key,
        'q': f"{latitude},{longitude}"
    }

    response = requests.get(current_url, params=params)

    if response.status_code == 200:
        data = response.json()
        current_weather_info = weather_utils.extract_current(data) 
        return jsonify(current_weather_info)
        
    else:
        return jsonify({"error" : "Unable to fetch weather data"}), 500

#same logic but for forecasts
@app.route('/api/forecast/', methods=['POST'])
def get_forecast_info():
        #obtain zipcode from app input
    zip_code = request.json.get('zip_code')
    if not zip_code:
        return jsonify({"error" : "ZIP code is required."}), 400

    #process zip code resolution to lat/lon
    latitude, longitude = get_lat_lon_from_zip(zip_code)
    if latitude is None or longitude is None:
        return jsonify({"error" : " Could not find latitude and longitude for the given ZIP code."}), 404

    #authenticate weatherAPI connection w/ lat/lon
    weather_api_key = os.environ.get('WEATHER_API_KEY')
    forecast_url = 'http://api.weatherapi.com/v1/forecast.json'
    params = {
        'key': weather_api_key,
        'q': f"{latitude},{longitude}",
        'days': 1
    }

    response = requests.get(forecast_url, params=params)

    if response.status_code == 200:
        forecast_data = response.json()
        forecast_info = weather_utils.extract_forecast_data(forecast_data) 
        return jsonify(forecast_info)
        #return jsonify(forecast_data)
        
    else:
        return jsonify({"error" : "Unable to fetch forecast data"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
