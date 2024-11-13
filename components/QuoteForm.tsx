import React, { useState } from 'react';
import { Database } from '@/lib/database.types';
import Modal from './Modal';

interface QuoteFormProps {
    freightList: Database['public']['Tables']['freight']['Row'][];
    addQuote: (quote: Partial<Database['public']['Tables']['shippingquotes']['Insert']>) => Promise<void>;
    errorText: string;
    setErrorText: React.Dispatch<React.SetStateAction<string>>;
    isOpen: boolean;
    onClose: () => void;
}

const QuoteForm: React.FC<QuoteFormProps> = ({ freightList, addQuote, errorText, setErrorText, isOpen, onClose }) => {
    const [selectedFreight, setSelectedFreight] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [yearAmount, setYearAmount] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [palletCount, setPalletCount] = useState<string>('');
    const [commodity, setCommodity] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');
    const [originZip, setOriginZip] = useState<string>('');
    const [destinationZip, setDestinationZip] = useState<string>('');
    const [originCity, setOriginCity] = useState<string>('');
    const [originState, setOriginState] = useState<string>('');
    const [destinationCity, setDestinationCity] = useState<string>('');
    const [destinationState, setDestinationState] = useState<string>('');
    const [dueDate, setDueDate] = useState<string | null>(null); // Ensure dueDate is either a valid timestamp or null
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleFreightChange = (freightId: string) => {
        setSelectedFreight(freightId);
        const selected = freightList.find(freight => freight.id === parseInt(freightId));
        if (selected) {
            setYearAmount(selected.year || '');
            setMake(selected.make || '');
            setModel(selected.model || '');
            setPalletCount(selected.pallet_count || '');
            setCommodity(selected.commodity || '');
            setLength(selected.length || '');
            setWidth(selected.width || '');
            setHeight(selected.height || '');
            setWeight(selected.weight || '');
            setSelectedOption(selected.freight_type || '');
        } else {
            setYearAmount('');
            setMake('');
            setModel('');
            setPalletCount('');
            setCommodity('');
            setLength('');
            setWidth('');
            setHeight('');
            setWeight('');
            setSelectedOption('');
        }
    };

    const lookupZipCode = async (type: 'origin' | 'destination') => {
        const zipCode = type === 'origin' ? originZip : destinationZip;
        const url = `https://api.zippopotam.us/us/${zipCode}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const city = data.places[0]['place name'];
            const state = data.places[0]['state'];
            if (type === 'origin') {
                setOriginCity(city);
                setOriginState(state);
            } else {
                setDestinationCity(city);
                setDestinationState(state);
            }
        } catch (error) {
            console.error(`Error fetching ${type} zip code data:`, error);
        }
    };

    const handleZipCodeBlur = (type: 'origin' | 'destination') => {
        lookupZipCode(type);
    };

    const handleZipCodeKeyDown = (e: React.KeyboardEvent, type: 'origin' | 'destination') => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            lookupZipCode(type);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const quote = {
            first_name: '',
            last_name: '',
            email: '',
            due_date: dueDate || null, // Ensure due_date is either a valid timestamp or null
            origin_city: originCity,
            origin_state: originState,
            origin_zip: originZip,
            destination_city: destinationCity,
            destination_state: destinationState,
            destination_zip: destinationZip,
            year_amount: yearAmount,
            make: make,
            model: model,
            pallet_count: selectedOption === 'equipment' ? '' : palletCount,
            commodity: selectedOption === 'equipment' ? '' : commodity,
            length: length,
            width: width,
            height: height,
            weight: weight,
        };
        await addQuote(quote);
        onClose(); // Close the modal after submitting the form
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 dark:bg-zinc-800 dark:text-zinc-100">
                <div className='flex flex-col gap-4 w-full dark:text-zinc-100'>
                    <label className='text-zinc-900 dark:text-zinc-100 font-medium '>Select Freight (Optional)
                        <select
                            className="rounded dark:text-zinc-800  w-full p-2 border  border-zinc-800"
                            value={selectedFreight}
                            onChange={(e) => handleFreightChange(e.target.value)}
                        >
                            <option value="">Select...</option>
                            {freightList.map((freight) => (
                                <option key={freight.id} value={freight.id.toString()}>
                                    {freight.freight_type === 'ltl_ftl' ? freight.commodity : `${freight.make} ${freight.model} (${freight.year})`}
                                </option>
                            ))}
                        </select>
                    </label>

                    {!selectedFreight && (
                        <>
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Select Option
                                <select
                                    className="rounded w-full dark:text-zinc-800 p-2 border border-zinc-900"
                                    value={selectedOption}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setSelectedOption(e.target.value);
                                    }}
                                >
                                    <option value="">Select...</option>
                                    <option value="equipment">Equipment/Machinery</option>
                                    <option value="ltl_ftl">LTL/FTL</option>
                                </select>
                            </label>

                            {selectedOption === 'equipment' && (
                                <div className='flex gap-2 dark:text-zinc-100 w-full'>
                                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Year/Amount
                                        <input
                                            className="rounded dark:text-zinc-800 w-full  p-2 border border-zinc-900"
                                            type="text"
                                            value={yearAmount}
                                            onChange={(e) => {
                                                setErrorText('');
                                                setYearAmount(e.target.value);
                                            }}
                                        />
                                    </label>
                                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Make
                                        <input
                                            className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                            type="text"
                                            value={make}
                                            onChange={(e) => {
                                                setErrorText('');
                                                setMake(e.target.value);
                                            }}
                                        />
                                    </label>
                                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Model
                                        <input
                                            className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                            type="text"
                                            value={model}
                                            onChange={(e) => {
                                                setErrorText('');
                                                setModel(e.target.value);
                                            }}
                                        />
                                    </label>
                                </div>
                            )}

                            {selectedOption === 'ltl_ftl' && (
                                <div className='flex items-center justify-center gap-2 w-full'>
                                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Pallet/Crate Count
                                        <input
                                            className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                            type="text"
                                            value={palletCount}
                                            onChange={(e) => {
                                                setErrorText('');
                                                setPalletCount(e.target.value);
                                            }}
                                        />
                                    </label>
                                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Commodity
                                        <input
                                            className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                            type="text"
                                            value={commodity}
                                            onChange={(e) => {
                                                setErrorText('');
                                                setCommodity(e.target.value);
                                            }}
                                        />
                                    </label>
                                </div>
                            )}
                        </>
                    )}

                    <div className='flex gap-2'>
                        {yearAmount && (
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Year/Amount
                                <input
                                    className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                    type="text"
                                    value={yearAmount}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setYearAmount(e.target.value);
                                    }}
                                />
                            </label>
                        )}
                        {make && (
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Make
                                <input
                                    className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                    type="text"
                                    value={make}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setMake(e.target.value);
                                    }}
                                />
                            </label>
                        )}
                        {model && (
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Model
                                <input
                                    className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                    type="text"
                                    value={model}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setModel(e.target.value);
                                    }}
                                />
                            </label>
                        )}
                    </div>
                    <div className='flex w-full justify-evenly items-center self-center'>
                        {palletCount && (
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Pallet/Crate Count
                                <input
                                    className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                    type="text"
                                    value={palletCount}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setPalletCount(e.target.value);
                                    }}
                                />
                            </label>
                        )}
                        {commodity && (
                            <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Commodity
                                <input
                                    className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                    type="text"
                                    value={commodity}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setCommodity(e.target.value);
                                    }}
                                />
                            </label>
                        )}
                    </div>
                    {length && (
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Length
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={length}
                                onChange={(e) => {
                                    setErrorText('');
                                    setLength(e.target.value);
                                }}
                            />
                        </label>
                    )}
                    {width && (
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Width
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={width}
                                onChange={(e) => {
                                    setErrorText('');
                                    setWidth(e.target.value);
                                }}
                            />
                        </label>
                    )}
                    {height && (
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Height
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={height}
                                onChange={(e) => {
                                    setErrorText('');
                                    setHeight(e.target.value);
                                }}
                            />
                        </label>
                    )}
                    {weight && (
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Weight
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={weight}
                                onChange={(e) => {
                                    setErrorText('');
                                    setWeight(e.target.value);
                                }}
                            />
                        </label>
                    )}

                    <div className='flex gap-2'>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Origin Zip
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={originZip}
                                onChange={(e) => setOriginZip(e.target.value)}
                                onBlur={() => handleZipCodeBlur('origin')}
                                onKeyDown={(e) => handleZipCodeKeyDown(e, 'origin')}
                            />
                        </label>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Origin City
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={originCity}
                                readOnly
                            />
                        </label>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Origin State
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={originState}
                                readOnly
                            />
                        </label>

                    </div>

                    <div className='flex gap-2'>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Destination Zip
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={destinationZip}
                                onChange={(e) => setDestinationZip(e.target.value)}
                                onBlur={() => handleZipCodeBlur('destination')}
                                onKeyDown={(e) => handleZipCodeKeyDown(e, 'destination')}
                            />
                        </label>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Destination City
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={destinationCity}
                                readOnly
                            />
                        </label>
                        <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Destination State
                            <input
                                className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                                type="text"
                                value={destinationState}
                                readOnly
                            />
                        </label>

                    </div>
                    <label className='text-zinc-900 dark:text-zinc-100 font-medium'>Shipping Date
                        <input
                            className="rounded dark:text-zinc-800 w-full p-2 border border-zinc-900"
                            type="date"
                            value={dueDate || ''} // Ensure dueDate is either a valid timestamp or an empty string
                            onChange={(e) => {
                                setErrorText('');
                                setDueDate(e.target.value || null); // Set dueDate to null if the input is empty
                            }}
                        />
                    </label>
                </div>
                <button className="btn-slate dark:hover:bg-amber-400 dark:hover:text-zinc-800" type="submit">
                    Request Quote
                </button>
                <button type="button" className="bg-stone-300  text-zinc-800 py-2 px-4 font-semibold mt-2 hover:bg-stone-300/50 hover:text-zinc-700" onClick={onClose}>
                    Close
                </button>
                {errorText && <p className="text-red-500">{errorText}</p>}
            </form>
        </Modal>
    );
};

export default QuoteForm;