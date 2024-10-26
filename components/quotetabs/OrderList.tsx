import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { supabase } from '@/lib/initSupabase'; // Adjust the import path as needed
import Modal from '@/components/Modal'; // Adjust the import path as needed

interface OrderListProps {
    session: Session | null;
    fetchQuotes: () => void;
    archiveQuote: (id: number) => Promise<void>;
    markAsComplete: (orderId: number) => Promise<void>;
    isAdmin: boolean; // Add this prop
}

type Order = Database['public']['Tables']['orders']['Row'] & {
    shippingquotes: Database['public']['Tables']['shippingquotes']['Row'];
};

const OrderList: React.FC<OrderListProps> = ({ session, fetchQuotes, archiveQuote, markAsComplete, isAdmin }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>('');

    const fetchOrders = useCallback(async () => {
        let query = supabase
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
            .neq('status', 'delivered'); // Exclude delivered orders

        if (!isAdmin && session?.user?.id) {
            query = query.eq('user_id', session.user.id);
        }

        const { data, error } = await query;

        if (error) {
            setErrorText(error.message);
        } else {
            console.log('Fetched Orders:', data);
            setOrders(data);
        }
    }, [session, isAdmin]);

    useEffect(() => {
        fetchOrders();
    }, [session, fetchOrders]);

    const confirmCancelOrder = async () => {
        if (selectedOrderId === null) return;

        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'cancelled', cancellation_reason: cancellationReason })
                .eq('id', selectedOrderId);

            if (error) {
                console.error('Error cancelling order:', error.message);
                setErrorText('Error cancelling order');
            } else {
                setOrders(orders.filter(order => order.id !== selectedOrderId));
                setIsModalOpen(false);
                setSelectedOrderId(null);
                setCancellationReason('');
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            setErrorText('Error cancelling order');
        }
    };

    const handleMarkAsComplete = async (orderId: number) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: 'delivered' })
                .eq('id', orderId);

            if (error) {
                console.error('Error marking order as complete:', error.message);
                setErrorText('Error marking order as complete');
            } else {
                setOrders(orders.filter(order => order.id !== orderId));
                fetchOrders(); // Fetch orders after marking as complete
            }
        } catch (error) {
            console.error('Error marking order as complete:', error);
            setErrorText('Error marking order as complete');
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
                                    <span><strong>Origin:</strong> {order.shippingquotes.origin_city}, {order.shippingquotes.origin_state} {order.shippingquotes.origin_zip}</span>
                                    <span><strong>Destination:</strong> {order.shippingquotes.destination_city}, {order.shippingquotes.destination_state} {order.shippingquotes.destination_zip}</span>
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
                                    <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="text-red-500 ml-2">
                                        Cancel Order
                                    </button>
                                    {isAdmin && (
                                        <button onClick={() => handleMarkAsComplete(order.id)} className="text-blue-500 ml-2">
                                            Order Completed
                                        </button>
                                    )}
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
                            <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="text-red-500 ml-2">
                                Cancel Order
                            </button>
                            {isAdmin && (
                                        <button onClick={() => handleMarkAsComplete(order.id)} className="text-blue-500 ml-2">
                                            Order Completed
                                        </button>
                           )}
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