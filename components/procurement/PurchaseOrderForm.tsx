import React, { useState, useEffect } from 'react';
import { fetchVendorsData, addPurchaseOrder } from '@/lib/database';
import { Vendor, PurchaseOrder } from '@/lib/schema';

interface PurchaseOrderFormProps {
  onSubmit: (order: Omit<PurchaseOrder, 'id'>) => void;
  userId: string;
}

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onSubmit, userId }) => {
  const [poNumber, setPoNumber] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [vendorNumber, setVendorNumber] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      const { data, error } = await fetchVendorsData();
      if (error) {
        console.error('Error fetching vendors:', error);
      } else {
        setVendors(data);
      }
    };

    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const purchaseOrder: Omit<PurchaseOrder, 'id'> = {
      ponumber: poNumber,
      status: 'pending', // Set status to pending by default
      createddate: createdDate,
      expecteddate: expectedDate,
      vendornumber: vendorNumber,
      order_description: orderDescription,
      vendorname: vendors.find(v => v.vendornumber === vendorNumber)?.vendorname || '',
      user_id: userId // Include user_id
    };

    onSubmit(purchaseOrder);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl underline text-start mb-6">Add Purchase Order</h2>
      <div className="flex gap-4 justify-around w-full">
        <div className="w-full">
          <label className="block text-sm font-medium">PO Number</label>
          <input
            type="text"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            placeholder="PO Number"
            className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-900 border border-zinc-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Order Description</label>
        <textarea
          value={orderDescription}
          onChange={(e) => setOrderDescription(e.target.value)}
          placeholder="Order Description"
          className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-900 border border-zinc-300 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm" />
      </div>
      <div className="flex flex-col items-start w-full">
        <label className="block text-start text-sm font-medium w-4/5">Created Date</label>
        <input
          type="date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
          className="mt-1 pl-2 block w-4/5 border border-zinc-300 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-900 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div className="flex flex-col items-start w-full">
        <label className="block text-start text-sm font-medium w-4/5">Expected Date</label>
        <input
          type="date"
          value={expectedDate}
          onChange={(e) => setExpectedDate(e.target.value)}
          className="mt-1 pl-2 block w-4/5 border border-zinc-300 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-900 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
        />
      </div>
      <div className="flex flex-col items-start w-full">
        <label className="block text-start text-sm font-medium w-4/5">Vendor</label>
        <div className="flex items-center gap-2 w-4/5">
          <select
            value={vendorNumber}
            onChange={(e) => setVendorNumber(e.target.value)}
            className="mt-1 pl-2 block w-full border-zinc-300 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-900 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
          >
            <option value="">Select Vendor</option>
            {vendors.map((vendor) => (
              <option key={vendor.vendornumber} value={vendor.vendornumber}>
                {vendor.vendorname}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-zinc-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-zinc-900">
          Submit
        </button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;