import React, { useEffect, useState } from 'react';
import CardLayout from './UI/CardLayout';
import Sun from '../assets/images/sun.svg';
import Temperature from '../assets/images/temperature.svg';
import Eye from '../assets/images/eye.svg';
import ThermoMini from '../assets/images/temperature-mini.svg';
import Water from '../assets/images/water.svg';
import Windy from '../assets/images/windy.svg';
import Cloud from '../assets/images/cloud.svg';
import Search from '../assets/images/search.svg';
import { weatherCodesMapping } from '../utils';
import moment from "moment";

export default function DefaultScreen({currentWeatherData,forecastLocation,onClickHandler}) {
  // console.log(currentWeatherData);
  const [searchCityText , setSearchCityText] = useState("");
  const [suggestions , setSuggestions] = useState("")

  const fetchSuggestions = async function (label) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${label}&format=json&addressdetails=1`);
    const datas = await response.json();

    const tempSuggestions = [];
    datas.forEach(data => {
      tempSuggestions.push({
        label : `${data?.address?.village  
          ?? data?.address?.suburb 
          ?? data?.address?.town 
          ?? data?.address?.city
        }, ${data?.address?.state}, ${data?.address?.country}`,
        // label : `${data?.display_name}`,
        lat : data.lat,
        lon : data.lon,
      });
    });
    // console.log(tempSuggestions);
    setSuggestions(tempSuggestions)
  };
  // console.log(suggestions);
  

  useEffect(()=>{
    const timeoutId = setTimeout(()=>{
      fetchSuggestions(searchCityText);
    },300);
    return () =>{
      clearTimeout(timeoutId);
    };
  }, [searchCityText]);
  
  return (
    <div className='home-main-div'>
      <div className="default-home-container">
        <CardLayout>
          {currentWeatherData?.length && currentWeatherData[0] && (
            <>
              {/* Place,Sunny,Day and Date */}
              <div className="default-card-city">
                <img src={weatherCodesMapping[currentWeatherData[0]?.values?.weatherCode].img} alt="Sunny" />
                <div>
                  <p className="city-name">{forecastLocation?.label}</p>
                  <p className='date-today'>{moment(currentWeatherData[0].date).format("ddd DD/MM/YYYY")}</p>
                </div>
              </div>
              {/* Temperature Container */}
              <div className="temp-container">
                <img src={Temperature} alt="Therometer Image" className='thermometer-img' />
                <div>
                  <p style={{fontSize : "144px"}}>{parseFloat(currentWeatherData[0].values?.temperature2m).toFixed(0)}</p>
                  <p className="text-capitalize">{currentWeatherData[0].values?.weatherCondition}</p>
                </div>
                <p 
                  style={{
                    fontSize : "24px",
                    alignSelf : "start",
                    marginTop : "45px",
                    }}
                >℃</p>
              </div>
              {/* Visiblity and feels like */}
              <div style={{
                display:"flex",
                alignItems : "center",
                marginTop : "60px",
                width : "100%",
                columnGap : "16px"
              }}>
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={Eye} />
                    <p className="weather-params-label">Visibility</p>
                  </div>
                  <p>{Math.floor(
                      currentWeatherData[0].values?.visibility/1000
                    )} km</p>
                </div>
                <p>|</p>
                <div className="weather-info-subtitle">
                  <div className="flex">
                    <img src={ThermoMini} />
                    <p className="weather-params-label">Feels Like</p>
                  </div>
                  <p>{Math.floor(currentWeatherData[0].values?.apparentTemperature)} °C</p>
                </div>
              </div>

            {/* Humidity and Wind */}
              <div style={{
              display:"flex",
              alignItems : "center",
              marginTop : "24px",
              width : "100%",
              columnGap : "16px"
            }}>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} alt="" />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{currentWeatherData[0].values?.humidity} %</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Windy}/>
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>{Math.floor(currentWeatherData[0]?.values?.windSpeed)} km/h</p>
              </div>
            </div>
            </>
          )}
        </CardLayout>

        {/* Search Card Layout */}
        <CardLayout>
          <div className="search-card">
            {/* Cloud Image */}
            <div className="flex justify-center">
              <img src={Cloud} alt="Cloud Image" />
            </div>
            {/* Search icon and input tag */}
            <div className="search-city-container city-results">
              <img src={Search} />
              <input  
                type="text"
                className='city-input'
                placeholder='Search City'
                value={searchCityText}
                onChange={(e) => setSearchCityText(e.target.value) } 
              />
            </div>

            {/* Suggestions */}
            <div className="search-city-suggestions">
             {suggestions?.length > 0 &&
                suggestions.map((suggestionItem, suggestionIndex) =>{
                  if(suggestionIndex < 4){
                    return(
                      <p
                        className="suggested-label" key={suggestionIndex}
                        onClick={() => onClickHandler(suggestionItem)}
                      >
                        {suggestionItem.label}
                      </p>
                    )
                  }
                }
              )}

            </div>
          </div>
        </CardLayout>
      </div>
    </div>

  )
}
