# test_app.py

import unittest
import json
from app import app  # Adjust the import path as necessary
import os

class WeatherAppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_weather_info_post_valid_zip(self):

        """Test posting a valid ZIP code returns a successful response."""
        response = self.client.post('/api/weather', json={'zip_code': '70119'})
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('temperature', data)
        self.assertIn('humidity', data)
        self.assertIn('rainfall', data)
    
    def test_weather_info_post_invalid_zip(self):

        """Test posting a invalid ZIP code returns an error."""
        response = self.client.post('/api/weather', json={'zip_code': '0000'})
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('error', data)
        self.assertEqual('Could not find latitude and longitude for the given ZIP code', data['error'])
    

if __name__ == '__main__':
    unittest.main()
