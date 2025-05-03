import React, { useEffect, useState } from 'react';
import Header from './Components/Header';
import DefaultScreen from './Components/DefaultScreen';
import { fetchWeatherApi } from 'openmeteo';
import { weatherCodesMapping } from './utils.js';
import SearchResult from './Components/SearchResult.jsx';

export default function App() {

  const [dailyForecast,setDailyForecast] = useState(null);
  const [hourlyForecast,setHourlyForecast] = useState(null);
  const [dataLoading,setDataLoading] = useState(false);
  const [forecastLocation,setForecastLocation] = useState({
    label : "London",
    lat : 51.5085,
    lon : -0.1257,
  });
  const [showResultScreen,setShowResultScreen] = useState();

  // A function to check and find closest time frame from given hourly data
  function filterAndFlagClosestTime(data){
    const currentDate = new Date();

    // Extract keys and values from the provided data
    const entries = Object.entries(data);
    // console.log(entries);
    const todayData = entries.filter(([dateString]) => {
      const date = new Date(dateString); //Converting string to Date
      return (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      ); 
    });
    // console.log(todayData);
    // console.log(typeof todayData[0][0]);//string
    // console.log(typeof new Date(todayData[0][0])) //Date or Object

    // Find the closest time from the current time
    let closestTimeIndex = 0;
    let closestTimeDiff = Math.abs(currentDate - new Date(todayData[0][0]));
    
    todayData.forEach(([dateString],index) => {
      const timeDiff = Math.abs(currentDate - new Date(dateString));
      if (timeDiff < closestTimeDiff) {
        closestTimeDiff = timeDiff;
        closestTimeIndex = index;
      }
    });
    // console.log(closestTimeDiff,closestTimeIndex);
    // Add a flag to the closest time entry
    // const result = todayData.map(([dateString,values],index) => {
    //   return{
    //     date:dateString,
    //     values,
    //     isClosestTime : index === closestTimeIndex,
    //   };
    // });
    const result = todayData.map(([dateString,values],index) => (
      {
        date:dateString,
        values,
        isClosestTime : index === closestTimeIndex,
      }
    ));
    // console.log(result);
    return result;
  }

  // To convert the data into desired format
  function processData(hourly,daily){
    // Convert time to an object array
    function convertTimeToObjectArray(times,values){
      // Early return if no data
      if(!times || !values || !values.weatherCode){
        return {};
      }
      const obj ={}; 
      // Times is an array, so we need to distubute the data inside, into one object according to the time
      times.forEach((time, timeIndex) => {
        // Skip if time is null or undefined
        if(!time) return;
        const weatherProperties = {};
        Object.keys(values).forEach((property) => {
          if(values[property] && values[property][timeIndex] !== undefined){
            weatherProperties[property] = values[property][timeIndex]
          }
        });
        // console.log(weatherProperties);

        const weatherCode = values.weatherCode?.[timeIndex];
        const weatherCondition = weatherCodesMapping[weatherCode]?.label;
        obj[time] ={
          ...weatherProperties,
          weatherCondition,
        };
      });
      // console.log(obj);
      return obj;
    }

    // convertTimeToObjectArray(daily.time, {weatherCode : [] ,temp: [],rainfall :[]})

    const dailyData = convertTimeToObjectArray(daily.time,{
      weatherCode : daily.weatherCode,
      temperature2mMax : daily.temperature2mMax,
      temperature2mMin : daily.temperature2mMin,
      apparentTemperatureMax : daily.apparentTemperatureMax,
      apparentTemperatureMin : daily.apparentTemperatureMin,
      uvIndexMax : daily.uvIndexMax,
      precipitationSum : daily.precipitationSum,
      windSpeed10Max : daily.windSpeed10Max,
      windDirection10mDominant : daily.windDirection10mDominant,
    });

    const hourlyFormatted = convertTimeToObjectArray(hourly.time,{
      temperature2m : hourly.temperature2m,
      visibility : hourly.visibility,
      windDirection10m : hourly.windDirection10m,
      apparentTemperature : hourly.apparentTemperature,
      precipitationSum: hourly.precipitation_probability,
      humidity : hourly.humidity,
      windSpeed : hourly.windSpeed,
      weatherCode : hourly.weatherCode,
      cloudCover : hourly.cloudCover,
      surfacePressure : hourly.surfacePressure,
    });

    const hourlyData = filterAndFlagClosestTime(hourlyFormatted);
    // console.log(hourlyData);
    
    return {hourlyData,dailyData};
  }

  const fetchWeather = async(lat,lon, switchToResultScreen) => {
    const params = {
      latitude : lat ?? 51.5085,
      longitude : lon ?? -0.1257,
      hourly : [
        "temperature_2m",
        "weather_code",
        "visibility",
        "wind_direction_10m",
        "apparent_temperature",
        "precipitation_probability",
        "relative_humidity_2m",
        "wind_speed_10m",
        "cloud_cover",
        "surface_pressure",
      ],
      daily : [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunset",
        "uv_index_max",
        "precipitation_sum",
        "wind_direction_10m_dominant",
        "wind_speed_10m_max",
        "sunrise",
      ],
      timezone : "auto",
    };
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    

    // Helper function to form time ranges
    const range = (start, stop, step) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];
    // console.log(response);

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();

    const hourly = response.hourly();
    const daily = response.daily();

    const weatherData = {
      hourly: {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: hourly.variables(0).valuesArray(),
        weatherCode: hourly.variables(1).valuesArray(),
        visibility: hourly.variables(2).valuesArray(),
        windDirection10m: hourly.variables(3).valuesArray(),
        apparentTemperature: hourly.variables(4).valuesArray(),
        precipitation_probability: hourly.variables(5).valuesArray(),
        humidity: hourly.variables(6).valuesArray(),
        windSpeed: hourly.variables(7).valuesArray(),
        cloudCover : hourly.variables(8).valuesArray(),
        surfacePressure : hourly.variables(9).valuesArray(),
      },
      daily: {
        time: range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).   map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        weatherCode: daily.variables(0).valuesArray(),
        temperature2mMax: daily.variables(1).valuesArray(),
        temperature2mMin: daily.variables(2).valuesArray(),
        apparentTemperatureMax: daily.variables(3).valuesArray(),
        apparentTemperatureMin: daily.variables(4).valuesArray(),
        uvIndexMax: daily.variables(6).valuesArray(),
        precipitationSum: daily.variables(7).valuesArray(),
        windSpeed10Max: daily.variables(8).valuesArray(),
        windDirection10mDominant: daily.variables(9).valuesArray(),
      },
    };
    // console.log(weatherData);
    const {hourlyData,dailyData} = processData(weatherData.hourly,weatherData.daily);
    setHourlyForecast(hourlyData);
    setDailyForecast(dailyData);
    setDataLoading(false);
    // processData(weatherData.hourly,weatherData.daily);

    if(switchToResultScreen){
      setShowResultScreen(true);
    }
  };

  useEffect(()=>{
    setDataLoading(true);
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((
        position =>{
          // Extract latitude and longitude from position object
          const {latitude,longitude} = position.coords;
          fetch(`https://nominatim.openstreetmap.org/reverse.php?lat=${latitude}&lon=${longitude}&zoom=18&format=jsonv2`)
          .then((res) => res.json())
          .then((location) =>{
            console.log(location);
            
            setForecastLocation({label:`${location?.address?.village ?? location?.address?.suburb ?? location?.address?.town ?? location?.address?.city}, ${location?.address?.state}, ${location?.address?.country}`,
            lat:location.lat,
            lon:location.lon});
            fetchWeather(location.lat,location.lon);
          })
        }
        ,
        (error) => {
          console.error('Error getting location:', error.message);
          fetchWeather();
        }
      ));
    }
    else{
      fetchWeather();
    }
  },[]);

  

  const clickHandler = function(searchItem){
    setDataLoading(true);
    setForecastLocation({
      label : searchItem.label,
      lat : searchItem.lat,
      lon : searchItem.lon
    });
    console.log(searchItem.label);
    fetchWeather(searchItem.lat,searchItem.lon,true);
  }

  return (
    <div className='app'>
      <Header resultScreen = {showResultScreen}/>
      {!dataLoading && !showResultScreen &&
      <DefaultScreen currentWeatherData = {
          hourlyForecast?.length
          ? hourlyForecast.filter((hour) => hour.isClosestTime)
          : []
        }
        forecastLocation = {forecastLocation}
        onClickHandler = {clickHandler}
      
      />}
      {showResultScreen && !dataLoading && 
      <SearchResult
        currentWeatherData = {
          hourlyForecast?.length
          ? hourlyForecast.filter((hour) => hour.isClosestTime)
          : []
        }
        forecastLocation = {forecastLocation}
        dailyForecast={dailyForecast}
        hourlyForecast = {hourlyForecast} 
      />}
      <p className="copyright-text">&copy; 2025 WSA. All Rights Reserved</p>
    </div>
  )
}
