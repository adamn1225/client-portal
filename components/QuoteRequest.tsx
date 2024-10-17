import React, { useState, useEffect } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface QuoteRequestProps {
    session: Session | null;
}

type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];

const QuoteRequest = ({ session }: QuoteRequestProps) => {
    const supabase = useSupabaseClient<Database>();
    const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [yearAmount, setYearAmount] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [palletCount, setPalletCount] = useState<string>('');
    const [commodity, setCommodity] = useState<string>('');
    const [originCity, setOriginCity] = useState<string>('');
    const [originState, setOriginState] = useState<string>('');
    const [originZip, setOriginZip] = useState<string>('');
    const [destinationCity, setDestinationCity] = useState<string>('');
    const [destinationState, setDestinationState] = useState<string>('');
    const [destinationZip, setDestinationZip] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');

    useEffect(() => {
        if (session?.user?.id) {
            fetchQuotes();
        }
    }, [session]);

    const fetchQuotes = async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('shippingquotes')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) {
            setErrorText(error.message);
        } else {
            setQuotes(data);
        }
    };

    const addQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('shippingquotes')
            .insert([{
                user_id: session.user.id,
                due_date: dueDate,
                origin_city: originCity,
                origin_state: originState,
                origin_zip: originZip,
                destination_city: destinationCity,
                destination_state: destinationState,
                destination_zip: destinationZip,
                year_amount: yearAmount,
                make: make,
                model: model,
                pallet_count: palletCount,
                commodity: commodity
            }])
            .select();

        if (error) {
            console.error('Error adding quote:', error.message);
            setErrorText('Error adding quote');
        } else {
            setQuotes([...quotes, ...(data || [])]);
            setYearAmount('');
            setMake('');
            setModel('');
            setPalletCount('');
            setCommodity('');
            setOriginCity('');
            setOriginState('');
            setOriginZip('');
            setDestinationCity('');
            setDestinationState('');
            setDestinationZip('');
            setDueDate('');
            setErrorText('');
        }
    };

    const deleteQuote = async (id: number) => {
        if (!session?.user?.id) return;

        const { error } = await supabase
            .from('shippingquotes')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting quote:', error.message);
        } else {
            fetchQuotes();
        }
    };

    return (
        <div className="w-full grid grid-cols-2 gap-12">
            <div className="w-full">
                <h1 className="mb-12 text-2xl">Request a Shipping Quote</h1>
                <h3>Provide details about your freight and request a quote.</h3>
                <form onSubmit={addQuote} className="flex flex-col w-full gap-2 my-2">
                    <div className='flex flex-col gap-4 w-full'>
                        <label className='text-slate-900 font-medium'>Select Option
                            <select
                                className="rounded w-full p-2 border border-slate-900"
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
                            <div className='flex gap-2 w-full'>
                                <label className='text-slate-900 font-medium'>Year/Amount
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
                                        type="text"
                                        value={yearAmount}
                                        onChange={(e) => {
                                            setErrorText('');
                                            setYearAmount(e.target.value);
                                        }}
                                    />
                                </label>
                                <label className='text-slate-900 font-medium'>Make
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
                                        type="text"
                                        value={make}
                                        onChange={(e) => {
                                            setErrorText('');
                                            setMake(e.target.value);
                                        }}
                                    />
                                </label>
                                <label className='text-slate-900 font-medium'>Model
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
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
                            <div className='flex gap-2 w-full'>
                                <label className='text-slate-900 font-medium'>Pallet/Crate Count
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
                                        type="text"
                                        value={palletCount}
                                        onChange={(e) => {
                                            setErrorText('');
                                            setPalletCount(e.target.value);
                                        }}
                                    />
                                </label>
                                <label className='text-slate-900 font-medium'>Commodity
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
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

                        <div className='flex gap-2'>
                            <label className='text-slate-900 font-medium'>Origin City
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={originCity}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setOriginCity(e.target.value);
                                    }}
                                />
                            </label>
                            <label className='text-slate-900 font-medium'>Origin State
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={originState}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setOriginState(e.target.value);
                                    }}
                                />
                            </label>
                            <label className='text-slate-900 font-medium'>Origin Zip
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={originZip}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setOriginZip(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        <div className='flex gap-2'>
                            <label className='text-slate-900 font-medium'>Destination City
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={destinationCity}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setDestinationCity(e.target.value);
                                    }}
                                />
                            </label>
                            <label className='text-slate-900 font-medium'>Destination State
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={destinationState}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setDestinationState(e.target.value);
                                    }}
                                />
                            </label>
                            <label className='text-slate-900 font-medium'>Destination Zip
                                <input
                                    className="rounded w-full p-2 border border-slate-900"
                                    type="text"
                                    value={destinationZip}
                                    onChange={(e) => {
                                        setErrorText('');
                                        setDestinationZip(e.target.value);
                                    }}
                                />
                            </label>
                        </div>
                        <label className='text-slate-900 font-medium'>Shipping Date
                            <input
                                className="rounded w-full p-2 border border-slate-900"
                                type="date"
                                value={dueDate}
                                onChange={(e) => {
                                    setErrorText('');
                                    setDueDate(e.target.value);
                                }}
                            />
                        </label>
                    </div>
                    <button className="btn-slate" type="submit">
                        Request Quote
                    </button>
                </form>
                {!!errorText && <div className="text-red-500">{errorText}</div>}
            </div>
            <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-screen overflow-y-auto flex-grow">
                <ul className="flex flex-col h-full">
                    {quotes.map((quote, index) => (
                        <li
                            key={quote.id}
                            className={`border-b border-slate-400 ${index === quotes.length - 1 ? '' : 'border-b'}`}
                        >
                            <div className="flex items-center p-4">
                                <div className="flex-grow">
                                    {quote.origin_city} to {quote.destination_city}
                                </div>
                                <div>(Due: {quote.due_date || 'No due date'})</div>
                                <button onClick={() => deleteQuote(quote.id)} className="text-red-500">
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuoteRequest;