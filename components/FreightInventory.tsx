import React, { useState, useEffect, useCallback } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import Papa from 'papaparse';
import { Database, MaintenanceItem } from '@lib/database.types';
import InventoryTab from '@/components/inventory/InventoryTab';
import MaintenanceTab from '@/components/inventory/MaintenanceTab';
import TransferToMaintenanceModal from '@/components/TransferToMaintenanceModal';
import { checkDuplicateInventoryNumber, addFreightItem, addMaintenanceItem } from '@lib/database';

interface FreightInventoryProps {
    session: Session | null;
}

type Freight = Database['public']['Tables']['freight']['Row'];

const FreightInventory = ({ session }: FreightInventoryProps) => {
    const supabase = useSupabaseClient<Database>();
    const [freightList, setFreightList] = useState<Freight[]>([]);
    const [selectedFreight, setSelectedFreight] = useState<Freight | null>(null);
    const [isTransferModalOpen, setIsTransferModalOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('equipment'); // Default to "equipment"
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
    const [error, setError] = useState<string | null>(null);

    const user = session?.user;

    const fetchFreight = useCallback(async () => {
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
    }, [user, supabase]);
    const fetchMaintenance = useCallback(async () => {
        if (!user) return;

        const { data, error } = await supabase
            .from('maintenance')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            setErrorText(error.message);
        } else {
            setMaintenanceList(data);
        }
    }, [user, supabase]);

    useEffect(() => {
        if (user) {
            fetchFreight();
            fetchMaintenance();
        }
    }, [user, fetchFreight, fetchMaintenance]);

    useEffect(() => {
        if (user) {
            fetchFreight();
            fetchMaintenance();
        }
    }, [user, fetchFreight, fetchMaintenance]);

    const checkDuplicateInventoryNumber = async (inventoryNumber: string) => {
        const { data, error } = await supabase
            .from('freight')
            .select('inventory_number')
            .eq('inventory_number', inventoryNumber);

        if (error) {
            console.error('Error checking duplicate inventory number:', error);
            return false;
        }

        return data.length > 0;
    };



    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    console.log('Parsed results:', results); // Add logging to debug
                    const data = results.data as Database['public']['Tables']['freight']['Insert'][];
                    for (const item of data) {
                        if (item.inventory_number && await checkDuplicateInventoryNumber(item.inventory_number)) {
                            window.alert(`Duplicate inventory number found: ${item.inventory_number}. Please use unique inventory numbers.`);
                            continue;
                        }

                        // Set default values for units if not provided
                        item.length_unit = item.length_unit || 'ft';
                        item.width_unit = item.width_unit || 'ft';
                        item.height_unit = item.height_unit || 'ft';
                        item.weight_unit = item.weight_unit || 'lbs';
                        item.freight_type = item.freight_type || 'equipment'; // Default to "equipment"
                        item.user_id = user?.id || ''; // Add user_id from session

                        try {
                            const newFreight = await addFreightItem(item);
                            if (newFreight) {
                                setFreightList((prevList) => [...prevList, newFreight]);
                            }
                        } catch (error) {
                            console.error('Error adding freight item:', error);
                        }
                    }
                },
                error: (error) => {
                    console.error('Error parsing CSV file:', error);
                },
            });
        }
    };

    const addOrUpdateFreight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        // Check for duplicate inventory number
        if (await checkDuplicateInventoryNumber(inventoryNumber)) {
            window.alert('Duplicate inventory number. Please use a unique inventory number.');
            return;
        }

        const freightData = {
            user_id: user.id,
            year: yearAmount,
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
            console.error('Error adding/updating Inventory:', error.message);
            setErrorText('Error adding/updating Inventory');
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
        setYearAmount(freight.year || '');
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
        setSelectedOption('equipment'); // Reset to default option
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


        function handleAddFreight(freight: { id: number; inserted_at: string; is_complete: boolean | null; freight_type: string | null; make: string | null; model: string | null; year: string | null; pallets: string | null; serial_number: string | null; dimensions: string | null; freight_id: string | null; freight_class: string | null; status: string | null; user_id: string; due_date: string | null; in_progress: boolean | null; reminder_time: string | null; year_amount: string | null; pallet_count: string | null; commodity: string | null; length: string | null; length_unit: string | null; width: string | null; width_unit?: string | null | undefined; height: string | null; height_unit?: string | null | undefined; weight: string | null; weight_unit: string | null; inventory_number: string | null; }): void {
            throw new Error('Function not implemented.');
        }

    return (
        <div className="w-full grid grid-rows md:gap-6 md:mt-6">
            <div className="w-full">
                <div className='flex flex-col justify-center items-center'>
                    <h1 className="xs:text-md mb-2 text-xl md:text-2xl font-semibold text-center">Your Inventory/Equipment</h1>
                    
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
                    <div className="fixed inset-0 dark:text-slate-100  z-50 h-full bg-gray-100 bg-opacity-50 flex justify-center items-center ">
                        <div className="dark:text-slate-100 dark:bg-slate-700 border border-slate-700/20 shadow-lg bg-gray-100 z-50 p-4 md:p-8 h-[770px] max-h-max my-16 rounded  w-full md:w-1/2 overflow-y-auto">
                            <h2 className="text-xl dark:text-slate-100 mb-4 ">{editingFreight ? 'Edit Inventory' : 'Add Inventory'}</h2>
                            <form onSubmit={addOrUpdateFreight} className="flex  bg-gray-100 flex-col w-full gap-2 my-2 dark:bg-slate-700 dark:text-slate-100">
                                <div className='flex flex-col gap-4 w-full dark:text-slate-100'>
                                    <label className='text-slate-900 font-medium dark:text-slate-100'>Inventory Type
                                        <select
                                            className="rounded w-full p-2 border border-slate-900"
                                            value={selectedOption}
                                            onChange={handleOptionChange}
                                        >
                                            <option value="">Select...</option>
                                            <option value="equipment">Equipment/Machinery</option>
                                            <option value="ltl_ftl">Commodity (pallets, crates, loose parts, etc.)</option>
                                        </select>
                                    </label>

                                    {selectedOption === 'equipment' && (
                                        <div className='md:flex gap-2 w-full'>
                                            <label className='dark:text-slate-dark:text-slate-100 font-medium'>Year/Amount
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
                                            <label className='dark:text-slate-100 font-medium'>Make
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
                                            <label className='dark:text-slate-100 font-medium'>Model
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
                                            <label className='dark:text-slate-100 font-medium'>Pallet/Crate Count
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
                                            <label className='dark:text-slate-100 font-medium'>Commodity
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

                                    <div className='md:flex gap-2'>
                                        <label className='dark:text-slate-100 font-medium'>Length
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
                                        <label className='dark:text-slate-100 font-medium'>Width
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
                                        <label className='dark:text-slate-100 font-medium'>Height
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
                                        <label className='dark:text-slate-100 font-medium'>Weight
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
                                        <label className='dark:text-slate-100 font-medium'>Serial Number
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
                                        <label className='dark:text-slate-100 font-medium'>Inventory Number
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
                                <button className="btn-slate dark:text-slate-100 dark:bg-gray-900 dark:hover:bg-amber-400 dark:hover:text-gray-800 mt-4 shadow-xl" type="submit">
                                    {editingFreight ? 'Update Inventory' : 'Add Inventory'}
                                </button>
                                {editingFreight && (
                                    <button type="button" className="btn-slate mt-2 shadow-md hover:bg-stone-300/50 hover:text-slate-700" onClick={resetForm}>
                                        Close
                                    </button>
                                )}
                                <button type="button" className="bg-stone-300  text-slate-800 py-2 px-4 font-semibold mt-2 hover:bg-stone-300/50 hover:text-slate-700" onClick={() => setIsModalOpen(false)}>
                                    Close
                                </button>
                            </form>

                        </div>
                    </div>
                )}
                {!!errorText && <div className="text-red-500">{errorText}</div>}
                
            </div>

            <div className='flex flex-col gap-2 justify-center items-center w-full'>
                <div className='flex md:flex-row flex-col-reverse gap-2 justify-between items-center w-full'>
                    <div className="mt-4 md:m-0">
                        <button className="light-dark-btn dark-light-btn" onClick={() => setIsModalOpen(true)}>
                            Add Inventory Item
                        </button>
                    </div>
                    <div className="mt-4 md:m-0">
                        <label className="custom-file-upload">
                                <input className='hidden' type="file" accept=".csv" onChange={handleFileUpload} />
                                <span className="upload-button">Upload CSV</span>
                        
                        </label>
                    </div>
                    {errorText && <div className="text-red-500">{errorText}</div>}

                </div>

            <div className="flex justify-center w-full border-b border-gray-300">
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

            </div>
            <div className="w-full">
                {activeTab === 'inventory' && (
                    <InventoryTab
                        freightList={freightList}
                        editFreight={editFreight}
                        handleDeleteClick={(id) => handleDeleteClick(id, 'freight')}
                        handleTransferToMaintenance={handleTransferToMaintenance}
                        maintenanceList={maintenanceList}
                        handleAddFreight={addFreightItem}
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