import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/initSupabase';// Adjust the import path as needed

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
    } | null;
};

const HistoryList: React.FC<HistoryListProps> = ({ session }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorText, setErrorText] = useState<string>('');

    const fetchDeliveredOrders = useCallback(async () => {
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
            .eq('status', 'delivered');

        if (session?.user?.id) {
            query.eq('user_id', session.user.id);
        }

        const { data, error } = await query;

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Delivered Orders:', data);
            setOrders(orders);
        }
    }, [session]);

    useEffect(() => {
        fetchDeliveredOrders();
    }, [session, fetchDeliveredOrders]);

    return (
        <div className="w-full bg-white shadow rounded-md border border-slate-400 max-h-max flex-grow">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Origin/Destination</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Contact</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Price</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    <div className="flex flex-col justify-start">
                                    <span><strong>Origin:</strong> {order.shippingquotes?.origin_city ?? 'N/A'}, {order.shippingquotes?.origin_state ?? 'N/A'} {order.shippingquotes?.origin_zip ?? 'N/A'}</span>
                                    <span><strong>Destination:</strong> {order.shippingquotes?.destination_city ?? 'N/A'}, {order.shippingquotes?.destination_state ?? 'N/A'} {order.shippingquotes?.destination_zip ?? 'N/A'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes?.year_amount ?? 'N/A'} {order.shippingquotes?.make ?? 'N/A'} {order.shippingquotes?.model ?? 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes?.due_date ?? 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes?.first_name ?? 'N/A'} {order.shippingquotes?.last_name ?? 'N/A'} {order.shippingquotes?.email ?? 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes?.price ? `$${order.shippingquotes.price}` : 'Not priced yet'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block 2xl:hidden">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white shadow rounded-md mb-4 p-4 border border-slate-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-gray-500">ID</div>
                            <div className="text-sm font-medium text-gray-900">{order.id}</div>
                        </div>
                        <div className='border-b border-slate-600 mb-4'></div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Origin</div>
                            <div className="text-sm font-medium text-gray-900">
                                {order.shippingquotes ? `${order.shippingquotes.origin_city}, ${order.shippingquotes.origin_state} ${order.shippingquotes.origin_zip}` : 'No origin data'}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Destination</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes?.destination_city}, {order.shippingquotes?.destination_state} {order.shippingquotes?.destination_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Freight</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes?.year_amount} {order.shippingquotes?.make} {order.shippingquotes?.model}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Shipping Date</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes?.due_date || 'No due date'}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Contact</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes?.first_name} {order.shippingquotes?.last_name} {order.shippingquotes?.email}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Price</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes?.price ? `$${order.shippingquotes.price}` : 'Not priced yet'}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryList;