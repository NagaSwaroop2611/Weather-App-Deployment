import moment from 'moment'
import React from 'react'
import { weatherCodesMapping } from '../utils'
import ArrowLeft from '../assets/images/arrow-left.svg';
import ArrowRight from '../assets/images/arrow-right.svg';
import ArrowStraight  from '../assets/images/arrow-straight.svg';
import verticalLine from '../assets/images/vartical-line.svg'

export default function HourComp({currentTime,data}) {
  return (
    <>
      <div className={`hour-comp-main-div ${currentTime ? "time-highlight" : ""}`}>
        <p className='label-18'>
          {currentTime ? "Now" : moment(data.date).format("HH:MM")}
        </p>
        <img 
          src={weatherCodesMapping[data?.values.weatherCode].img}
          width={48}
          height={48}
        />
        <p className='label-18'>{Math.floor(data?.values?.temperature2m)} ℃</p>
        <img src={
          Math.floor(data?.values?.windDirection10m) < 90 ||
          Math.floor(data?.values?.windDirection10m) > 270 ? ArrowRight :
          Math.floor(data?.values?.windDirection10m) > 90 ||
          Math.floor(data?.values?.windDirection10m) < 270  
          ? ArrowLeft
          : ArrowStraight
        } alt="" />
        <p className='label-18'>
          {Math.floor(data?.values?.windSpeed)} km/h
        </p>
      </div>
      <img src={verticalLine} />
    </>
  )
}
