import React from 'react';


const AcmeLogo: React.FC = () => (
    <svg width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#000" />
    </svg>
);

export const Trusted = () => {
    return (
        <>
        
                <h2 className="text-center text-3xl font-bold mb-4">Trusted by over 10000+ customers</h2>
                <p className="text-gray-600 max-w-2xl text-center text-lg mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <span className="font-semibold text-lg ml-2">Company {index + 1}</span>
                        </div>
                    ))}
                </div>
            <hr className="absolute inset-0 left-0 mt-5" />
        </>
    );
};