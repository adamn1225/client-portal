import React, { useEffect, useState, useCallback } from 'react';
import { Session } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/initSupabase';
import Modal from '@/components/Modal';
import jsPDF from 'jspdf';

interface OrderListProps {
    session: Session | null;
    fetchQuotes: () => void;
    archiveQuote: (id: number) => Promise<void>;
    markAsComplete: (orderId: number) => Promise<void>;
    isAdmin: boolean; // Add this prop
}

type ShippingQuote = {
    commodity: string;
    destination_city: string;
    destination_state: string;
    destination_street: string;
    destination_zip: string;
    due_date: string | null;
    email: string | null;
    first_name: string | null;
    height: string | null;
    id: number;
    inserted_at: string | null;
    is_archived: boolean | null;
    is_complete: boolean | null;
    last_name: string | null;
    length: string | null;
    make: string | null;
    model: string | null;
    origin_city: string | null;
    origin_state: string | null;
    origin_street: string | null;
    origin_zip: string | null;
    pallet_count: string | null;
    price: number | null;
    quote_id: string | null;
    user_id: string | null;
    weight: string | null;
    width: string | null;
    year_amount: string | null;
};

type Order = {
    id: number;
    status: string;
    user_id: string;
    origin_street: string;
    destination_street: string;
    shippingquotes: ShippingQuote;
};

const OrderList: React.FC<OrderListProps> = ({ session, fetchQuotes, archiveQuote, markAsComplete, isAdmin }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [errorText, setErrorText] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [cancellationReason, setCancellationReason] = useState<string>('');
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [editData, setEditData] = useState<Partial<Order>>({});

    const fetchOrders = useCallback(async () => {
        let query = supabase
            .from('orders')
            .select(`
            *,
            shippingquotes (*)
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
            const mappedOrders = data.map((order: any) => ({
                ...order,
                shippingquotes: order.shippingquotes[0], // Assuming you want the first shipping quote
            }));
            setOrders(mappedOrders); // Ensure the data is cast to the correct type
        }
    }, [session, isAdmin]);

    useEffect(() => {
        fetchOrders();
    }, [session, fetchOrders]);

    const generatePDF = (order: Order) => {
        const doc = new jsPDF();
        doc.text(`Order Receipt`, 10, 10);
        doc.text(`Order ID: ${order.id}`, 10, 20);
        doc.text(`Origin: ${order.origin_street}, ${order.shippingquotes.origin_city}, ${order.shippingquotes.origin_state} ${order.shippingquotes.origin_zip}`, 10, 30);
        doc.text(`Destination: ${order.destination_street}, ${order.shippingquotes.destination_city}, ${order.shippingquotes.destination_state} ${order.shippingquotes.destination_zip}`, 10, 40);
        doc.text(`Freight: ${order.shippingquotes.year_amount} ${order.shippingquotes.make} ${order.shippingquotes.model}`, 10, 50);
        doc.text(`Shipping Date: ${order.shippingquotes.due_date || 'No due date'}`, 10, 60);
        doc.text(`Price: ${order.shippingquotes.price ? `$${order.shippingquotes.price}` : 'Not priced yet'}`, 10, 70);
        return doc;
    };

    const uploadPDFToSupabase = async (pdf: jsPDF, order: Order) => {
        const pdfBlob = pdf.output('blob');
        const fileName = `receipts/${order.id}.pdf`;
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(fileName, pdfBlob);

        if (error) {
            throw new Error(error.message);
        }

        return data.path;
    };

    const insertDocumentRecord = async (filePath: string, order: Order) => {
        const { error } = await supabase
            .from('documents')
            .insert({
                user_id: order.user_id,
                title: `Receipt for Order ${order.id}`,
                description: `Receipt for Order ${order.id}`,
                file_name: `${order.id}.pdf`,
                file_type: 'application/pdf',
                file_url: filePath,
            });

        if (error) {
            throw new Error(error.message);
        }
    };

    const handleMarkAsComplete = async (orderId: number) => {
        try {
            const order = orders.find(order => order.id === orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            const pdf = generatePDF(order);
            const filePath = await uploadPDFToSupabase(pdf, order);
            await insertDocumentRecord(filePath, order);

            const { error } = await supabase
                .from('orders')
                .update({ status: 'completed' }) // Ensure status is updated to 'completed'
                .eq('id', orderId);

            if (error) {
                console.error('Error marking order as complete:', error.message);
                setErrorText('Error marking order as complete');
            } else {
                setOrders(orders.filter(order => order.id !== orderId)); // Remove the completed order from the state
                fetchOrders(); // Fetch orders after marking as complete
            }
        } catch (error) {
            console.error('Error marking order as complete:', error);
            setErrorText('Error marking order as complete. Please check your internet connection and try again.');
        }
    };

    const handleEditOrder = (order: Order) => {
        setIsEditMode(true);
        setEditData(order);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOrderId === null) return;

        try {
            const { error } = await supabase
                .from('orders')
                .update(editData)
                .eq('id', selectedOrderId);

            if (error) {
                console.error('Error editing order:', error.message);
                setErrorText('Error editing order');
            } else {
                setOrders(orders.map(order => (order.id === selectedOrderId ? { ...order, ...editData } : order)));
                setIsModalOpen(false);
                setSelectedOrderId(null);
                setEditData({});

                // Send email notification
                await sendEmailNotification(
                    'noah@ntslogistics.com', // Replace with your email
                    'Order Edited',
                    `Order ID: ${selectedOrderId} has been edited.\nChanges: ${JSON.stringify(editData, null, 2)}`
                );
            }
        } catch (error) {
            console.error('Error editing order:', error);
            setErrorText('Error editing order. Please check your internet connection and try again.');
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

                // Send email notification
                await sendEmailNotification(
                    'noah@ntslogistics.com', // Replace with your email
                    'Order Cancelled',
                    `Order ID: ${selectedOrderId} has been cancelled.\nReason: ${cancellationReason}`
                );
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            setErrorText('Error cancelling order. Please check your internet connection and try again.');
        }
    };

    return (
        <div className="w-full bg-white dark:bg-zinc-800 dark:text-zinc-100 shadow rounded-md border border-zinc-400 max-h-max flex-grow">
            {!!errorText && <div className="text-red-500">{errorText}</div>}
            <div className="hidden 2xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200 dark:text-zinc-900">
                    <thead className="bg-zinc-50 sticky top-0 z-10 dark:bg-zinc-800 dark:text-zinc-100">
                        <tr className='border-b border-zinc-900/20 dark:border-zinc-100'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Origin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Freight</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Shipping Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider border-r border-zinc-900/20 dark:border-zinc-100">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-white uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200 dark:bg-zinc-800 dark:text-zinc-100">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    {order.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100">
                                    <div className="flex flex-col justify-start">
                                        <span><strong>Origin Address:</strong>  {order.origin_street} </span>
                                        <span><strong>Origin City/State/Zip:</strong> {order.shippingquotes.origin_city}, {order.shippingquotes.origin_state} {order.shippingquotes.origin_zip}</span>
                                        <span><strong>Destination Address:</strong>  {order.destination_street} </span>
                                        <span><strong>Destination City/State/Zip:</strong> {order.shippingquotes.destination_city}, {order.shippingquotes.destination_state} {order.shippingquotes.destination_zip}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100 ">
                                    {order.shippingquotes.year_amount} {order.shippingquotes.make} {order.shippingquotes.model}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100 ">
                                    {order.shippingquotes.due_date || 'No due date'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-zinc-900/20 dark:border-zinc-100 ">
                                    {order.shippingquotes.price ? `$${order.shippingquotes.price}` : 'coming soon'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-evenly">
                                    <button onClick={() => handleEditOrder(order)} className="text-blue-600 dark:text-blue-400 ml-2">
                                        Edit Order
                                    </button>
                                    <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="text-red-500 ml-2">
                                        Cancel Order
                                    </button>
                                    {isAdmin && (
                                        <>
                                            <button onClick={() => handleMarkAsComplete(order.id)} className="text-green-600 ml-2">
                                                Order Completed
                                            </button>
                                            <button onClick={() => handleEditOrder(order)} className="text-blue-600 dark:text-blue-400 ml-2">
                                                Edit Order
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block 2xl:hidden mt-">
                <div className='mt-1'>
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-zinc-800 shadow rounded-md mb-4 p-4 border border-zinc-400 dark:text-white">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-extrabold dark:text-white">ID</div>
                                <div className="text-sm font-medium text-zinc-900">{order.id}</div>
                            </div>
                            <div className='border-b border-zinc-600 mb-4'></div>
                            <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                                <div className="text-sm font-extrabold text-zinc-500 dark:text-white">Origin</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{order.origin_street} {order.shippingquotes.origin_city}, {order.shippingquotes.origin_state} {order.shippingquotes.origin_zip}</div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                                <div className="text-sm font-extrabold text-zinc-500 dark:text-white">Destination</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{order.destination_street} {order.shippingquotes.destination_city}, {order.shippingquotes.destination_state} {order.shippingquotes.destination_zip}</div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                                <div className="text-sm font-extrabold text-zinc-500 dark:text-white">Freight</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{order.shippingquotes.year_amount} {order.shippingquotes.make} {order.shippingquotes.model}</div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                                <div className="text-sm font-extrabold text-zinc-500 dark:text-white">Shipping Date</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{order.shippingquotes.due_date || 'No due date'}</div>
                            </div>
                            <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                                <div className="text-sm font-extrabold text-zinc-500 dark:text-white">Price</div>
                                <div className="text-sm font-medium text-zinc-900 dark:text-white">{order.shippingquotes.price ? `$${order.shippingquotes.price}` : 'coming soon'}</div>
                            </div>
                            <div className="flex justify-between items-center">
                                <button onClick={() => handleEditOrder(order)} className="text-blue-600 dark:text-blue-400 ml-2">
                                    Edit Order
                                </button>
                                <button onClick={() => { setSelectedOrderId(order.id); setIsModalOpen(true); }} className="text-red-500 ml-2">
                                    Cancel Order
                                </button>
                                {isAdmin && (
                                    <>
                                        <button onClick={() => handleMarkAsComplete(order.id)} className="text-green-600 ml-2">
                                            Order Completed
                                        </button>
                                        <button onClick={() => handleEditOrder(order)} className="text-blue-600 dark:text-blue-400 ml-2">
                                            Edit Order
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="text-xl mb-4">Are you sure you want to cancel the order?</h2>
                <button onClick={confirmCancelOrder} className="bg-red-500 text-white px-4 py-2 rounded mr-2">
                    Yes
                </button>
                <button onClick={() => setIsModalOpen(false)} className="bg-zinc-500 text-white px-4 py-2 rounded">
                    No
                </button>
                {selectedOrderId !== null && (
                    <div className="mt-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-zinc-700">
                            Reason for cancellation:
                        </label>
                        <input
                            type="text"
                            id="reason"
                            value={cancellationReason}
                            onChange={(e) => setCancellationReason(e.target.value)}
                            className="mt-1 p-2 border border-zinc-300 rounded w-full"
                        />
                    </div>
                )}
            </Modal>
            {isEditMode && (
                <Modal isOpen={isEditMode} onClose={() => setIsEditMode(false)}>
                    <h2 className="text-xl mb-4">Edit Order</h2>
                    <form onSubmit={handleEditSubmit}>
                        <div className="mb-4">
                            <label htmlFor="origin_street" className="block text-sm font-medium text-zinc-700">
                                Origin Street
                            </label>
                            <input
                                type="text"
                                id="origin_street"
                                name="origin_street"
                                value={editData.origin_street || ''}
                                onChange={handleEditChange}
                                className="mt-1 p-2 border border-zinc-300 rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="destination_street" className="block text-sm font-medium text-zinc-700">
                                Destination Street
                            </label>
                            <input
                                type="text"
                                id="destination_street"
                                name="destination_street"
                                value={editData.destination_street || ''}
                                onChange={handleEditChange}
                                className="mt-1 p-2 border border-zinc-300 rounded w-full"
                            />
                        </div>
                        <button onClick={handleEditSubmit} className="btn-slate">
                            Submit Changes
                        </button>
                    </form>
                </Modal>
            )}

        </div>
    );
};

export default OrderList;