import React, { useState } from 'react';

const Form = () => {
    const [year, setYear] = useState('');
    const [make, setMake] = useState('');
    const [model, setModel] = useState('');
    const [freightDescription, setFreightDescription] = useState('');
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [originZip, setOriginZip] = useState('');
    const [destinationZip, setDestinationZip] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');
        console.log({
            year,
            make,
            model,
            freightDescription,
            length,
            width,
            height,
            weight,
            originZip,
            destinationZip,
            name,
            email,
            phone,
        });
    };

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-4 w-full">
            <p className="text-stone-100 text-center text-md text-nowrap w-full font-medium my-2">Fill out the form below to get an instant quote</p>
            <div className="grid grid-cols-3 gap-2">
                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border p-2 rounded-md"
                />
                <input
                    type="text"
                    placeholder="Make"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="text"
                    placeholder="Model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="border p-2"
                />
            </div>
            <span className="flex gap-1 items-center justify-center my-3 h-full w-full "><span className="border-b border-stone-100 w-full"></span><span className="text-stone-50">Or</span><span className="border-b border-stone-100 w-full"></span></span>
            <div className="grid grid-cols-1 gap-4">
                <input
                    type="text"
                    placeholder="Freight Description"
                    value={freightDescription}
                    onChange={(e) => setFreightDescription(e.target.value)}
                    className="border p-2"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
                <input
                    type="text"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="border  max-w-max p-2"
                />
                <input
                    type="text"
                    placeholder="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="border  max-w-max p-2"
                />
                <input
                    type="text"
                    placeholder="Height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="border max-w-max p-2"
                />
                <input
                    type="text"
                    placeholder="Weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="border p-2"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Origin Zip Code"
                    value={originZip}
                    onChange={(e) => setOriginZip(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="text"
                    placeholder="Destination Zip Code"
                    value={destinationZip}
                    onChange={(e) => setDestinationZip(e.target.value)}
                    className="border p-2"
                />
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-3 gap-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2"
                />
                {emailError && <p className="text-red-500">{emailError}</p>}
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="border p-2"
                />
            </div>
            <button type="submit" className="bg-amber-400 shadow-lg text-md font-semibold text-gray-900 border border-gray-900 self-center w-full p-2 rounded">
                Submit
            </button>
        </form>
    );
};

export default Form;