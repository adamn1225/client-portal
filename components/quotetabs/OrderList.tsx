import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { supabase } from '@/lib/initSupabase'; // Adjust the import path as needed
import Modal from '@/components/Modal'; // Adjust the import path as needed

interface OrderListProps {
    session: Session | null;
    fetchQuotes: () => Promise<void>; // Add this prop
    archiveQuote: (id: number) => Promise<void>;
}

type Order = Database['public']['Tables']['orders']['Row'] & {
    shippingquotes: Database['public']['Tables']['shippingquotes']['Row'];
};

const OrderList: React.FC<OrderListProps> = ({ session }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>('');

    const fetchOrders = useCallback(async () => {
        if (!session?.user?.id) return;

        const { data, error } = await supabase
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
            .eq('user_id', session.user.id);

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Orders:', data);
            setOrders(data);
        }
    }, [session]);

    useEffect(() => {
        if (session?.user?.id) {
            fetchOrders();
        }
    }, [session, fetchOrders]);

    const handleCancelOrder = (id: number) => {
        setSelectedOrderId(id);
        setIsModalOpen(true);
    };

    const confirmCancelOrder = async () => {
        if (selectedOrderId === null) return;

        const { error } = await supabase
            .from('orders')
            .update({ is_archived: true, cancellation_reason: cancellationReason } as Partial<Order>)
            .eq('id', selectedOrderId);

        if (error) {
            console.error('Error archiving order:', error.message);
            setErrorText('Error archiving order');
        } else {
            setOrders(orders.filter(order => order.id !== selectedOrderId));
            setIsModalOpen(false);
            setSelectedOrderId(null);
            setCancellationReason('');
        }
    };

    return (
        <div className="w-full bg-white shadow rounded-md border border-slate-400 max-h-max flex-grow">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Origin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                    <span><strong>Origin:</strong> {quote.origin_city}, {quote.origin_state} {quote.origin_zip}</span>
                                    <span><strong>Destination:</strong> {quote.destination_city}, {quote.destination_state} {quote.destination_zip}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes.year_amount} {order.shippingquotes.make} {order.shippingquotes.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes.due_date || 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {order.shippingquotes.price ? `$${order.shippingquotes.price}` : 'coming soon'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                                    <button onClick={() => handleCancelOrder(order.id)} className="text-red-500 ml-2">
                                        Cancel Order
                                    </button>
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
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes.origin_city}, {order.shippingquotes.origin_state} {order.shippingquotes.origin_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Destination</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes.destination_city}, {order.shippingquotes.destination_state} {order.shippingquotes.destination_zip}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Freight</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes.year_amount} {order.shippingquotes.make} {order.shippingquotes.model}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Shipping Date</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes.due_date || 'No due date'}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Price</div>
                            <div className="text-sm font-medium text-gray-900">{order.shippingquotes.price ? `$${order.shippingquotes.price}` : 'coming soon'}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => handleCancelOrder(order.id)} className="text-red-500 ml-2">
                                Cancel Order
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl mb-4">Are you sure you want to cancel the order?</h2>
                <button onClick={confirmCancelOrder} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                    Yes
                </button>
                <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded">
                    No
                </button>
                {selectedOrderId !== null && (
                    <div className="mt-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                            Reason for cancellation:
                        </label>
                        <input
                            type="text"
                            id="reason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded w-full"
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default OrderList;