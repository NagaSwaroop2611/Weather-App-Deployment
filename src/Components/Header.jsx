import React from 'react';
import wsaLogo from '../assets/images/wsa-logo.svg';

export default function Header({resultScreen}) {
  // console.log(resultScreen);
  
  return (
    <div className='header'>
      <img src={wsaLogo} width={183} height={63}/>
            {/* Condtionally appeding a className */}
            <p className={`header-text ${resultScreen ? "header-blue" : ""}`}>WEATHER</p>
    </div>
  );
}
