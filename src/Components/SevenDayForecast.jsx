import React from 'react'
import CardLayout from './UI/CardLayout'
import moment from 'moment'
import { weatherCodesMapping } from '../utils'

export default function SevenDayForecast({dailyForecast}) {
  console.log(dailyForecast);
  
  return (
    <CardLayout className = {`seven-day-forecast-card-layout`}>
      <p className='label-18'>7 DAY FORECAST</p>
      {Object.keys(dailyForecast)?.length > 0 &&
       Object.keys(dailyForecast).map((day,dayIndex) => {
        return(
          <DayForecast
           key = {dayIndex} 
           dayData = {dailyForecast[day]} 
           day = {day}
           lastDay = {dayIndex === 6 ? true :false}
          />
        )
       })  
      }
    </CardLayout>
  )
}

function DayForecast({dayData,day,lastDay}){
  return(
    <div className={`flex items-center single-day justify-between ${lastDay ? "border-0" : ""}`}>
      <p style={{width : "27%"}}>{moment(day).format("dddd")}</p>
      <img
      src={weatherCodesMapping[dayData.weatherCode].img} alt="weather data" 
      width={48} 
      height={48} 
      />
      <div
        style={{width : "62%", marginLeft : "12px"}}
        className='flex items-center justify-between'
      >
        <p className="capitalize">{dayData.weatherCondition}</p>
        <p>
          {Math.floor(dayData.temperature2mMin)}-{Math.floor(dayData.temperature2mMax)}℃
        </p>
      </div>
    </div>
  )
}
