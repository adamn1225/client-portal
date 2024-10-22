import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface QuoteListProps {
    session: Session | null;
    quotes: Database['public']['Tables']['shippingquotes']['Row'][];
    fetchQuotes: () => void;
    archiveQuote: (id: number) => Promise<void>;
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, archiveQuote }) => {
    return (
        <ul className="flex flex-col h-full">
            {quotes.map((quote, index) => (
                <li
                    key={quote.id}
                    className={`border-b border-slate-400 ${index === quotes.length - 1 ? '' : 'border-b'}`}
                >
                    <div className="flex items-center justify-around p-4">
                        <div className="flex gap-2 text-nowrap w-2/5 items-center">
                            <span className='border-r border-gray-600/50 pr-2 mr-2'>{quote.id}</span> 
                            
                            <div className='flex gap-2 w-full'>
                                <h5 className='font-semibold'>Origin:</h5>
                                <span>{quote.origin_city}, {quote.origin_state} {quote.origin_zip} </span>
                            </div>
                            
                            <div className='flex gap-2 w-full'>
                                <h5 className='font-semibold'>Destination:</h5>
            <span className='text-nowrap'>{quote.destination_city}, {quote.destination_state} {quote.destination_zip}</span>
                            </div>
                            
                        </div>
                        <div><span className='font-bold'>Freight: </span>{quote.year_amount} {quote.make} {quote.model}</div>
                        <div><span className='font-bold'>Shipping Date: </span>{quote.due_date || 'No due date'}</div>
                        <div>{quote.first_name} {quote.last_name} {quote.email}</div>
                        <div><span className='font-bold'>Price: </span>{quote.price ? `$${quote.price}` : 'coming soon'}</div>
                        <button onClick={() => archiveQuote(quote.id)} className="text-red-500 ml-2">
                            Archive
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default QuoteList;