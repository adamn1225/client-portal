import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/initSupabase'; // Adjust the import path as needed

interface HistoryListProps {
    session: Session | null;
}

type Order = Database['public']['Tables']['orders']['Row'] & {
    shippingquotes: {
        id: number;
        origin_city: string | null;
        origin_state: string | null;
        origin_zip: string | null;
        destination_city: string | null;
        destination_state: string | null;
        destination_zip: string | null;
        year_amount: string | null;
        make: string | null;
        model: string | null;
        due_date: string | null;
        first_name: string | null;
        last_name: string | null;
        email: string | null;
        price: number | null;
    }[]; // Change to array
};

const HistoryList: React.FC<HistoryListProps> = ({ session }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorText, setErrorText] = useState<string>('');

    const fetchCompletedOrders = useCallback(async () => {
        const query = supabase
            .from('orders')
            .select(`
        *,
        shippingquotes:shippingquotes (
          id,
          origin_city,
          origin_state,
          origin_zip,
          destination_city,
          destination_state,
          destination_zip,
          year_amount,
          make,
          model,
          due_date,
          first_name,
          last_name,
          email,
          price
        )
      `)
            .eq('status', 'completed'); // Ensure fetching orders with status 'completed'

        if (session?.user?.id) {
            query.eq('user_id', session.user.id);
        }

        const { data, error } = await query;

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Completed Orders:', data);
            setOrders(data as Order[]); // Cast data to Order[]
        }
    }, [session]);

    useEffect(() => {
        fetchCompletedOrders();
    }, [session, fetchCompletedOrders]);

    return (
        <div className="w-full bg-white shadow rounded-md border border-zinc-400 max-h-max flex-grow">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50 dark:bg-zinc-900/90 sticky top-0 z-10">
                        <tr className='border-b border-zinc-900/20 dark:border-zinc-100'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-50 uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Price</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900/90 divide-y divide-zinc-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    <div className="flex flex-col justify-start">
                                        <span><strong>Origin:</strong> {order.shippingquotes[0]?.origin_city ?? 'N/A'}, {order.shippingquotes[0]?.origin_state ?? 'N/A'} {order.shippingquotes[0]?.origin_zip ?? 'N/A'}</span>
                                        <span><strong>Destination:</strong> {order.shippingquotes[0]?.destination_city ?? 'N/A'}, {order.shippingquotes[0]?.destination_state ?? 'N/A'} {order.shippingquotes[0]?.destination_zip ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.shippingquotes[0]?.year_amount ?? 'N/A'} {order.shippingquotes[0]?.make ?? 'N/A'} {order.shippingquotes[0]?.model ?? 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.shippingquotes[0]?.due_date ?? 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.shippingquotes[0]?.first_name ?? 'N/A'} {order.shippingquotes[0]?.last_name ?? 'N/A'} {order.shippingquotes[0]?.email ?? 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.shippingquotes[0]?.price ? `$${order.shippingquotes[0].price}` : 'Not priced yet'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block 2xl:hidden">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white shadow rounded-md mb-4 p-4 border border-zinc-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">ID</div>
                            <div className="text-sm font-medium text-zinc-900">{order.id}</div>
                        </div>
                        <div className='border-b border-zinc-600 mb-4'></div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Origin</div>
                            <div className="text-sm font-medium text-zinc-900">
                                {order.shippingquotes[0] ? `${order.shippingquotes[0].origin_city}, ${order.shippingquotes[0].origin_state} ${order.shippingquotes[0].origin_zip}` : 'No origin data'}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Destination</div>
                            <div className="text-sm font-medium text-zinc-900">{order.shippingquotes[0]?.destination_city}, {order.shippingquotes[0]?.destination_state} {order.shippingquotes[0]?.destination_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Freight</div>
                            <div className="text-sm font-medium text-zinc-900">{order.shippingquotes[0]?.year_amount} {order.shippingquotes[0]?.make} {order.shippingquotes[0]?.model}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Shipping Date</div>
                            <div className="text-sm font-medium text-zinc-900">{order.shippingquotes[0]?.due_date || 'No due date'}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Contact</div>
                            <div className="text-sm font-medium text-zinc-900">{order.shippingquotes[0]?.first_name} {order.shippingquotes[0]?.last_name} {order.shippingquotes[0]?.email}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-zinc-500">Price</div>
                            <div className="text-sm font-medium text-zinc-900">{order.shippingquotes[0]?.price ? `$${order.shippingquotes[0].price}` : 'Not priced yet'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;