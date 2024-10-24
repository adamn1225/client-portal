import React, { useState } from 'react';
import { Database } from '@/lib/schema';
import TransferToMaintenanceModal from '../TransferToMaintenanceModal';
import { addMaintenanceItem, fetchFreightData } from '@/lib/database';
import { MaintenanceItem } from '@/lib/schema'; // Import the MaintenanceItem type

interface InventoryTabProps {
    freightList: Database['public']['Tables']['freight']['Row'][];
    maintenanceList: Database['public']['Tables']['maintenance']['Row'][];
    editFreight: (freight: Database['public']['Tables']['freight']['Row']) => void;
    handleDeleteClick: (id: number) => void;
    handleTransferToMaintenance: (freight: Database['public']['Tables']['freight']['Row']) => void;
}

const InventoryTab = ({ freightList = [], maintenanceList, editFreight, handleDeleteClick, handleTransferToMaintenance }: InventoryTabProps) => {
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    const [selectedFreight, setSelectedFreight] = useState<Database['public']['Tables']['freight']['Row'] | null>(null);

    const openTransferModal = (freight: Database['public']['Tables']['freight']['Row']) => {
        setSelectedFreight(freight);
        setIsTransferModalOpen(true);
    };

    const handleTransferSubmit = async (data: any) => {
        const user = { id: 'some-uuid' }; // Replace 'some-uuid' with the actual user ID or import the user object
        if (!user || !selectedFreight) return;
        // Fetch the user ID from the maintenance or freight table
        const userId = selectedFreight.user_id; // Assuming user_id is a field in the freight table
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

    return (
        <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-max overflow-y-auto flex-grow">
            <div className="hidden xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
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
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                                    <button onClick={() => editFreight(freight)} className="text-blue-500 mr-4">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500 mr-4">
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => openTransferModal(freight)}
                                        className={`${isInMaintenance(freight) ? 'text-amber-500 cursor-not-allowed' : 'text-green-500'}`}
                                        disabled={isInMaintenance(freight)}
                                    >
                                        {isInMaintenance(freight) ? 'Already in Maintenance' : 'Transfer to Maintenance'}
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
                        <div className="flex justify-between items-center">
                            <button onClick={() => editFreight(freight)} className="text-blue-500 mr-4">
                                Edit
                            </button>
                            <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500 mr-4">
                                Delete
                            </button>
                            <button
                                onClick={() => openTransferModal(freight)}
                                className={`${isInMaintenance(freight) ? 'text-amber-500 cursor-not-allowed' : 'text-green-500'}`}
                                disabled={isInMaintenance(freight)}
                            >
                                {isInMaintenance(freight) ? 'Already in Maintenance' : 'Transfer to Maintenance'}
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