# test_app.py
import unittest
import json
from app import app

class WeatherAppTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()

    def test_weather_info_post_valid_zip(self):

        """Test posting a valid ZIP code returns a successful response."""
        response = self.client.post('/api/weather/', json={'zip_code': '70119'})
        print(response)
        self.assertEqual(response.status_code, 200)
        
        data = json.loads(response.get_data(as_text=True))
        self.assertIn('temp_c', data)
        self.assertIn('humidity', data)
        self.assertIn('precip_mm', data)   

if __name__ == '__main__':
    unittest.main()
