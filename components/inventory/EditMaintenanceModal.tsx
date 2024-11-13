import React, { useState } from 'react';
import { MaintenanceItem } from '@/lib/database.types';

interface EditMaintenanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: MaintenanceItem) => void;
    maintenanceItem: MaintenanceItem | null;
}

const EditMaintenanceModal: React.FC<EditMaintenanceModalProps> = ({ isOpen, onClose, onSubmit, maintenanceItem }) => {
    const [urgency, setUrgency] = useState(maintenanceItem?.urgency || '');
    const [notes, setNotes] = useState(maintenanceItem?.notes || '');
    const [needParts, setNeedParts] = useState(maintenanceItem?.need_parts || false);
    const [part, setPart] = useState(maintenanceItem?.part || '');
    const [maintenanceCrew, setMaintenanceCrew] = useState(maintenanceItem?.maintenance_crew || '');
    const [scheduleDate, setScheduleDate] = useState(maintenanceItem?.schedule_date || '');

    const handleSubmit = () => {
        if (maintenanceItem) {
            onSubmit({
                ...maintenanceItem,
                urgency,
                notes,
                need_parts: needParts,
                part,
                maintenance_crew: maintenanceCrew,
                schedule_date: scheduleDate || null, // Set to null if empty
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-zinc-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-1/2">
                <h2 className="text-xl mb-4">Edit Maintenance</h2>
                <form className="flex flex-col w-full gap-2 my-2">
                    <label className='text-zinc-900 font-medium'>Urgency
                        <input
                            className="rounded w-full p-2 border border-zinc-900"
                            type="text"
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                        />
                    </label>
                    <label className='text-zinc-900 font-medium'>Notes
                        <textarea
                            className="rounded w-full p-2 border border-zinc-900"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </label>
                    <label htmlFor='needParts' className='text-zinc-900 font-medium flex items-center gap-2'>
                        Parts Needed?
                        <input
                            className="rounded p-6 border border-zinc-900"
                            name='needParts'
                            type="checkbox"
                            checked={needParts}
                            onChange={(e) => setNeedParts(e.target.checked)}
                        />
                    </label>
                    {needParts && (
                        <label className='text-zinc-900 font-medium'>Part
                            <input
                                className="rounded w-full p-2 border border-zinc-900"
                                type="text"
                                value={part}
                                onChange={(e) => setPart(e.target.value)}
                            />
                        </label>
                    )}
                    <label className='text-zinc-900 font-medium'>Maintenance Crew
                        <input
                            className="rounded w-full p-2 border border-zinc-900"
                            type="text"
                            value={maintenanceCrew}
                            onChange={(e) => setMaintenanceCrew(e.target.value)}
                        />
                    </label>
                    <label className='text-zinc-900 font-medium'>Schedule Date
                        <input
                            className="rounded w-full p-2 border border-zinc-900"
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                        />
                    </label>
                    <button type="button" className="btn-slate mt-2" onClick={handleSubmit}>
                        Save
                    </button>
                    <button type="button" className="btn-slate mt-2" onClick={onClose}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditMaintenanceModal;