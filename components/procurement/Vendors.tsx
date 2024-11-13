import React, { useState, useEffect } from 'react';
import { addVendor, fetchVendorsData } from '@/lib/database';
import { Vendor } from '@/lib/schema';
import { useSession, Session } from '@supabase/auth-helpers-react';

interface Vendors {
  session: Session | null;
}

const Vendors: React.FC<Vendors> = ({session}) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorNumber, setVendorNumber] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [businessStreet, setBusinessStreet] = useState('');
  const [businessCity, setBusinessCity] = useState('');
  const [businessState, setBusinessState] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const getVendors = async () => {
      const { data, error } = await fetchVendorsData();
      if (error) {
        console.error('Error fetching vendors:', error);
      } else {
        setVendors(data);
      }
    };
    getVendors();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const vendor: Omit<Vendor, 'id'> = {
      vendornumber: vendorNumber,
      vendorname: vendorName,
      businessstreet: businessStreet,
      businesscity: businessCity,
      businessstate: businessState,
      email,
      phone
    };

    const { data, error } = await addVendor(vendor);

    if (error) {
      console.error('Error inserting vendor:', error);
    } else {
      console.log('Vendor inserted:', data);
      setVendors([...vendors, ...data]);
      setIsModalOpen(false);
      // Clear form fields
      setVendorNumber('');
      setVendorName('');
      setBusinessStreet('');
      setBusinessCity('');
      setBusinessState('');
      setEmail('');
      setPhone('');
    }
  };

  return (
    <div>
      <h2 className="text-xl underline text-start mb-6">Vendors</h2>
      <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 shadow-md text-stone-100 font-medium bg-zinc-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-zinc-900">
        Add Vendor
      </button>
      <table className="min-w-full divide-y divide-zinc-200 mt-4">
        <thead className="bg-zinc-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Vendor Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Vendor Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business Street</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business City</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Business State</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Phone</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-zinc-200">
          {vendors.map((vendor) => (
            <tr key={vendor.id}>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.vendornumber}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.vendorname}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.businessstreet}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.businesscity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.businessstate}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.email}</td>
              <td className="px-6 py-4 whitespace-nowrap">{vendor.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg p-6 z-10">
            <h2 className="text-xl underline text-start mb-6">Add Vendor</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex gap-4 justify-around w-full">
                <div className="w-full">
                  <label className="block text-sm font-medium">Vendor Number</label>
                  <input
                    type="text"
                    value={vendorNumber}
                    onChange={(e) => setVendorNumber(e.target.value)}
                    placeholder="Vendor Number"
                    className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-500 border border-zinc-400 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium">Vendor Name</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="Vendor Name"
                    className="mt-1 pl-2 block w-full text-zinc-950 placeholder:text-zinc-500 border border-zinc-400 rounded-md shadow-sm focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col items-start w-full">
                <label className="block text-start text-sm font-medium w-4/5">Business Street</label>
                <input
                  type="text"
                  value={businessStreet}
                  onChange={(e) => setBusinessStreet(e.target.value)}
                  placeholder="123 Lexington St"
                  className="mt-1 pl-2 block w-4/5 border border-zinc-400 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-500 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                />
              </div>
              <div className="flex gap-4 justify-around w-full">
                <div className="w-full">
                  <label className="block text-sm font-medium">Business City</label>
                  <input
                    type="text"
                    value={businessCity}
                    onChange={(e) => setBusinessCity(e.target.value)}
                    placeholder="City"
                    className="mt-1 pl-2 block w-full border border-zinc-400 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-500 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium">Business State</label>
                  <input
                    type="text"
                    value={businessState}
                    onChange={(e) => setBusinessState(e.target.value)}
                    placeholder="State"
                    className="mt-1 pl-2 block w-full border border-zinc-400 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-500 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  placeholder="you@mail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 pl-2 block w-full border border-zinc-400 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-500 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  placeholder="(888) 888-8888"
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 pl-2 block w-full border border-zinc-400 rounded-md shadow-sm text-zinc-950 placeholder:text-zinc-500 focus:ring-zinc-500 focus:border-zinc-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 shadow-md text-stone-100 font-medium bg-zinc-900 hover:text-amber-300 hover:border-amber-300 dark:text-amber-300 border dark:border-amber-300 dark:hover:bg-amber-300 dark:hover:text-zinc-900">
                  Submit
                </button>
              </div>
            </form>
            <button onClick={() => setIsModalOpen(false)} className="mt-4 px-4 py-2 bg-zinc-500 text-white rounded">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;