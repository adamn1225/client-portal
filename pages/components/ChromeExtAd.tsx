// section to advertise my chrome extension
import React from 'react';

const ChromeExtAd = () => {
  return (
    <section id="features" className="py-20 lg:py-25 my-6 xl:py-30 bg-gray-900 w-full">
      <div className="flex flex-col justify-center items-center h-full w-full">
        <h2 className='font-semibold text-xl text-stone-50'>Chrome Extension</h2>
        <div> <p className='text-lg text-stone-50 mb-2'>Check out our Chrome Extension that helps you get quotes the fast and easy way!</p></div>
            <a href="https://chromewebstore.google.com/detail/heavy-construct-haul-quot/djkcedopkcchigdndheegekipgnncbbo?authuser=0&hl=en" className="dark-light-btn chrome-ext-link">Get it here</a>
      </div>
    </section>
    );
}

export default ChromeExtAd;