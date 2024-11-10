import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import VendorForm from '@/components/procurement/VendorForm';
import { fetchVendorsData, addPurchaseOrder } from '@/lib/database';
import { Vendor, PurchaseOrder } from '@/lib/database.types';

const PurchaseOrderForm = () => {
  const [poNumber, setPoNumber] = useState('');
  const [status, setStatus] = useState(false);
  const [createdDate, setCreatedDate] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [vendorNumber, setVendorNumber] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

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

  const handleVendorAdded = async () => {
    const { data, error } = await fetchVendorsData();
    if (error) {
      console.error('Error fetching vendors:', error);
    } else {
      setVendors(data);
    }
    setIsVendorModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const purchaseOrder: Omit<PurchaseOrder, 'id'> = {
      poNumber,
      status,
      createdDate,
      expectedDate,
      vendorNumber,
      vendorName: vendors.find(v => v.vendornumber === vendorNumber)?.vendorname || ''
    };

    const { data, error } = await addPurchaseOrder(purchaseOrder);

    if (error) {
      console.error('Error inserting purchase order:', error);
    } else {
      console.log('Purchase order inserted:', data);
    }
  };

  return (
    <>
      <h2 className="text-xl underline text-start mb-6">Add Purchase Order</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Form fields */}
        <div className="flex gap-4 justify-around w-full">
          <div className="w-full">
            <label className="block text-sm font-medium">PO Number</label>
            <input
              type="text"
              value={poNumber}
              onChange={(e) => setPoNumber(e.target.value)}
              placeholder="PO Number"
              className="mt-1 pl-2 block w-full text-gray-950 placeholder:text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium">Status</label>
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              className="mt-1 pl-2 block w-full text-gray-950 placeholder:text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            />
          </div>
        </div>
        {/* Other form fields */}
        <div className="flex flex-col items-start w-full">
          <label className="block text-start text-sm font-medium w-4/5">Created Date</label>
          <input
            type="date"
            value={createdDate}
            onChange={(e) => setCreatedDate(e.target.value)}
            className="mt-1 pl-2 block w-4/5 border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label className="block text-start text-sm font-medium w-4/5">Expected Date</label>
          <input
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            className="mt-1 pl-2 block w-4/5 border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
          />
        </div>
        <div className="flex flex-col items-start w-full">
          <label className="block text-start text-sm font-medium w-4/5">Vendor</label>
          <div className="flex items-center w-4/5">
            <select
              value={vendorNumber}
              onChange={(e) => setVendorNumber(e.target.value)}
              className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
            >
              <option value="">Select Vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendornumber} value={vendor.vendornumber}>
                  {vendor.vendorname}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsVendorModalOpen(true)}
              className="light-dark-btn w-full max-w-max"
            >
              Add Vendor
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-gray-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-gray-900">
            Submit
          </button>
        </div>
      </form>
      <Modal isOpen={isVendorModalOpen} onClose={() => setIsVendorModalOpen(false)}>
        <VendorForm onVendorAdded={handleVendorAdded} />
      </Modal>
    </>
  );
};

export default PurchaseOrderForm;