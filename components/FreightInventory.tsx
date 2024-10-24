import React, { useState, useEffect } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database, MaintenanceItem } from '@/lib/schema';
import InventoryTab from '@/components/inventory/InventoryTab';
import MaintenanceTab from '@/components/inventory/MaintenanceTab';
import TransferToMaintenanceModal from '@/components/TransferToMaintenanceModal';
import { fetchMaintenanceItems, addMaintenanceItem } from '@/lib/database';

interface FreightInventoryProps {
    session: Session | null;
}

type Freight = Database['public']['Tables']['freight']['Row'];

const FreightInventory = ({ session }: FreightInventoryProps) => {
    const supabase = useSupabaseClient<Database>();
    const [freightList, setFreightList] = useState<Freight[]>([]);
    const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [yearAmount, setYearAmount] = useState<string>('');
    const [make, setMake] = useState<string>('');
    const [model, setModel] = useState<string>('');
    const [palletCount, setPalletCount] = useState<string>('');
    const [commodity, setCommodity] = useState<string>('');
    const [length, setLength] = useState<string>('');
    const [lengthUnit, setLengthUnit] = useState<string>('ft'); // Default to feet
    const [width, setWidth] = useState<string>('');
    const [widthUnit, setWidthUnit] = useState<string>('ft'); // Default to feet
    const [height, setHeight] = useState<string>('');
    const [heightUnit, setHeightUnit] = useState<string>('ft'); // Default to feet
    const [weight, setWeight] = useState<string>('');
    const [weightUnit, setWeightUnit] = useState<string>('lbs'); // Default to pounds
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [inventoryNumber, setInventoryNumber] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');
    const [editingFreight, setEditingFreight] = useState<Freight | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState('inventory');
    const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>([]);

    const user = session?.user;

    useEffect(() => {
        if (user) {
            fetchFreight();
            fetchMaintenance();
        }
    }, [user]);

    const fetchFreight = async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('freight')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            setErrorText(error.message);
        } else {
            setFreightList(data);
        }
    };

    const addOrUpdateFreight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        const freightData = {
            user_id: user.id,
            year_amount: yearAmount,
            make: make,
            model: model,
            pallet_count: palletCount,
            commodity: commodity,
            length: length,
            length_unit: lengthUnit,
            width: width,
            width_unit: widthUnit,
            height: height,
            height_unit: heightUnit,
            weight: weight,
            weight_unit: weightUnit,
            serial_number: serialNumber,
            inventory_number: inventoryNumber,
            freight_type: selectedOption
        };

        let response;
        if (editingFreight) {
            response = await supabase
                .from('freight')
                .update(freightData)
                .eq('id', editingFreight.id)
                .select();
        } else {
            response = await supabase
                .from('freight')
                .insert([freightData])
                .select();
        }

        const { data, error } = response;

        if (error) {
            console.error('Error adding/updating freight:', error.message);
            setErrorText('Error adding/updating freight');
        } else {
            setFreightList([...freightList.filter(f => f.id !== editingFreight?.id), ...(data || [])]);
            resetForm();
            setIsModalOpen(false);
        }
    };

    const deleteItem = async (id: number, table: 'freight' | 'maintenance') => {
        if (!user) return;

        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting from ${table}:`, error.message);
        } else {
            if (table === 'freight') {
                fetchFreight();
            } else {
                fetchMaintenance();
            }
        }
    };

    const handleDeleteClick = (id: number, table: 'freight' | 'maintenance') => {
        const confirmed = window.confirm(`Are you sure you want to delete this ${table} item?`);
        if (confirmed) {
            deleteItem(id, table);
        }
    };

    const editFreight = (freight: Freight) => {
        setEditingFreight(freight);
        setYearAmount(freight.year_amount || '');
        setMake(freight.make || '');
        setModel(freight.model || '');
        setPalletCount(freight.pallet_count || '');
        setCommodity(freight.commodity || '');
        setLength(freight.length || '');
        setLengthUnit(freight.length_unit || 'ft');
        setWidth(freight.width || '');
        setWidthUnit(freight.width_unit || 'ft');
        setHeight(freight.height || '');
        setHeightUnit(freight.height_unit || 'ft');
        setWeight(freight.weight || '');
        setWeightUnit(freight.weight_unit || 'lbs');
        setSerialNumber(freight.serial_number || '');
        setInventoryNumber(freight.inventory_number || '');
        setSelectedOption(freight.freight_type || '');
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingFreight(null);
        setYearAmount('');
        setMake('');
        setModel('');
        setPalletCount('');
        setCommodity('');
        setLength('');
        setLengthUnit('ft'); // Reset to default unit
        setWidth('');
        setWidthUnit('ft'); // Reset to default unit
        setHeight('');
        setHeightUnit('ft'); // Reset to default unit
        setWeight('');
        setWeightUnit('lbs'); // Reset to default unit
        setSerialNumber('');
        setInventoryNumber('');
        setSelectedOption('');
        setErrorText('');
    };

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const option = e.target.value;
        setSelectedOption(option);
        setErrorText('');
        if (option === 'ltl_ftl') {
            setLengthUnit('in');
            setWidthUnit('in');
            setHeightUnit('in');
        } else {
            setLengthUnit('ft');
            setWidthUnit('ft');
            setHeightUnit('ft');
        }
    };

    const fetchMaintenance = async () => {
        if (!user) return;

        const data = await fetchMaintenanceItems(user.id);
        setMaintenanceList(data);
    };

    const handleTransferToMaintenance = async (freight: Database['public']['Tables']['freight']['Row']) => {
        if (!user) return;
    
        // Check for duplicates in the maintenance table
        const { data: maintenanceList, error } = await supabase
            .from('maintenance')
            .select('*')
            .or(`inventory_number.eq.${freight.inventory_number},serial_number.eq.${freight.serial_number}`);
    
        if (error) {
            console.error('Error checking maintenance items:', error.message);
            return;
        }
    
        if (maintenanceList && maintenanceList.length > 0) {
            alert('This item is already in the maintenance list.');
            return;
        }
    
        setSelectedFreight(freight);
        setIsTransferModalOpen(true);
    };

    const handleTransferSubmit = async (data: any) => {
        const user = { id: data.user_id }; // Replace this with the actual user object or import it
        if (!user || !selectedFreight) return;

        const maintenanceItem: Omit<MaintenanceItem, 'id' | 'created_at'> = {
            user_id: user.id.toString(),
            freight_id: selectedFreight.id,
            urgency: data.urgency,
            notes: data.notes,
            need_parts: data.need_parts,
            part: data.part,
            maintenance_crew: data.maintenance_crew,
            schedule_date: data.schedule_date || null,
            make: selectedFreight.make,
            model: selectedFreight.model,
            year: selectedFreight.year,
            year_amount: selectedFreight.year_amount, // Ensure year_amount is included
            pallets: selectedFreight.pallet_count,
            serial_number: selectedFreight.serial_number,
            dimensions: selectedFreight.dimensions,
            commodity: selectedFreight.commodity,
            inventory_number: selectedFreight.inventory_number,
        };

        const newItem = await addMaintenanceItem(maintenanceItem);
        if (newItem) {
            setMaintenanceList([...maintenanceList, newItem]);
        }
        setIsTransferModalOpen(false);
    };

    const editMaintenanceItem = async (updatedItem: MaintenanceItem) => {
        if (!user) return;

        const { data, error } = await supabase
            .from('maintenance')
            .update(updatedItem)
            .eq('id', updatedItem.id)
            .select();

        if (error) {
            console.error('Error updating maintenance item:', error.message);
        } else {
            setMaintenanceList((prevList) =>
                prevList.map((item) => (item.id === updatedItem.id ? updatedItem : item))
            );
        }
    };

    

    return (
        <div className="w-full grid grid-rows gap-12 mt-12">
            <div className="w-full">
                <div className='flex flex-col justify-center items-center'>
                    <h1 className="mb-12 text-2xl text-center">Your Freight and Equipment</h1>
                    <button className="btn-slate" onClick={() => setIsModalOpen(true)}>
                        Add Inventory
                    </button>
                </div>
                <TransferToMaintenanceModal
                    isOpen={isTransferModalOpen}
                    onClose={() => setIsTransferModalOpen(false)}
                    onSubmit={handleTransferSubmit}
                    freight={selectedFreight}
                    maintenanceList={maintenanceList}
                    freightList={freightList}
                />
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-8 rounded shadow-md w-1/2">
                            <h2 className="text-xl mb-4">{editingFreight ? 'Edit Freight' : 'Add Freight'}</h2>
                            <form onSubmit={addOrUpdateFreight} className="flex flex-col w-full gap-2 my-2">
                                <div className='flex flex-col gap-4 w-full'>
                                    <label className='text-slate-900 font-medium'>Freight Type
                                        <select
                                            className="rounded w-full p-2 border border-slate-900"
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                        >
                                            <option value="">Select...</option>
                                            <option value="equipment">Equipment/Machinery</option>
                                            <option value="ltl_ftl">LTL/FTL</option>
                                        </select>
                                    </label>

                                    {selectedOption === 'equipment' && (
                                        <div className='flex gap-2 w-full'>
                                            <label className='text-slate-900 font-medium'>Year/Amount
                                                <input
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    type="text"
                                                    value={yearAmount}
                                                    onChange={(e) => {
                                                        setErrorText('');
                                                        setYearAmount(e.target.value);
                                                    }}
                                                />
                                            </label>
                                            <label className='text-slate-900 font-medium'>Make
                                                <input
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    type="text"
                                                    value={make}
                                                    onChange={(e) => {
                                                        setErrorText('');
                                                        setMake(e.target.value);
                                                    }}
                                                />
                                            </label>
                                            <label className='text-slate-900 font-medium'>Model
                                                <input
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    type="text"
                                                    value={model}
                                                    onChange={(e) => {
                                                        setErrorText('');
                                                        setModel(e.target.value);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    )}

                                    {selectedOption === 'ltl_ftl' && (
                                        <div className='flex gap-2 w-full'>
                                            <label className='text-slate-900 font-medium'>Pallet/Crate Count
                                                <input
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    type="text"
                                                    value={palletCount}
                                                    onChange={(e) => {
                                                        setErrorText('');
                                                        setPalletCount(e.target.value);
                                                    }}
                                                />
                                            </label>
                                            <label className='text-slate-900 font-medium'>Commodity
                                                <input
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    type="text"
                                                    value={commodity}
                                                    onChange={(e) => {
                                                        setErrorText('');
                                                        setCommodity(e.target.value);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    )}

                                    <div className='flex gap-2'>
                                        <label className='text-slate-900 font-medium'>Length
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={length}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setLength(e.target.value);
                                                }}
                                            />
                                            {selectedOption !== 'ltl_ftl' && (
                                                <select
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    value={lengthUnit}
                                                    onChange={(e) => setLengthUnit(e.target.value)}
                                                >
                                                    <option value="ft">Feet</option>
                                                    <option value="in">Inches</option>
                                                </select>
                                            )}
                                        </label>
                                        <label className='text-slate-900 font-medium'>Width
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={width}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setWidth(e.target.value);
                                                }}
                                            />
                                            {selectedOption !== 'ltl_ftl' && (
                                                <select
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    value={widthUnit}
                                                    onChange={(e) => setWidthUnit(e.target.value)}
                                                >
                                                    <option value="ft">Feet</option>
                                                    <option value="in">Inches</option>
                                                </select>
                                            )}
                                        </label>
                                        <label className='text-slate-900 font-medium'>Height
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={height}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setHeight(e.target.value);
                                                }}
                                            />
                                            {selectedOption !== 'ltl_ftl' && (
                                                <select
                                                    className="rounded w-full p-2 border border-slate-900"
                                                    value={heightUnit}
                                                    onChange={(e) => setHeightUnit(e.target.value)}
                                                >
                                                    <option value="ft">Feet</option>
                                                    <option value="in">Inches</option>
                                                </select>
                                            )}
                                        </label>
                                        <label className='text-slate-900 font-medium'>Weight
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={weight}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setWeight(e.target.value);
                                                }}
                                            />
                                            <select
                                                className="rounded w-full p-2 border border-slate-900"
                                                value={weightUnit}
                                                onChange={(e) => setWeightUnit(e.target.value)}
                                            >
                                                <option value="lbs">Pounds</option>
                                                <option value="T">Tons</option>
                                            </select>
                                        </label>
                                    </div>
                                    <div className='flex gap-2'>
                                        <label className='text-slate-900 font-medium'>Serial Number
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={serialNumber}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setSerialNumber(e.target.value);
                                                }}
                                            />
                                        </label>
                                        <label className='text-slate-900 font-medium'>Inventory Number
                                            <input
                                                className="rounded w-full p-2 border border-slate-900"
                                                type="text"
                                                value={inventoryNumber}
                                                onChange={(e) => {
                                                    setErrorText('');
                                                    setInventoryNumber(e.target.value);
                                                }}
                                            />
                                        </label>
                                    </div>
                                </div>
                                <button className="btn-slate" type="submit">
                                    {editingFreight ? 'Update Freight' : 'Add Freight'}
                                </button>
                                {editingFreight && (
                                    <button type="button" className="btn-slate mt-2" onClick={resetForm}>
                                        Cancel
                                    </button>
                                )}
                                <button type="button" className="btn-slate mt-2" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </button>
                            </form>
                        </div>
                    </div>
                )}
                {!!errorText && <div className="text-red-500">{errorText}</div>}
            </div>
            <div className="flex justify-center border-b border-gray-300">
                <button
                    className={`px-4 py-2 ${activeTab === 'inventory' ? 'border-b-2 border-amber-300' : ''}`}
                    onClick={() => setActiveTab('inventory')}
                >
                    Inventory
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'maintenance' ? 'border-b-2 border-amber-500' : ''}`}
                    onClick={() => setActiveTab('maintenance')}
                >
                    Maintenance
                </button>
            </div>
            <div className="w-full">
                {activeTab === 'inventory' && (
                    <InventoryTab
                        freightList={freightList}
                        editFreight={editFreight}
                        handleDeleteClick={(id) => handleDeleteClick(id, 'freight')}
                        handleTransferToMaintenance={handleTransferToMaintenance}
                        maintenanceList={maintenanceList}
                    />
                )}
                {activeTab === 'maintenance' && (
                    <MaintenanceTab
                        maintenanceList={maintenanceList}
                        editFreight={editMaintenanceItem}
                        handleDeleteClick={(id) => handleDeleteClick(id, 'maintenance')}
                        userId={String(user?.id)}
                        setMaintenanceList={(items: MaintenanceItem[]) => void setMaintenanceList(items)}
                        freightList={freightList}
                      />
                )}
            </div>
        </div>
    );
};

export default FreightInventory;