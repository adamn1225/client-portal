import React, { useState } from 'react';
import Modal from '@/components/Modal';
import VendorForm from '@/components/procurement/VendorForm';

const Vendors = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const vendors = [
    // Example data
    { vendorNumber: 'V001', vendorName: 'Vendor A', businessStreet: '123 Main St', businessCity: 'New Hyde Park', businessState: 'NY', contact: { email: 'vendorA@example.com', phone: '123-456-7890' } },
    { vendorNumber: 'V002', vendorName: 'Vendor B', businessStreet: '456 Elm St', businessCity: 'Toms River', businessState: 'NJ', contact: { email: 'vendorB@example.com', phone: '987-654-3210' } },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Add Vendor
        </button>
      </div>
      <table className="w-full">
        <thead className="w-full">
          <tr className="space-x-12 bg-gray-900 text-stone-100 text-xs">
            <th className="px-10 border border-stone-200/50 tracking-wider">Vendor Number</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Vendor Name</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Business Address</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Contact</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {vendors.map((vendor, index) => (
            <tr className="space-x-12 border border-gray-900/50 text-sm font-medium" key={index}>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{vendor.vendorNumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{vendor.vendorName}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">
                <div>{vendor.businessStreet}</div>
                <div>{vendor.businessCity}, {vendor.businessState}</div>
              </td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">
                <div><span className="font-medium">Email: </span>{vendor.contact.email}</div>
                <div><span className="font-medium">Main Phone: </span>{vendor.contact.phone}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <VendorForm />
      </Modal>
    </div>
  );
};

export default Vendors;