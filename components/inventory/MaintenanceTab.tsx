import React, { useState, useEffect, useRef } from 'react';
import { MaintenanceItem } from '@/lib/types';
import { fetchMaintenanceItems } from '@/lib/database';
import EditMaintenanceModal from './EditMaintenanceModal';
import { Database } from '@/lib/schema';

interface MaintenanceTabProps {
    freightList: Database['public']['Tables']['freight']['Row'][];
    maintenanceList: MaintenanceItem[];
    editFreight: (freight: MaintenanceItem) => void;
    handleDeleteClick: (id: number) => void;
    userId: string;
    setMaintenanceList: (items: MaintenanceItem[]) => void;
}

const MaintenanceTab = ({ freightList, maintenanceList, editFreight, handleDeleteClick, userId, setMaintenanceList }: MaintenanceTabProps) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedMaintenanceItem, setSelectedMaintenanceItem] = useState<MaintenanceItem | null>(null);
    const hasFetchedData = useRef(false);

    // Define state variables for freight details
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
        if (!hasFetchedData.current) {
            const fetchData = async () => {
                const items = await fetchMaintenanceItems(userId); // Pass userId as argument
                console.log('Fetched maintenance items:', items); // Debugging log
                setMaintenanceList(items); // Use the function passed from the parent component
                hasFetchedData.current = true;
            };

            fetchData();
        }
    }, [userId, setMaintenanceList]);

    const openEditModal = (maintenanceItem: MaintenanceItem) => {
        const freight = freightList.find(f => f.id === maintenanceItem.freight_id);
        setSelectedMaintenanceItem(maintenanceItem);
        setYearAmount(freight?.year_amount || '');
        setMake(freight?.make || '');
        setModel(freight?.model || '');
        setPalletCount(freight?.pallet_count || '');
        setCommodity(freight?.commodity || '');
        setLength(freight?.length || '');
        setWidth(freight?.width || '');
        setHeight(freight?.height || '');
        setWeight(freight?.weight || '');
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
                    <thead className="bg-gray-50">
                        <tr className='border-b border-slate-900/20'>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Maintenance Item</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Parts Needed?</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Maintenance Notes</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Serial Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Inventory Number</th>                            
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-tight border-r border-slate-900/20">Assigned To</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {maintenanceList.map((freight) => (
                            <tr key={freight.id}>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.commodity || `${freight.year_amount} ${freight.make} ${freight.model}`}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.part}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.notes}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.serial_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.inventory_number}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap border-r border-slate-900/20">
                                    {freight.maintenance_crew}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex justify-between">
                                    <button onClick={() => openEditModal(freight)} className="text-blue-500 mr-4">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500 mr-4">
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
                        <div>
                            <div className="text-sm font-extrabold text-gray-500">Commodity</div>
                            <div className="text-sm font-medium text-gray-900">{freight.commodity || `${freight.year_amount} ${freight.make} ${freight.model}`}</div>
                        </div>
                        <div>
                            <div className="text-sm font-extrabold text-gray-500">Dimensions</div>
                            <div className="text-sm font-medium text-gray-900">{freight.dimensions}</div>
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
                            <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500 mr-4">
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