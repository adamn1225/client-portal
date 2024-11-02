// components/VendorForm.tsx
import React from 'react';

const VendorForm = () => {
  return (
   <>
   <h2 className="text-xl underline text-start mb-6">Add Vendor</h2>
        <form className="space-y-4">
            
          <div className="flex gap-4 justify-around w-full">
              <div className="w-full">
                <label className="block text-sm font-medium">Vendor Number</label>
                <input type="text" placeholder="(optional - Will auto increment by default)" className="mt-1 pl-2 block w-full text-gray-950 placeholder:text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium">Vendor Name</label>
                <input type="text" placeholder="Company Name" className="mt-1 pl-2 block w-full text-gray-950 placeholder:text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
          </div>
          <div className="flex flex-col items-start w-full">
            <label className="block text-start text-sm font-medium w-4/5">Business Street</label>
            <input type="text" placeholder="123 Lexington str" className="mt-1 pl-2 block w-4/5 border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
             </div>
          <div className="flex gap-4 justify-around w-full">
              <div className="w-full">
                <label className="block text-sm font-medium">Business City</label>
                <input type="text"  placeholder="Jackson" className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium">Business State</label>
                <input type="text" placeholder="NJ" className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input type="tel" className="mt-1 pl-2 block w-full border-gray-300 rounded-md shadow-sm text-gray-950 placeholder:text-gray-900 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-gray-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-gray-900">
              Submit
            </button>
          </div>
        </form>
   </>
  );
};

export default VendorForm;