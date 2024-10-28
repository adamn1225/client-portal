import React, { useState } from 'react';
import { Database } from '@/lib/schema';
import TransferToMaintenanceModal from '../TransferToMaintenanceModal';
import { addMaintenanceItem, fetchFreightData, addFreightItem } from '@/lib/database';
import { MaintenanceItem } from '@/lib/schema'; // Import the MaintenanceItem type

interface InventoryTabProps {
    freightList: Database['public']['Tables']['freight']['Row'][];
    maintenanceList: Database['public']['Tables']['maintenance']['Row'][];
    editFreight: (freight: Database['public']['Tables']['freight']['Row']) => void;
    handleDeleteClick: (id: number) => void;
    handleTransferToMaintenance: (freight: Database['public']['Tables']['freight']['Row']) => void;
    handleAddFreight: (freight: Database['public']['Tables']['freight']['Row']) => void; // Add this prop
}

const InventoryTab = ({ freightList = [], maintenanceList, editFreight, handleDeleteClick, handleTransferToMaintenance, handleAddFreight }: InventoryTabProps) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    const [selectedFreight, setSelectedFreight] = useState<Database['public']['Tables']['freight']['Row'] | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null); // Add error state

    const openTransferModal = (freight: Database['public']['Tables']['freight']['Row']) => {
        setSelectedFreight(freight);
        setIsTransferModalOpen(true);
    };

    const handleTransferSubmit = async (data: any) => {
        const user = { id: 'some-uuid' };
        if (!user || !selectedFreight) return;
        // Fetch the user ID from the maintenance or freight table
        const userId = selectedFreight.user_id;
        if (!userId) return;
        // Fetch the freight data from the API
        const freightData = await fetchFreightData(selectedFreight.id);
        if (!freightData) return;

        const maintenanceItem: Omit<MaintenanceItem, 'id' | 'created_at'> = {
            user_id: user.id.toString(),
            freight_id: selectedFreight.id,
            urgency: data.urgency,
            notes: data.notes,
            need_parts: data.need_parts,
            part: data.part,
            maintenance_crew: data.maintenance_crew,
            schedule_date: data.schedule_date || null,
            make: freightData.make,
            model: freightData.model,
            pallets: freightData.pallets,
            serial_number: freightData.serial_number,
            dimensions: freightData.dimensions,
            commodity: freightData.commodity,
            inventory_number: freightData.inventory_number,
            year: null,
            year_amount: freightData.year_amount,
        };

        try {
            const newItem = await addMaintenanceItem(maintenanceItem);
            if (newItem) {
                // Call the parent component's function to update the maintenance list
                handleTransferToMaintenance(newItem);
            }
            setIsTransferModalOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error adding maintenance item:', error.message);
            } else {
                console.error('Error adding maintenance item:', error);
            }
        }
    };

    const isInMaintenance = (freight: Database['public']['Tables']['freight']['Row']) => {
        return maintenanceList.some(item => item.inventory_number === freight.inventory_number || item.serial_number === freight.serial_number);
    };

    const handleAddFreightSubmit = async (freight: Database['public']['Tables']['freight']['Row']) => {
        try {
            const newFreight = await addFreightItem(freight);
            if (newFreight) {
                handleAddFreight(newFreight);
                setError(null); // Clear any previous error
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('unique constraint')) {
                    setError('Duplicate inventory number. Please use a unique inventory number.');
                } else {
                    setError('Error adding freight item: ' + error.message);
                }
            } else {
                setError('Error adding freight item.');
            }
        }
    };

    return (
        <div className="w-full bg-white shadow rounded-md border border-slate-400 max-h-max flex-grow">
            {error && <div className="text-red-500 p-4">{error}</div>} {/* Display error message */}
            <div className="hidden xl:block parent-container overflow-x-auto ">
                <table className="min-w-full divide-y  divide-gray-200">
                    <thead className="bg-gray-50 ">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Freight Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Dimensions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Serial Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Inventory Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {freightList.map((freight) => (
                            <tr key={freight.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.freight_type === 'ltl_ftl' ? freight.commodity : `${freight.year_amount} ${freight.make} ${freight.model}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.length} {freight.length_unit}, {freight.width} {freight.width_unit}, {freight.height} {freight.height_unit}, {freight.weight} {freight.weight_unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.serial_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.inventory_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between gap-6 relative">
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenDropdownId(openDropdownId === freight.id ? null : freight.id)}
                                            className="text-blue-500 mr-4"
                                        >
                                            Actions
                                        </button>
                                        {openDropdownId === freight.id && (
                                            <div className="absolute z-0 right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                                <button
                                                    onClick={() => {
                                                        editFreight(freight);
                                                        setOpenDropdownId(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteClick(freight.id);
                                                        setOpenDropdownId(null);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => openTransferModal(freight)}
                                        className={`${isInMaintenance(freight) ? 'text-red-400 cursor-not-allowed shadow-sm bg-slate-800 font-medium py-2 px-4 rounded text-center' : 'text-amber-300 bg-slate-800 shadow-sm font-medium py-2 px-4 rounded text-center'}`}
                                        disabled={isInMaintenance(freight)}
                                    >
                                        {isInMaintenance(freight) ? 'In Maintenance' : 'Add to Maintenance'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block xl:hidden">
                {freightList.map((freight) => (
                    <div key={freight.id} className="bg-white shadow rounded-md mb-4 p-4 border border-slate-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Inventory Number</div>
                            <div className="text-sm font-medium text-gray-900">{freight.inventory_number}</div>
                        </div>
                        <div className='border-b border-slate-600 mb-4'></div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Freight Item</div>
                            <div className="text-sm font-medium text-gray-900">{freight.freight_type === 'ltl_ftl' ? freight.commodity : `${freight.year_amount} ${freight.make} ${freight.model}`}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Dimensions</div>
                            <div className="text-sm font-medium text-gray-900">{freight.length} {freight.length_unit}, {freight.width} {freight.width_unit}, {freight.height} {freight.height_unit}, {freight.weight} {freight.weight_unit}</div>
                        </div>
                        <div className="flex flex-col md:flex-row justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Serial Number</div>
                            <div className="text-sm font-medium text-gray-900">{freight.serial_number}</div>
                        </div>
                        <div className="block justify-between items-center md:flex md:flex-col ">
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdownId(openDropdownId === freight.id ? null : freight.id)}
                                    className="text-blue-500 mr-4"
                                >
                                    Actions
                                </button>
                                {openDropdownId === freight.id && (
                                    <div className="absolute z-0 right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                                        <button
                                            onClick={() => {
                                                editFreight(freight);
                                                setOpenDropdownId(null);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-blue-500 hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDeleteClick(freight.id);
                                                setOpenDropdownId(null);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => openTransferModal(freight)}
                                className={`${isInMaintenance(freight) ? 'text-red-400 cursor-not-allowed shadow-sm bg-slate-800 font-medium py-2 px-4 rounded text-center ' : 'text-amber-300 bg-slate-800 shadow-sm font-medium py-1 px-3 rounded text-center'}`}
                                disabled={isInMaintenance(freight)}
                            >
                                {isInMaintenance(freight) ? 'Already in Maintenance' : 'Add to Maintenance'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isTransferModalOpen && selectedFreight && (
                <TransferToMaintenanceModal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    onSubmit={handleTransferSubmit}
                    freight={selectedFreight}
                    maintenanceList={maintenanceList}
                    freightList={freightList}
                />
            )}
        </div>
    );
};

export default InventoryTab;