import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';

interface ChromeQuoteRequestProps {
    session: Session | null;
}

type ChromeQuotes = Database['public']['Tables']['chrome_quotes']['Row'];

const ChromeQuoteRequest = ({ session }: ChromeQuoteRequestProps) => {
    const supabase = useSupabaseClient<Database>();
    const [quotes, setQuotes] = useState<ChromeQuotes[]>([]);
    const [errorText, setErrorText] = useState<string>('');

    const fetchQuotes = useCallback(async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
            .from('chrome_quotes')
            .select('*')
            .eq('email', session.user.email);

        if (error) {
            setErrorText(error.message);
        } else {
            setQuotes(data);
        }
    }, [session, supabase]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchQuotes();
        }
    }, [session, fetchQuotes]);

    return (
        <div className="w-full h-full overflow-auto mt-6 pt-12 border-t border-slate-900/30">
            <div className="w-full">
                <div className='flex flex-col justify-center items-center gap-2'>
                    <h1 className="mb-2 text-2xl text-center text-wrap font-md">HC Browsing Shipping Quotes</h1>
                    <h3 className='text-center'>Here are your submitted shipping quotes from HC Browsing quote extension.</h3>
                </div>
            </div>
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full border border-slate-900/20 divide-y divide-gray-200 dark:bg-gray-800 dark:text-white">
                    <thead className="bg-gray-50 dark:bg-gray-800 dark:text-white">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-white uppercase tracking-wider border-r border-slate-900/20">Quote</th>
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
                                        <span><strong>Origin:</strong> {quote.originzip}</span>
                                        <span><strong>Destination:</strong> {quote.destinationzip}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.year} {quote.make} {quote.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {quote.quote ? `$${quote.quote}` : 'Pending'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {errorText && <div className="text-red-500 mt-2">{errorText}</div>}
        </div>
    );
};

export default ChromeQuoteRequest;