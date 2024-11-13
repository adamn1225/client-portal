import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import PurchaseOrders from './PurchaseOrders';
import Vendors from './Vendors';
import Invoices from './Invoices';
import Requirements from './Requirements';
import Statistics from './Statistics';

const Procurement = () => {
  const session = useSession();
  const [activeTab, setActiveTab] = useState('Purchase Orders');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Purchase Orders':
        return <PurchaseOrders session={session} />;
      case 'Vendors':
        return <Vendors session={session} />;
      case 'Invoices':
        return <Invoices session={session} />;
      case 'Requirements':
        return <Requirements session={session} />;
      case 'Statistics':
        return <Statistics session={session} />;
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