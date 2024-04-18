import { useEffect, useState } from "react";
import axios from "axios";

export default () => {
    const [response, setResponse] = useState();
    const [errorMessage, setErrorMessage] = useState("");


    //TODO: Add auth token verification w/ cognito
    const fetchWeatherData = async (zipCode) => {
        console.log(`Fetching weather data for ${zipCode} from backend`);
        try{
            const response = await axios.post(
                'http://54.210.74.245:80/api/weather',
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
            if (error.response) { //request made, server responds, but error has occured server side
                console.error(error.response.data);
                console.error(error.response.status);
                console.error(error.response.headers);
                setErrorMessage(error.response.data.error || 'Server error');
            } else if (error.request) { //request made, no response from server
                console.error(error.request);
                setErrorMessage('No response from server');
            } else { //request not able to be made (wrong ip, etc.)
                console.error('Error', error.message);
                setErrorMessage('Error setting up the request');
            }
        }
    }

    /* useEffect( () => {
        fetchWeatherData(); //default zipcode when openning app from database?
    }, []); */

    return [fetchWeatherData, response, errorMessage];
};