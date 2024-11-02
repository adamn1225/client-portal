import React from 'react';

const PurchaseOrders = () => {
  const purchaseOrders = [
    // Example data
    { poNumber: 'PO123', status: 'Pending', createdDate: '2023-01-01', expectedDate: '2023-01-10', vendorNumber: 'V001', vendorName: 'Vendor A' },
    { poNumber: 'PO124', status: 'Completed', createdDate: '2023-01-02', expectedDate: '2023-01-11', vendorNumber: 'V002', vendorName: 'Vendor B' },
  ];

  return (
    <div className="w-full">
      <table className="w-full">
        <thead className="w-full">
          <tr className="space-x-12 bg-gray-900 text-stone-100 text-xs">
            <th className="px-10 border border-stone-200/50 tracking-wider">PO Number</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Status</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Created Date</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Expected Date</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Vendor Number</th>
            <th className="px-10 border border-stone-200/50 tracking-wider">Vendor Name</th>
          </tr>
        </thead>
        <tbody  className="w-full ">
          {purchaseOrders.map((order, index) => (
            <tr className="space-x-12 border border-gray-900/50 text-sm font-medium" key={index}>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.poNumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.status}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.createdDate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.expectedDate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.vendorNumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{order.vendorName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseOrders;