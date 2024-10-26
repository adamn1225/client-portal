import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import QuoteForm from './QuoteForm';
import QuoteList from './quotetabs/QuoteList';
import HistoryList from './quotetabs/HistoryList';
import OrderList from './quotetabs/OrderList';

interface QuoteRequestProps {
    session: Session | null;
}

type ShippingQuote = Database['public']['Tables']['shippingquotes']['Row'];
type Freight = Database['public']['Tables']['freight']['Row'];

const QuoteRequest = ({ session }: QuoteRequestProps) => {
    const supabase = useSupabaseClient<Database>();
    const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
    const [freightList, setFreightList] = useState<Freight[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('requests');

    const fetchQuotes = useCallback(async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('shippingquotes')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_archived', false); // Fetch only non-archived quotes

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Quotes:', data);
            setQuotes(data);
        }
    }, [session, supabase]);

    const fetchFreight = useCallback(async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('freight')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Freight:', data);
            setFreightList(data);
        }
    }, [session, supabase]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchQuotes();
            fetchFreight();
        }
    }, [session, fetchQuotes, fetchFreight]);

    const addQuote = async (quote: Partial<Database['public']['Tables']['shippingquotes']['Insert']>) => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('shippingquotes')
            .insert([{
                ...quote,
                user_id: session.user.id,
                first_name: quote.first_name || null,
                last_name: quote.last_name || null,
                email: quote.email || null,
                inserted_at: quote.inserted_at || new Date().toISOString(),
                is_complete: quote.is_complete || false,
                price: quote.price || 0,
                is_archived: quote.is_archived || false
            }])
            .select();

        if (error) {
            console.error('Error adding quote:', error.message);
            setErrorText('Error adding quote');
        } else {
            console.log('Quote added successfully:', data);
            setQuotes([...quotes, ...(data || [])]);
            setErrorText('');
            setIsModalOpen(false); // Close the modal after adding the quote
        }
    };

    const archiveQuote = async (id: number) => {
        if (!session?.user?.id) return;

        const { error } = await supabase
            .from('shippingquotes')
            .update({ is_archived: true } as Database['public']['Tables']['shippingquotes']['Update']) // Mark the quote as archived
            .eq('id', id);

        if (error) {
            console.error('Error archiving quote:', error.message);
            setErrorText('Error archiving quote');
        } else {
            setQuotes(quotes.filter(quote => quote.id !== id));
        }
    };

    const transferToOrderList = async (quoteId: number) => {
        if (!session?.user?.id) {
            setErrorText('User is not authenticated');
            return;
        }

        try {
            // Logic to transfer the quote to the order list
            const { data, error } = await supabase
                .from('orders')
                .insert([{ quote_id: quoteId, user_id: session.user.id }]);

            if (error) {
                console.error('Error transferring quote to order list:', error);
                setErrorText('Error transferring quote to order list');
            } else {
                console.log('Quote transferred to order list:', data);
                // Remove the transferred quote from the quotes array
                setQuotes(quotes.filter(quote => quote.id !== quoteId));
            }
        } catch (error) {
            console.error('Error transferring quote to order list:', error);
            setErrorText('Error transferring quote to order list');
        }
    };

    return (
        <div className="w-full h-full overflow-auto">
            <div className="w-full">
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className="mb-12 text-2xl text-center text-wrap">Request a Shipping Quote</h1>
                    <h3 className='text-center'>Provide details about your freight and request a quote.</h3>
                    <button onClick={() => setIsModalOpen(true)} className="btn-slate">
                        Request a Shipping Estimate
                    </button>
                </div>
                <QuoteForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    freightList={freightList}
                    addQuote={addQuote}
                    errorText={errorText}
                    setErrorText={setErrorText}
                />
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
            <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 flex-grow">
                {activeTab === 'requests' && (
                    <QuoteList
                        session={session}
                        quotes={quotes}
                        fetchQuotes={fetchQuotes}
                        archiveQuote={archiveQuote}
                        transferToOrderList={transferToOrderList}
                        isAdmin={false}
                    />
                )}
                {activeTab === 'orders' && (
                    <OrderList
                        session={session}
                        fetchQuotes={fetchQuotes}
                        archiveQuote={archiveQuote}
                        isAdmin={false}
                    />
                )}
                {activeTab === 'history' && (
                    <HistoryList 
                        session={session}
                        quotes={quotes}
                        fetchQuotes={fetchQuotes}
                        archiveQuote={archiveQuote} 
                    />
                )}
            </div>
        </div>
    );
};

export default QuoteRequest;