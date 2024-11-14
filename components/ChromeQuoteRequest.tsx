import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { Session } from '@supabase/auth-helpers-react';

type ChromeQuotes = Database['public']['Tables']['chrome_quotes']['Row'] & {
    user_id: string; // Add this line
};

interface ChromeQuoteRequestProps {
    session: Session | null;
}

const ChromeQuoteRequest: React.FC<ChromeQuoteRequestProps> = ({ session }) => {
    const supabase = useSupabaseClient<Database>();
    const [quotes, setQuotes] = useState<ChromeQuotes[]>([]);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');
    const [selectedQuoteId, setSelectedQuoteId] = useState<number | null>(null);
    const [price, setPrice] = useState<string>('');

    const fetchQuotes = useCallback(async () => {
        if (!session?.user?.id) {
            setErrorText('No session or user ID found');
            return;
        }

        const { data, error } = await supabase
            .from('chrome_quotes')
            .select('*')
            .eq('user_id', session.user.id); // Filter by user_id

        if (error) {
            setErrorText(error.message);
        } else {
            setQuotes(data);
        }
    }, [session, supabase]);

    useEffect(() => {
        if (session?.user?.id) {
            const checkAdmin = async () => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();

                if (data?.role === 'admin') {
                    setIsAdmin(true);
                }
            };

            checkAdmin();
        }
        if (session?.user?.id) {
            fetchQuotes();
        }
    }, [session, fetchQuotes]);

    const notifyAdmins = async () => {
        try {
            // Fetch all admin users
            const { data: admins, error: fetchError } = await supabase
                .from('profiles')
                .select('id, email')
                .eq('role', 'admin');

            if (fetchError) {
                console.error('Error fetching admin users:', fetchError.message);
                return;
            }

            // Create notifications for each admin user
            const notifications = admins.map(admin => ({
                user_id: admin.id,
                message: 'New quote request submitted.',
            }));

            const { error: insertError } = await supabase
                .from('notifications')
                .insert(notifications);

            if (insertError) {
                console.error('Error creating notifications:', insertError.message);
                return;
            }

            // Optionally, send email notifications to each admin user
            for (const admin of admins) {
                await sendEmailNotification(admin.email, 'New Quote Request', 'A new quote request has been submitted.');
            }

            // Send email notification to yourself
            await sendEmailNotification('your-email@example.com', 'New Quote Request', 'A new quote request has been submitted.');

            console.log('Notifications sent to all admin users.');
        } catch (error) {
            console.error('Error notifying admin users:', error);
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

    const handleRespond = async (quoteId: number) => {
        setSelectedQuoteId(quoteId);
    };

    const handleResponseSubmit = async () => {
        if (selectedQuoteId === null) return;

        try {
            const { error } = await supabase
                .from('chrome_quotes')
                .update({ quote: Number(price) })
                .eq('id', selectedQuoteId);

            if (error) {
                console.error('Error responding to quote:', error.message);
                setErrorText('Error responding to quote');
            } else {
                setQuotes(quotes.map(quote => (quote.id === selectedQuoteId ? { ...quote, quote: Number(price) } : quote)));
                setSelectedQuoteId(null);
                setPrice('');

                // Add notification entry to the database
                const { error: notificationError } = await supabase
                    .from('notifications')
                    .insert([{ user_id: session?.user?.id, message: `Your quote request #${selectedQuoteId} has been responded to.` }]);

                if (notificationError) {
                    console.error('Error adding notification:', notificationError.message);
                } else {
                    console.log('Notification added successfully');
                }
            }
        } catch (error) {
            console.error('Error responding to quote:', error);
            setErrorText('Error responding to quote. Please check your internet connection and try again.');
        }
    };

    return (
        <div className="w-full h-full overflow-auto mt-6 pt-12 border-t border-zinc-900/30">
            <div className="w-full">
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className="mb-2 text-2xl text-center text-wrap font-md">HC Browsing Shipping Quotes</h1>
                    <h3 className='text-center'>Here are your submitted shipping quotes from HC Browsing quote extension.</h3>
                </div>
            </div>
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full border border-zinc-900/20 divide-y divide-zinc-200 dark:bg-zinc-800 dark:text-white">
                    <thead className="bg-zinc-50 dark:bg-zinc-800 dark:text-white">
                        <tr className='border-b border-zinc-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20">Quote</th>
                            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200">
                        {quotes.map((quote) => (
                            <tr key={quote.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20">
                                    {quote.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20">
                                    <div className="flex flex-col justify-start">
                                        <span><strong>Origin:</strong> {quote.originzip}</span>
                                        <span><strong>Destination:</strong> {quote.destinationzip}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20">
                                    {quote.year} {quote.make} {quote.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20">
                                    {quote.quote ? `$${quote.quote}` : 'Pending'}
                                </td>
                                {isAdmin && (
                                    <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20">
                                        <button onClick={() => handleRespond(quote.id)} className="text-blue-500 ml-2">
                                            Respond
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedQuoteId !== null && (
                <div className="mt-4">
                    <h3 className="text-lg font-medium">Respond to Quote #{selectedQuoteId}</h3>
                    <input
                        type="text"
                        placeholder="Enter price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <button onClick={handleResponseSubmit} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                        Submit Response
                    </button>
                </div>
            )}
            {errorText && <div className="text-red-500 mt-2">{errorText}</div>}
        </div>
    );
};

export default ChromeQuoteRequest;