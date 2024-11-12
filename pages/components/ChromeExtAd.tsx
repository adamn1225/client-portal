// section to advertise my chrome extension
import React from 'react';

const ChromeExtAd = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full pb-20">
      <h2 className='font-semibold text-xl text-gray-900'>Chrome Extension</h2>
     <div> <p className='text-lg text-gray-900 mb-2'>Check out our Chrome Extension that helps you get quotes the fast and easy way!</p></div>
          <a href="https://chromewebstore.google.com/detail/heavy-construct-haul-quot/djkcedopkcchigdndheegekipgnncbbo?authuser=0&hl=en" className="dark-light-btn chrome-ext-link">Get it here</a>
    </div>
    );
}

export default ChromeExtAd;