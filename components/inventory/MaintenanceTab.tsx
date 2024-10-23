import React, { useState } from 'react';
import { MaintenanceItem } from '@/lib/types';
import EditMaintenanceModal from './EditMaintenanceModal';

interface MaintenanceTabProps {
    maintenanceList: MaintenanceItem[];
    editFreight: (freight: MaintenanceItem) => void;
    handleDeleteClick: (id: number) => void;
}

const MaintenanceTab = ({ maintenanceList = [], editFreight, handleDeleteClick }: MaintenanceTabProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedMaintenanceItem, setSelectedMaintenanceItem] = useState<MaintenanceItem | null>(null);

    const openEditModal = (maintenanceItem: MaintenanceItem) => {
        setSelectedMaintenanceItem(maintenanceItem);
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = (data: MaintenanceItem) => {
        editFreight(data);
        setIsEditModalOpen(false);
    };

    return (
        <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-max overflow-y-auto flex-grow">
            <div className="hidden xl:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Freight Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Dimensions</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Serial Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-slate-900/20">Inventory Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {maintenanceList.map((freight) => (
                            <tr key={freight.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.freight_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.urgency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.notes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.maintenance_crew}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                                    <button onClick={() => openEditModal(freight)} className="text-blue-500 mr-4">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="block xl:hidden">
                {maintenanceList.map((freight) => (
                    <div key={freight.id} className="bg-white shadow rounded-md mb-4 p-4 border border-slate-400">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Freight ID</div>
                            <div className="text-sm text-gray-900">{freight.freight_id}</div>
                        </div>
                        <div className='border-b border-slate-600 mb-4'></div>
                        <div className="flex flex-col justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Urgency</div>
                            <div className="text-sm font-medium text-gray-900">{freight.urgency}</div>
                        </div>
                        <div className="flex flex-col justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Notes</div>
                            <div className="text-sm font-medium text-gray-900">{freight.notes}</div>
                        </div>
                        <div className="flex flex-col justify-start items-stretch mb-2">
                            <div className="text-sm font-extrabold text-gray-500">Maintenance Crew</div>
                            <div className="text-sm font-medium text-gray-900">{freight.maintenance_crew}</div>
                        </div>
                        <div className="flex justify-between items-center">
                            <button onClick={() => openEditModal(freight)} className="text-blue-500 mr-4">
                                Edit
                            </button>
                            <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {isEditModalOpen && (
                <EditMaintenanceModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditSubmit}
                    maintenanceItem={selectedMaintenanceItem}
                />
            )}
        </div>
    );
};

export default MaintenanceTab;