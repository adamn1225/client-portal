import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/initSupabase'; // Adjust the import path as needed
import { Quote } from '@/lib/types'; // Adjust the import path as needed

const AdminQuoteRequests = () => {
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [price, setPrice] = useState<string>(''); // Update state to reflect price
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [errorText, setErrorText] = useState<string>('');

    useEffect(() => {
        const fetchQuotes = async () => {
            const { data, error } = await supabase
                .from('shippingquotes')
                .select('*')
                .eq('is_archived', false); // Fetch only non-archived quotes

            if (error) {
                console.error('Error fetching quotes:', error.message);
                setErrorText('Error fetching quotes');
            } else {
                console.log('Fetched Quotes:', data); // Debugging log
                setQuotes(data);
                setFilteredQuotes(data); // Initially, show all quotes
            }
        };

        fetchQuotes();
    }, []);

    const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = e.target.value;
        setSelectedUser(userId);
        if (userId === '') {
            setFilteredQuotes(quotes); // Show all quotes if no user is selected
        } else {
            setFilteredQuotes(quotes.filter(quote => quote.user_id === userId));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(e.target.value);
    };

    const handleQuoteUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedQuoteId === null) return;

        const { error } = await supabase
            .from('shippingquotes')
            .update({ price: parseFloat(price) } as Partial<Quote>) // Update price instead of quote_id
            .eq('id', selectedQuoteId);

        if (error) {
            console.error('Error updating quote:', error.message);
            setErrorText('Error updating quote');
        } else {
            setQuotes(quotes.map(quote =>
                quote.id === selectedQuoteId ? { ...quote, price: parseFloat(price) } : quote
            ));
            setFilteredQuotes(filteredQuotes.map(quote =>
                quote.id === selectedQuoteId ? { ...quote, price: parseFloat(price) } : quote
            ));
            setPrice('');
            setSelectedQuoteId(null);
            setErrorText('');
        }
    };

    const handleSelectQuote = (id: number) => {
        setSelectedQuoteId(id);
    };

    const archiveQuote = async (id: number) => {
        const { error } = await supabase
            .from('shippingquotes')
            .update({ is_archived: true } as Partial<Quote>) // Mark the quote as archived
            .eq('id', id);

        if (error) {
            console.error('Error archiving quote:', error.message);
            setErrorText('Error archiving quote');
        } else {
            setQuotes(quotes.filter(quote => quote.id !== id));
            setFilteredQuotes(filteredQuotes.filter(quote => quote.id !== id));
        }
    };

    // Extract unique users from quotes
    const uniqueUsers = quotes.reduce((acc: { user_id: string; first_name: string | null; last_name: string | null; email: string | null }[], quote) => {
        if (!acc.some(user => user.user_id === quote.user_id)) {
            acc.push({
                user_id: quote.user_id,
                first_name: quote.first_name,
                last_name: quote.last_name,
                email: quote.email,
            });
        }
        return acc;
    }, []);

    console.log('Unique Users:', uniqueUsers); // Debugging log

    return (
        <div className="admin-quote-requests">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="mb-4">
                <label htmlFor="user-select" className="block mb-2">Select User:</label>
                <select
                    id="user-select"
                    value={selectedUser}
                    onChange={handleUserChange}
                    className="w-full text-gray-900 p-2 border rounded"
                >
                    <option value="">All Users</option>
                    {uniqueUsers.map((user, index) => (
                        <option key={`${user.user_id}-${index}`} value={user.user_id}>
                            {user.first_name} {user.last_name} ({user.email})
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-screen overflow-y-auto flex-grow">
                <ul className="flex flex-col h-full">
                    {filteredQuotes.map((quote, index) => (
                        <li
                            key={quote.id}
                            className={`border-b border-slate-400 ${index === filteredQuotes.length - 1 ? '' : 'border-b'}`}
                        >
                            <div className="flex items-center p-4">
                                <div className="flex-grow">
                                    {quote.origin_city}, {quote.origin_zip} to {quote.destination_city}, {quote.destination_zip}
                                </div>
                                <div>{quote.year_amount} {quote.make} {quote.model}</div>
                                <div>(Due: {quote.due_date || 'No due date'})</div>
                                <div>{quote.first_name} {quote.last_name} ({quote.email})</div>
                                <div>Quote ID: {quote.quote_id || 'Not assigned'}</div>
                                <div>Price: ${quote.price}</div>
                                <button onClick={() => handleSelectQuote(quote.id)} className="text-blue-500">
                                    Respond
                                </button>
                                <button onClick={() => archiveQuote(quote.id)} className="text-red-500 ml-2">
                                    Archive
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {selectedQuoteId !== null && (
                <form onSubmit={handleQuoteUpdate} className="mt-4">
                    <label>
                        Price:
                        <input
                            type="text"
                            value={price}
                            onChange={handlePriceChange}
                            className="ml-2 p-1 border border-gray-300 rounded"
                        />
                    </label>
                    <button type="submit" className="ml-2 p-1 bg-blue-500 text-white rounded">
                        Update Quote
                    </button>
                </form>
            )}
            {errorText && <div className="text-red-500 mt-2">{errorText}</div>}
        </div>
    );
};

export default AdminQuoteRequests;