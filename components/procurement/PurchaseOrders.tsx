import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import PurchaseOrderForm from '@/components/procurement/PurchaseOrderForm';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { PurchaseOrder, Database } from '@/lib/database.types';

const PurchaseOrders = () => {
  const supabase = useSupabaseClient<Database>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      const { data, error } = await supabase.from('purchase_order').select('*');
      if (error) {
        console.error('Error fetching purchase orders:', error);
      } else {
        setPurchaseOrders(data);
      }
    };

    fetchPurchaseOrders();
  }, [supabase]);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-4">
        <button onClick={() => setIsModalOpen(true)} className="light-dark-btn">
          Add Purchase Order
        </button>
      </div>
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
        <tbody className="w-full">
          {purchaseOrders.map((data, index) => (
            <tr className="space-x-12 border border-gray-900/50 text-sm font-medium" key={index}>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.ponumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.status ? 'Completed' : 'Pending'}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.createddate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.expecteddate}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.vendornumber}</td>
              <td className="px-2 border border-gray-900/40 dark:border-stone-100/50 tracking-wider">{data.vendorname}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <PurchaseOrderForm />
      </Modal>
    </div>
  );
};

export default PurchaseOrders;