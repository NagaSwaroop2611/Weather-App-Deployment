import React from 'react';
import CardLayout from './UI/CardLayout';
import Location from '../assets/images/location.svg';
import Temperature from '../assets/images/temperature.svg';
import Eye from '../assets/images/eye.svg';
import ThermoMini from '../assets/images/temperature-mini.svg';
import Water from '../assets/images/water.svg';
import Windy from '../assets/images/windy.svg';
// import DayForecastCard from './UI/DayForecastCard';
import { weatherCodesMapping } from '../utils';
import moment from 'moment';
import HourlyForecast from './HourlyForecast';
import UnitMetrix from './UnitMetrix';
import SevenDayForecast from './SevenDayForecast';
import TempGraph from './TempGraph';

export default function SearchResult({currentWeatherData,forecastLocation,dailyForecast,hourlyForecast}) {
  console.log(currentWeatherData);
  
  return (
    <div className='search-result-container-div'>
      <p className='forecast-title text-capitalize'>
        {currentWeatherData[0]?.values.weatherCondition}
      </p>
      <CardLayout>
        <div className="flex items-center justify-between">
          <div style={{width : "30%"}}>
            <img src={weatherCodesMapping[currentWeatherData[0]?.values.weatherCode].img} alt="Weather Image" height={48} width={48} />
            <div className="flex items-center">
              <img src={Location} alt="map mark" />
              <p className="city-name">{forecastLocation?.label}</p>
            </div>
            <p className="text-blue" style={{paddingLeft : "30px"}}>
              Today {moment(currentWeatherData[0].date).format("MMM DD")}
            </p>
          </div>
          <div className="temp-container" style={{width : "auto"}}>
            <img src={Temperature} alt="thermometer image" className='thermometer-img' />
            <div>
              <p style={{fontSize : "144px"}}>{parseFloat(currentWeatherData[0]?.values.temperature2m).toFixed(0)}</p>
              <p>{currentWeatherData[0]?.values.weatherCondition}</p>
            </div>
            <p style={{
              fontSize : "24px", 
              alignSelf : "start",
              paddingTop : "45px",
            }}>℃</p>
          </div>
          <div>
            <div style={{display : "flex", alignItems : "center", width : "100%", columnGap : "16px"}}>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Eye} alt="an Eye" />
                  <p className="weather-params-label">Visibility</p>
                </div>
                <p>{Math.floor(currentWeatherData[0]?.values.visibility / 1000)} km</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={ThermoMini} />
                  <p className="weather-params-label">Feels Like</p>
                </div>
                <p>{Math.floor(currentWeatherData[0].values?.apparentTemperature)} ℃</p>
              </div>
            </div>
            <div style={{display : "flex", alignItems : "center", width : "100%", columnGap : "16px",marginTop : "24px"}}>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Water} alt="Water" />
                  <p className="weather-params-label">Humidity</p>
                </div>
                <p>{currentWeatherData[0].values?.humidity} %</p>
              </div>
              <p>|</p>
              <div className="weather-info-subtitle">
                <div className="flex">
                  <img src={Windy} />
                  <p className="weather-params-label">Wind</p>
                </div>
                <p>{Math.floor(currentWeatherData[0].values?.windSpeed)} km/h</p>
              </div>
            </div>
          </div>
        </div>
      </CardLayout>

      <div 
        className='flex justify-between'
        style={{marginTop : "24px"}}
      >
        <HourlyForecast hourlyData = {hourlyForecast} />
      </div>
      <div className='flex items-center' style={{columnGap : "20px"}}>
        <div className="current-time-metrix">
          <CardLayout className="unit-metrix-card-layout">
            <div className='unit-metrix-container' style={{marginTop : "0px"}}>
              <UnitMetrix
                label = "Temperature"
                value = {Math.floor(currentWeatherData[0]?.values.temperature2m)}
                unit ="℃"
              />
              <UnitMetrix
                label = "Wind"
                value = {Math.floor(currentWeatherData[0]?.values.windSpeed)}
                unit ="km/h"
              />
            </div>
            <div className='unit-metrix-container' >
              <UnitMetrix
                label = "Humidity"
                value = {Math.floor(currentWeatherData[0]?.values.humidity)}
                unit ="%"
              />
              <UnitMetrix
                label = "Visibility"
                value = {Math.floor(currentWeatherData[0]?.values.visibility/1000)}
                unit ="km"
              />
            </div>
            <div className='unit-metrix-container' >
              <UnitMetrix
                label = "Feels Like"
                value = {Math.floor(currentWeatherData[0]?.values.apparentTemperature)}
                unit ="℃"
              />
              <UnitMetrix
                label = "Chance of Rain"
                value = {Math.floor(currentWeatherData[0]?.values.precipitationSum)}
                unit ="mm"
              />
            </div>
            <div className='unit-metrix-container' >
              <UnitMetrix
                label = "Pressure"
                value = {Math.floor(currentWeatherData[0]?.values.surfacePressure)}
                unit ="hpa"
              />
              <UnitMetrix
                label = "Cloud Cover"
                value = {Math.floor(currentWeatherData[0]?.values.cloudCover)}
                unit ="%"
              />
            </div>
          </CardLayout>
        </div>
        <SevenDayForecast dailyForecast = {dailyForecast}/>
      </div>
      <TempGraph hourlyData = {hourlyForecast} />
    </div>
  );
}
