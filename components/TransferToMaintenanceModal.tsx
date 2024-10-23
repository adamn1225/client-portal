import React, { useState, useEffect } from 'react';
import { Database } from '@/lib/schema';

interface TransferToMaintenanceModalProps {
    freightList: Database['public']['Tables']['freight']['Row'][];
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    freight: any;
}

const TransferToMaintenanceModal: React.FC<TransferToMaintenanceModalProps> = ({ isOpen, onClose, onSubmit, freight }) => {
    const [urgency, setUrgency] = useState<string>('urgent');
    const [notes, setNotes] = useState<string>('');
    const [needParts, setNeedParts] = useState<string>('no');
    const [part, setPart] = useState<string>('');
    const [maintenanceCrew, setMaintenanceCrew] = useState<string>('Bob');
    const [scheduleDate, setScheduleDate] = useState<string>('');
    const [yearAmount, setYearAmount] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [palletCount, setPalletCount] = useState<string>('');
    const [commodity, setCommodity] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [weight, setWeight] = useState<string>('');

    useEffect(() => {
        if (freight) {
            setUrgency('urgent');
            setNotes('');
            setNeedParts('no');
            setPart('');
            setMaintenanceCrew('Bob');
            setScheduleDate('');
            setYearAmount(freight.year_amount || '');
            setMake(freight.make || '');
            setModel(freight.model || '');
            setPalletCount(freight.pallet_count || '');
            setCommodity(freight.commodity || '');
            setLength(freight.length || '');
            setWidth(freight.width || '');
            setHeight(freight.height || '');
            setWeight(freight.weight || '');
        }
    }, [freight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const maintenanceItem = {
            user_id: freight.user_id, // Ensure user_id is included
            freight_id: freight.id,
            urgency,
            notes,
            need_parts: needParts === 'yes',
            part: part || null,
            maintenance_crew: maintenanceCrew,
            schedule_date: scheduleDate || null, // Set to null if empty
            make: make || null,
            pallets: palletCount || null,
            serial_number: freight.serial_number || null,
            model: model || null,
            year_amount: yearAmount || null, // Ensure year_amount is included
            length: length || null,
            width: width || null,
            height: height || null,
            weight: weight || null,
            inventory_number: freight.inventory_number || null,
            commodity: commodity || null,
            dimensions: `${length} ${freight.length_unit}, ${width} ${freight.width_unit}, ${height} ${freight.height_unit}`,
        };
        onSubmit(maintenanceItem);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-1/2">
                <h2 className="text-xl mb-4">Transfer to Maintenance</h2>
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-2 my-2">
                    <div className="flex flex-col gap-4 w-full">
                        <label className="text-slate-900 font-medium">Urgency
                            <div className="flex gap-2">
                                <label>
                                    <input
                                        type="radio"
                                        value="urgent"
                                        checked={urgency === 'urgent'}
                                        onChange={() => setUrgency('urgent')}
                                    />
                                    Urgent
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        value="schedule"
                                        checked={urgency === 'schedule'}
                                        onChange={() => setUrgency('schedule')}
                                    />
                                    Schedule
                                </label>
                            </div>
                        </label>

                        {urgency === 'urgent' && (
                            <>
                                <label className="text-slate-900 font-medium">Notes
                                    <textarea
                                        className="rounded w-full p-2 border border-slate-900"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </label>
                                <label className="text-slate-900 font-medium">Do you need parts ordered?
                                    <div className="flex gap-2">
                                        <label>
                                            <input
                                                type="radio"
                                                value="yes"
                                                checked={needParts === 'yes'}
                                                onChange={() => setNeedParts('yes')}
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="no"
                                                checked={needParts === 'no'}
                                                onChange={() => setNeedParts('no')}
                                            />
                                            No
                                        </label>
                                    </div>
                                </label>
                                {needParts === 'yes' && (
                                    <label className="text-slate-900 font-medium">What is the part?
                                        <input
                                            className="rounded w-full p-2 border border-slate-900"
                                            type="text"
                                            value={part}
                                            onChange={(e) => setPart(e.target.value)}
                                        />
                                    </label>
                                )}
                            </>
                        )}

                        {urgency === 'schedule' && (
                            <>
                                <label className="text-slate-900 font-medium">Date to go for Maintenance
                                    <input
                                        className="rounded w-full p-2 border border-slate-900"
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                    />
                                </label>
                                <label className="text-slate-900 font-medium">Notes
                                    <textarea
                                        className="rounded w-full p-2 border border-slate-900"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                    />
                                </label>
                                <label className="text-slate-900 font-medium">Do you need parts ordered?
                                    <div className="flex gap-2">
                                        <label>
                                            <input
                                                type="radio"
                                                value="yes"
                                                checked={needParts === 'yes'}
                                                onChange={() => setNeedParts('yes')}
                                            />
                                            Yes
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                value="no"
                                                checked={needParts === 'no'}
                                                onChange={() => setNeedParts('no')}
                                            />
                                            No
                                        </label>
                                    </div>
                                </label>
                                {needParts === 'yes' && (
                                    <label className="text-slate-900 font-medium">What is the part?
                                        <input
                                            className="rounded w-full p-2 border border-slate-900"
                                            type="text"
                                            value={part}
                                            onChange={(e) => setPart(e.target.value)}
                                        />
                                    </label>
                                )}
                            </>
                        )}

                        <label className="text-slate-900 font-medium">Delegate task to Maintenance Team?
                            <select
                                className="rounded w-full p-2 border border-slate-900"
                                value={maintenanceCrew}
                                onChange={(e) => setMaintenanceCrew(e.target.value)}
                            >
                                <option value="Bob">Bob</option>
                                <option value="Billy">Billy</option>
                                <option value="Joe">Joe</option>
                            </select>
                        </label>
                    </div>
                    <button className="btn-slate" type="submit">Submit</button>
                    <button type="button" className="btn-slate mt-2" onClick={onClose}>Close</button>
                </form>
            </div>
        </div>
    );
};

export default TransferToMaintenanceModal;