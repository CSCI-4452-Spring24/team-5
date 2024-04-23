import { useState } from "react";
import axios from "axios";

const useWeatherData = () => {
    const [response, setResponse] = useState(null);  // Initialize with null for clarity
    const [errorMessage, setErrorMessage] = useState("");  // Initialize with empty string

    // Function to reset weather data and error message
    const resetWeatherData = () => {
        setResponse(null);
        setErrorMessage("");
    };

    // Function to fetch weather data
    const fetchWeatherData = async (zipCode) => {
        resetWeatherData();
        console.log(`Fetching weather data for ${zipCode} from backend`);
        try {
            const response = await axios.post(
                'http://44.204.197.21/api/forecast/',
                { zip_code: zipCode },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    }
                }
            );
            console.log(response.data);
            setResponse(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            if (error.response) { // Request made and server responded with an error status code
                console.error('Error data:', error.response.data);
                console.error('Error status:', error.response.status);
                console.error('Error headers:', error.response.headers);
                setErrorMessage(error.response.data.error || 'Server error');
            } else if (error.request) { // Request made but no response received
                console.error('No response:', error.request);
                setErrorMessage('No response from server');
            } else { // An error occurred in setting up the request
                console.error('Setup error:', error.message);
                setErrorMessage('Error setting up the request');
            }
        }
    };

    return [fetchWeatherData, response, errorMessage];
};

export default useWeatherData;
