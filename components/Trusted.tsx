import React from 'react';

const Flex = ({ children, direction, align, justify, className }) => (
    <div
        className={`flex ${direction} ${align} ${justify} ${className}`}
    >
        {children}
    </div>
);

const AcmeLogo = () => (
    <svg width="40" height="40" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#000" />
    </svg>
);

export const Trusted = () => {
    return (
        <>
            <Flex
                direction="flex-col"
                align="items-center"
                justify="justify-center"
                className="pt-20 px-6 md:px-64"
            >
                <h2 className="text-center text-3xl font-bold mb-4">Trusted by over 10000+ customers</h2>
                <p className="text-gray-600 max-w-2xl text-center text-lg mb-8">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <AcmeLogo />
                            <span className="font-semibold text-lg ml-2">Company {index + 1}</span>
                        </div>
                    ))}
                </div>
            </Flex>

            <hr className="absolute inset-0 left-0 mt-5" />
        </>
    );
};