import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/initSupabase';
import { Database } from '@/lib/database.types';

type ChromeQuote = Database['public']['Tables']['chrome_quotes']['Row'];

const AdminChromeQuoteRequests = () => {
    const [quotes, setQuotes] = useState<ChromeQuote[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [quoteValue, setQuoteValue] = useState<string>('');

    const fetchQuotes = async () => {
        const { data, error } = await supabase
            .from('chrome_quotes')
            .select('*');

        if (error) {
            setErrorText('Error fetching quotes');
        } else {
            setQuotes(data);
        }
    };

    useEffect(() => {
        fetchQuotes();
    }, []);

    const handleQuoteUpdate = async (id: number) => {
        const { error } = await supabase
            .from('chrome_quotes')
            .update({ quote: parseFloat(quoteValue) })
            .eq('id', id);

        if (error) {
            setErrorText('Error updating quote');
        } else {
            setQuotes(quotes.map(quote => quote.id === id ? { ...quote, quote: parseFloat(quoteValue) } : quote));
            setQuoteValue('');
        }
    };

    return (
        <div className="admin-quote-requests">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <h2 className="text-xl text-center">Chrome Extension Quotes</h2>
            <ul>
                {quotes.map((quote) => (
                    <li key={quote.id} className="p-4 border-b">
                        <p>{quote.freightdescription}</p>
                        <p>{quote.originzip} to {quote.destinationzip}</p>
                        <p>{quote.email}</p>
                        <p>Current Quote: {quote.quote ? `$${quote.quote}` : 'Not quoted yet'}</p>
                        <input
                            type="number"
                            value={quoteValue}
                            onChange={(e) => setQuoteValue(e.target.value)}
                            placeholder="Enter quote"
                            className="border p-2"
                        />
                        <button onClick={() => handleQuoteUpdate(quote.id)} className="ml-2 p-2 bg-blue-500 text-white">
                            Update Quote
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminChromeQuoteRequests;