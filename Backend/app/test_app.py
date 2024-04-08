# test_app.py

import unittest
from app import app  # Adjust the import path as necessary
import os

class WeatherAppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_home_page(self):
        """Test that the home page loads correctly."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        
        self.assertIn('Enter ZIP Code for Weather Information', response.get_data(as_text=True))

    def test_weather_info_post_valid_zip(self):
        """Test posting a valid ZIP code returns a successful response."""
        with self.client as c:
            
            response = c.post('/', data={'zip_code': '70119'})
            self.assertEqual(response.status_code, 200)
            
            self.assertIn('Temperature:', response.get_data(as_text=True))
            

if __name__ == '__main__':
    unittest.main()
