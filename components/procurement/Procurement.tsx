import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import PurchaseOrders from './PurchaseOrders';
import Vendors from './Vendors';
import Invoices from './Invoices';
import Requirements from './Requirements';
import Statistics from './Statistics';

const Procurement = () => {
  const [activeTab, setActiveTab] = useState('Purchase Orders');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Purchase Orders':
        return <PurchaseOrders />;
      case 'Vendors':
        return <Vendors />;
      case 'Invoices':
        return <Invoices />;
      case 'Requirements':
        return <Requirements />;
      case 'Statistics':
        return <Statistics />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-start justify-center w-full h-full">
      <div className="tabs flex space-x-4 border-b-2 border-gray-300">
        {['Purchase Orders', 'Vendors', 'Invoices', 'Requirements', 'Statistics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg ${activeTab === tab ? 'bg-white border-l border-t border-r border-gray-300' : 'bg-gray-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content p-4 border-l border-r border-b border-gray-300 bg-white w-full">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Procurement;