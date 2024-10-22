import React, { useState, useEffect } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface FreightInventoryProps {
  session: Session | null;
}

type Freight = Database['public']['Tables']['freight']['Row'];

const FreightInventory = ({ session }: FreightInventoryProps) => {
  const supabase = useSupabaseClient<Database>();
  const [freightList, setFreightList] = useState<Freight[]>([]);
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

  const user = session?.user;

  useEffect(() => {
    if (user) {
      fetchFreight();
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

  const deleteFreight = async (id: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('freight')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting freight:', error.message);
    } else {
      fetchFreight();
    }
  };

  const handleDeleteClick = (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this freight item?');
    if (confirmed) {
      deleteFreight(id);
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

  return (
    <div className="w-full grid grid-rows-1 gap-12">
      <div className="w-full">
        <div className='flex flex-col justify-center items-center'>
          <h1 className="mb-6 text-2xl">Your Freight and Equipment</h1>
          <button className="btn-slate" onClick={() => setIsModalOpen(true)}>
            Add Freight
          </button>
        </div>
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
      <div className="w-full bg-white shadow overflow-hidden rounded-md border border-slate-400 max-h-max overflow-y-auto flex-grow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
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
                  <button onClick={() => handleDeleteClick(freight.id)} className="text-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreightInventory;