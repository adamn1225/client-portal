import React, { useEffect, useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { fetchAllUsers, fetchAllQuotesWithUserDetails } from '@/lib/database';

const AdminQuoteRequests = () => {
    const supabase = useSupabaseClient<Database>();
    const user = useUser();
    const [quotes, setQuotes] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersData = await fetchAllUsers();
                console.log('Fetched Users:', usersData);
                setUsers(usersData);

                const quotesData = await fetchAllQuotesWithUserDetails();
                console.log('Fetched Quotes with User Details:', quotesData);
                setQuotes(quotesData);
            } catch (error) {
                console.error('Error fetching data:', error);
                setErrorText('Error fetching data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (user) {
            console.log('Authenticated User ID:', user.id);
        }
    }, [user]);

    const handleUserChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userId = event.target.value;
        setSelectedUser(userId);

        try {
            if (userId) {
                const { data, error } = await supabase
                    .from('shippingquotes')
                    .select('*')
                    .eq('user_id', userId);

                if (error) {
                    console.error('Error fetching quotes for user:', error);
                    setErrorText('Error fetching quotes for user');
                } else {
                    console.log('Fetched Quotes for User:', data);
                    setQuotes(data);
                }
            } else {
                const quotesData = await fetchAllQuotesWithUserDetails();
                setQuotes(quotesData);
            }
        } catch (error) {
            console.error('Error fetching quotes:', error);
            setErrorText('Error fetching quotes');
        }
    };

    const updateQuote = async (quoteId: number, updatedData: any) => {
        try {
            const { error } = await supabase
                .from('shippingquotes')
                .update(updatedData)
                .eq('id', quoteId);

            if (error) {
                console.error('Error updating quote:', error);
                setErrorText('Error updating quote');
            } else {
                setQuotes(quotes.map(quote => quote.id === quoteId ? { ...quote, ...updatedData } : quote));
            }
        } catch (error) {
            console.error('Error updating quote:', error);
            setErrorText('Error updating quote');
        }
    };

    const deleteQuote = async (quoteId: number) => {
        try {
            const { error } = await supabase
                .from('shippingquotes')
                .delete()
                .eq('id', quoteId);

            if (error) {
                console.error('Error deleting quote:', error);
                setErrorText('Error deleting quote');
            } else {
                setQuotes(quotes.filter(quote => quote.id !== quoteId));
            }
        } catch (error) {
            console.error('Error deleting quote:', error);
            setErrorText('Error deleting quote');
        }
    };

    return (
        <div className="admin-quote-requests">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="mb-4">
                <label htmlFor="user-select" className="block mb-2">Select User:</label>
                <select
                    id="user-select"
                    value={selectedUser}
                    onChange={handleUserChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="">All Users</option>
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.first_name ? `${user.first_name} (${user.email})` : user.email}
                        </option>
                    ))}
                </select>
            </div>
            <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-screen overflow-y-auto flex-grow">
                <ul className="flex flex-col h-full">
                    {quotes && quotes.length > 0 ? (
                        quotes.map((quote, index) => (
                            <li
                                key={quote.id}
                                className={`border-b border-slate-400 ${index === quotes.length - 1 ? '' : 'border-b'}`}
                            >
                                <div className="flex items-center p-4">
                                    <div className="flex-grow">
                                        {quote.origin_city} to {quote.destination_city} (User: {quote.profiles?.first_name} {quote.profiles?.last_name})
                                    </div>
                                    <div>(Due: {quote.due_date || 'No due date'})</div>
                                    <button onClick={() => deleteQuote(quote.id)} className="text-red-500">
                                        Delete
                                    </button>
                                    <button onClick={() => updateQuote(quote.id, { status: 'updated' })} className="text-blue-500">
                                        Update
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-4">No quotes available</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminQuoteRequests;