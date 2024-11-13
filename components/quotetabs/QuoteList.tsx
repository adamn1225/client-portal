import React, { useState } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { ShippingQuote } from '@/lib/schema';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import OrderFormModal from './OrderFormModal';

interface QuoteListProps {
    session: Session | null;
    quotes: Database['public']['Tables']['shippingquotes']['Row'][];
    fetchQuotes: () => void;
    archiveQuote: (id: number) => Promise<void>;
    transferToOrderList: (quoteId: number, data: any) => Promise<void>;
    handleSelectQuote: (id: number) => void;
    isAdmin: boolean; // Add this prop
}

const QuoteList: React.FC<QuoteListProps> = ({ session, quotes, fetchQuotes, archiveQuote, transferToOrderList, handleSelectQuote, isAdmin }) => {
    const supabase = useSupabaseClient<Database>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [quote, setQuote] = useState<ShippingQuote[]>([]);

    const handleCreateOrderClick = (quoteId: number) => {
        setSelectedQuoteId(quoteId);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (data: any) => {
        if (selectedQuoteId !== null && session?.user?.id) {
            // Post data to the orders table
            const { error } = await supabase
                .from('orders')
                .insert({
                    quote_id: selectedQuoteId,
                    user_id: session.user.id, // Ensure user_id is included
                    origin_street: data.originStreet,
                    destination_street: data.destinationStreet,
                    earliest_pickup_date: data.earliestPickupDate,
                    latest_pickup_date: data.latestPickupDate,
                    notes: data.notes,
                    status: 'pending', // Set initial status
                });

            if (error) {
                console.error('Error creating order:', error.message);
            } else {
                // Transfer data to OrderList.tsx
                transferToOrderList(selectedQuoteId, data);
                // Remove the quote from the state
                setQuote(quotes.filter(quote => quote.id !== selectedQuoteId));
            }
        }
        setIsModalOpen(false);
    };

    const handleRespond = async (quoteId: number) => {
        handleSelectQuote(quoteId);

        // Fetch the quote details
        const { data: quote, error: fetchError } = await supabase
            .from('shippingquotes')
            .select('*')
            .eq('id', quoteId)
            .single();

        if (fetchError) {
            console.error('Error fetching quote details:', fetchError.message);
            return;
        }

        console.log('Fetched quote details:', quote); // Debugging log

        // Add notification entry to the database
        const { error } = await supabase
            .from('notifications')
            .insert([{ user_id: quote.user_id, message: `You have a new response to your quote request for quote #${quote.id}` }]);

        if (error) {
            console.error('Error adding notification:', error.message);
        } else {
            console.log('Notification added successfully'); // Debugging log

            // Fetch user email settings
            const { data: userSettings, error: settingsError } = await supabase
                .from('profiles')
                .select('email, email_notifications')
                .eq('id', quote.user_id as string)
                .single();

            if (settingsError) {
                console.error('Error fetching user settings:', settingsError.message);
                return;
            }

            if (userSettings.email_notifications) {
                await sendEmailNotification(userSettings.email, 'New Notification', `You have a new response to your quote request for quote #${quote.id}`);
            }
        }
    };

    const sendEmailNotification = async (to: string, subject: string, text: string) => {
        try {
            const response = await fetch('/api/sendEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, text }),
            });

            if (!response.ok) {
                console.error('Error sending email:', await response.json());
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className="w-full bg-white dark:bg-gray-800 dark:text-white shadow rounded-md border border-slate-400 max-h-max flex-grow">
            <OrderFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:bg-gray-800 dark:text-white">
                    <thead className="bg-gray-50 dark:bg-gray-800 dark:text-white">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    <div className="flex flex-col justify-start">
                                        <span><strong>Origin:</strong> {quote.origin_city}, {quote.origin_state} {quote.origin_zip}</span>
                                        <span><strong>Destination:</strong> {quote.destination_city}, {quote.destination_state} {quote.destination_zip}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.year_amount} {quote.make} {quote.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.due_date || 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.price ? `$${quote.price}` : 'Not priced yet'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                                    <button onClick={() => archiveQuote(quote.id)} className="text-red-500 ml-2">
                                        Archive
                                    </button>
                                    {quote.price ? (
                                        <button
                                            onClick={() => handleCreateOrderClick(quote.id)}
                                            className="body-btn"
                                        >
                                            Create Order
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => alert('10-4, Working in now.')}
                                            className="ml-2 px-4 py-2 font-semibold bg-gray-900 text-red-600 rounded"
                                        >
                                            Press if Urgent
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleRespond(quote.id)} className="text-blue-500 ml-2">
                                            Respond
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block 2xl:hidden">
                {quotes.map((quote) => (
                    <div key={quote.id} className="bg-white dark:bg-gray-800 dark:text-white shadow rounded-md mb-4 p-4 border border-slate-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">ID</div>
                            <div className="text-sm font-medium text-gray-900">{quote.id}</div>
                        </div>
                        <div className='border-b border-slate-600 mb-4'></div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">Origin</div>
                            <div className="text-sm font-medium text-gray-900">{quote.origin_city}, {quote.origin_state} {quote.origin_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">Destination</div>
                            <div className="text-sm font-medium text-gray-900">{quote.destination_city}, {quote.destination_state} {quote.destination_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">Freight</div>
                            <div className="text-sm font-medium text-gray-900">{quote.year_amount} {quote.make} {quote.model}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">Shipping Date</div>
                            <div className="text-sm font-medium text-gray-900">{quote.due_date || 'No due date'}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500 dark:text-white">Price</div>
                            <div className="text-sm font-medium text-gray-900">{quote.price ? `$${quote.price}` : 'Not priced yet'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => archiveQuote(quote.id)} className="text-red-500 ml-2">
                                Archive
                            </button>
                            {quote.price ? (
                                <button
                                    onClick={() => handleCreateOrderClick(quote.id)}
                                    className="ml-2 p-1 bg-blue-500 text-white rounded"
                                >
                                    Create Order
                                </button>
                            ) : (
                                <button
                                    onClick={() => alert('Please contact us if urgent.')}
                                    className="ml-2 p-1 bg-yellow-500 text-white rounded"
                                >
                                    Contact if Urgent
                                </button>
                            )}
                            {isAdmin && (
                                <button onClick={() => handleRespond(quote.id)} className="text-blue-500 ml-2">
                                    Respond
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuoteList;