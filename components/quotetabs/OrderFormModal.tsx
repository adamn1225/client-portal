import React, { useState } from 'react';

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: {
        originStreet: string;
        destinationStreet: string;
        earliestPickupDate: string;
        latestPickupDate: string;
        notes: string;
    }) => void;
}

const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [originStreet, setOriginStreet] = useState('');
    const [destinationStreet, setDestinationStreet] = useState('');
    const [earliestPickupDate, setEarliestPickupDate] = useState('');
    const [latestPickupDate, setLatestPickupDate] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ originStreet, destinationStreet, earliestPickupDate, latestPickupDate, notes });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-1/2">
                <h2 className="text-xl mb-4">Create Order</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label>Origin Street Address</label>
                        <input
                            type="text"
                            value={originStreet}
                            onChange={(e) => setOriginStreet(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-zinc-900"
                        />
                    </div>
                    <div>
                        <label>Destination Street Address</label>
                        <input
                            type="text"
                            value={destinationStreet}
                            onChange={(e) => setDestinationStreet(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-zinc-900"
                        />
                    </div>
                    <div>
                        <label>Earliest Pickup Date</label>
                        <input
                            type="date"
                            value={earliestPickupDate}
                            onChange={(e) => setEarliestPickupDate(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-zinc-900"
                        />
                    </div>
                    <div>
                        <label>Latest Pickup Date</label>
                        <input
                            type="date"
                            value={latestPickupDate}
                            onChange={(e) => setLatestPickupDate(e.target.value)}
                            required
                            className="rounded w-full p-2 border border-zinc-900"
                        />
                    </div>
                    <div>
                        <label>Notes / Extra Information</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="rounded w-full p-2 border border-zinc-900"
                        />
                    </div>
                    <button type="submit" className="btn-slate">
                        Submit
                    </button>
                </form>
                <button onClick={onClose} className="btn-slate mt-4">
                    Close
                </button>
            </div>
        </div>
    );
};

export default OrderFormModal;