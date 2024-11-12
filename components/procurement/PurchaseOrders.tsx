import React, { useState, useEffect } from 'react';
import PurchaseOrderForm from './PurchaseOrderForm';
import { fetchPurchaseOrders, updatePurchaseOrderStatus, addPurchaseOrder } from '@/lib/database';
import { PurchaseOrder } from '@/lib/schema';
import jsPDF from 'jspdf';

const PurchaseOrders = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    const getPurchaseOrders = async () => {
      const { data, error } = await fetchPurchaseOrders();
      if (error) {
        console.error('Error fetching purchase orders:', error);
      } else {
        setPurchaseOrders(data);
      }
    };

    getPurchaseOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await updatePurchaseOrderStatus(id, newStatus);
    if (error) {
      console.error('Error updating status:', error);
    } else {
      setPurchaseOrders(purchaseOrders.map(po => po.id === id ? { ...po, status: newStatus } : po));
    }
  };

  const handlePrintPDF = async () => {
    const pdf = new jsPDF();
    const table = document.getElementById('purchase-orders-table');
    if (table) {
      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row, rowIndex) => {
        const cells = row.querySelectorAll('td');
        cells.forEach((cell, cellIndex) => {
          pdf.text(cell.textContent || '', 10 + cellIndex * 30, 10 + rowIndex * 10);
        });
      });
      pdf.save('purchase_orders.pdf');
    }
  };

  const handlePrintRowPDF = async (order: PurchaseOrder) => {
    const pdf = new jsPDF();
    const row = document.getElementById(`purchase-order-row-${order.id}`);
    if (row) {
      const cells = row.querySelectorAll('td');
      cells.forEach((cell, cellIndex) => {
        pdf.text(cell.textContent || '', 10, 10 + cellIndex * 10);
      });
      pdf.save(`purchase_order_${order.ponumber}.pdf`);
    }
  };

  const handleEditOrder = (order: PurchaseOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleAddOrder = async (order: Omit<PurchaseOrder, 'id'>) => {
    const { data, error } = await addPurchaseOrder(order);
    if (error) {
      console.error('Error adding purchase order:', error);
    } else {
      setPurchaseOrders([...purchaseOrders, ...data]);
      setIsModalOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl underline text-start mb-6">Purchase Orders</h2>
      <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 shadow-md text-stone-100 font-medium bg-gray-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-gray-900">
        Add Purchase Order
      </button>
      <button onClick={handlePrintPDF} className="px-4 py-2 shadow-md text-stone-100 font-medium bg-gray-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-gray-900 ml-4">
        Print PDF
      </button>
      <table id="purchase-orders-table" className="min-w-full divide-y divide-gray-200 mt-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {purchaseOrders.map((data, index) => (
            <tr className="space-x-12 border border-gray-900/50 text-sm font-medium" key={index} id={`purchase-order-row-${data.id}`}>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.ponumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">
                <select
                  value={data.status}
                  onChange={(e) => handleStatusChange(data.id, e.target.value)}
                  className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="canceled">Canceled</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.order_description}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.createddate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.expecteddate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.vendornumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.vendorname}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">
                <button onClick={() => handleEditOrder(data)} className="text-blue-600 hover:text-blue-900">Edit</button>
                <button onClick={() => handlePrintRowPDF(data)} className="text-green-600 hover:text-green-900 ml-2">Print PDF</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <PurchaseOrderForm onSubmit={handleAddOrder} />
            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseOrders;