import React from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface QuoteListProps {
    session: Session | null;
    quotes: Database['public']['Tables']['shippingquotes']['Row'][];
    fetchQuotes: () => void;
    archiveQuote: (id: number) => Promise<void>;
    transferToOrderList: (quoteId: number) => Promise<void>;
    handleSelectQuote: (id: number) => void;
    isAdmin: boolean; // Add this prop
}

const QuoteList: React.FC<QuoteListProps> = ({ quotes, archiveQuote, transferToOrderList, handleSelectQuote, isAdmin }) => {
    return (
        <div className="w-full bg-white shadow rounded-md border border-slate-400 max-h-max flex-grow">
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                            onClick={() => transferToOrderList(quote.id)}
                                            className="ml-2 px-4 py-2 font-semibold bg-slate-800 text-white rounded"
                                        >
                                            Create Order
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => alert('10-4, Working in now.')}
                                            className="ml-2 px-4 py-2 font-semibold bg-slate-800 text-amber-300 rounded"
                                        >
                                            Press if Urgent
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleSelectQuote(quote.id)} className="text-blue-500 ml-2">
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
                    <div key={quote.id} className="bg-white shadow rounded-md mb-4 p-4 border border-slate-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-gray-500">ID</div>
                            <div className="text-sm font-medium text-gray-900">{quote.id}</div>
                        </div>
                        <div className='border-b border-slate-600 mb-4'></div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Origin</div>
                            <div className="text-sm font-medium text-gray-900">{quote.origin_city}, {quote.origin_state} {quote.origin_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Destination</div>
                            <div className="text-sm font-medium text-gray-900">{quote.destination_city}, {quote.destination_state} {quote.destination_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Freight</div>
                            <div className="text-sm font-medium text-gray-900">{quote.year_amount} {quote.make} {quote.model}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Shipping Date</div>
                            <div className="text-sm font-medium text-gray-900">{quote.due_date || 'No due date'}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Price</div>
                            <div className="text-sm font-medium text-gray-900">{quote.price ? `$${quote.price}` : 'Not priced yet'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => archiveQuote(quote.id)} className="text-red-500 ml-2">
                                Archive
                            </button>
                            {quote.price ? (
                                <button
                                    onClick={() => transferToOrderList(quote.id)}
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
                                <button onClick={() => handleSelectQuote(quote.id)} className="text-blue-500 ml-2">
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