import React, { useEffect, useState } from 'react';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/initSupabase';
import QuoteList from '../quotetabs/QuoteList';
import OrderList from '../quotetabs/OrderList';
import HistoryList from '../quotetabs/HistoryList';

type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];

const AdminQuoteRequests = () => {
    const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
    const [filteredQuotes, setFilteredQuotes] = useState<ShippingQuote[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [price, setPrice] = useState<string>(''); // Update state to reflect price
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [errorText, setErrorText] = useState<string>('');
    const [activeTab, setActiveTab] = useState('requests');

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

    useEffect(() => {
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
            .update({ price: parseFloat(price) } as Partial<ShippingQuote>) // Update price instead of quote_id
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

            // Create a notification for the user
            const updatedQuote = quotes.find(quote => quote.id === selectedQuoteId);
            if (updatedQuote) {
                const { error: notificationError } = await supabase
                    .from('notifications')
                    .insert([{ user_id: updatedQuote.user_id, message: `Your quote #${updatedQuote.id} has been updated with a new price.` }]);

                if (notificationError) {
                    console.error('Error creating notification:', notificationError.message);
                }
            }
        }
    };

    const handleSelectQuote = (id: number) => {
        setSelectedQuoteId(id);
    };

    const archiveQuote = async (id: number) => {
        const { error } = await supabase
            .from('shippingquotes')
            .update({ is_archived: true } as Partial<ShippingQuote>) // Mark the quote as archived
            .eq('id', id);

        if (error) {
            console.error('Error archiving quote:', error.message);
            setErrorText('Error archiving quote');
        } else {
            setQuotes(quotes.filter(quote => quote.id !== id));
            setFilteredQuotes(filteredQuotes.filter(quote => quote.id !== id));
        }
    };

    const transferToOrderList = async (quoteId: number) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([{ quote_id: quoteId, user_id: quotes.find(quote => quote.id === quoteId)?.user_id, status: 'pending', is_archived: false }]);

            if (error) {
                console.error('Error transferring quote to order list:', error);
                setErrorText('Error transferring quote to order list');
            } else {
                console.log('Quote transferred to order list:', data);
                setQuotes(quotes.filter(quote => quote.id !== quoteId));
                setFilteredQuotes(filteredQuotes.filter(quote => quote.id !== quoteId));
            }
        } catch (error) {
            console.error('Error transferring quote to order list:', error);
            setErrorText('Error transferring quote to order list');
        }
    };

    const markAsComplete = async (orderId: number) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'delivered' })
                .eq('id', orderId);

            if (error) {
                console.error('Error marking order as complete:', error);
                setErrorText('Error marking order as complete');
            } else {
                // Refresh the order list after marking as complete
                fetchQuotes();
            }
        } catch (error) {
            console.error('Error marking order as complete:', error);
            setErrorText('Error marking order as complete');
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
            <div className="flex justify-center items-center border-b border-gray-300">
                <button
                    className={`px-4 py-2 ${activeTab === 'requests' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('requests')}
                >
                    Shipping Requests
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'orders' ? 'border-b-2 border-amber-500' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Shipping Orders
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'history' ? 'border-b-2 border-green-500' : ''}`}
                    onClick={() => setActiveTab('history')}
                >
                    Completed Orders
                </button>
            </div>
            <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-screen overflow-y-auto flex-grow">
                {activeTab === 'requests' && (
                    <QuoteList
                        session={null}
                        quotes={quotes}
                        fetchQuotes={() => { }} // No need to fetch quotes again
                        archiveQuote={archiveQuote}
                        transferToOrderList={transferToOrderList}
                        handleSelectQuote={handleSelectQuote}
                        isAdmin={true}
                    />
                )}
                {activeTab === 'orders' && (
                    <OrderList
                        session={null} // Admin does not need a session
                        fetchQuotes={() => { }} // No need to fetch quotes again
                        archiveQuote={archiveQuote}
                        markAsComplete={markAsComplete} // Pass the function as a prop
                        isAdmin={true} // Pass the isAdmin prop
                    />
                )}
                {activeTab === 'history' && (
                    <HistoryList
                        session={null}
                    />
                )}
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