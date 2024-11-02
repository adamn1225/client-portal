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
    <div className="flex flex-col items-start justify-center gap-12 w-full h-full">
      <div className="tabs space-x-0">
        {['Purchase Orders', 'Vendors', 'Invoices', 'Requirements', 'Statistics'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active light-dark-btn' : 'light-dark-btn'}>
            {tab}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Procurement;