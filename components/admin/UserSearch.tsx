import React, { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';

const UserSearch = () => {
    const supabase = useSupabaseClient<Database>();
    const [searchTerm, setSearchTerm] = useState('');
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', `%${searchTerm}%`);

            if (profilesError) {
                throw new Error(profilesError.message);
            }

            const { data: shippingQuotes, error: shippingQuotesError } = await supabase
                .from('shippingquotes')
                .select('*')
                .ilike('email', `%${searchTerm}%`);

            if (shippingQuotesError) {
                throw new Error(shippingQuotesError.message);
            }

            const { data: orders, error: ordersError } = await supabase
                .from('orders')
                .select('*')
                .ilike('email', `%${searchTerm}%`);

            if (ordersError) {
                throw new Error(ordersError.message);
            }

            const { data: freight, error: freightError } = await supabase
                .from('freight')
                .select('*')
                .ilike('email', `%${searchTerm}%`);

            if (freightError) {
                throw new Error(freightError.message);
            }

            const { data: companies, error: companiesError } = await supabase
                .from('companies')
                .select('*')
                .ilike('email', `%${searchTerm}%`);

            if (companiesError) {
                throw new Error(companiesError.message);
            }

            setUserData({
                profiles,
                shippingQuotes,
                orders,
                freight,
                companies,
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">User Search</h2>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email"
                    className="p-2 border rounded w-full"
                />
                <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
                    Search
                </button>
            </form>
            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {userData && (
                <div>
                    <h3 className="text-lg font-bold">Profiles</h3>
                    <pre>{JSON.stringify(userData.profiles, null, 2)}</pre>
                    <h3 className="text-lg font-bold">Shipping Quotes</h3>
                    <pre>{JSON.stringify(userData.shippingQuotes, null, 2)}</pre>
                    <h3 className="text-lg font-bold">Orders</h3>
                    <pre>{JSON.stringify(userData.orders, null, 2)}</pre>
                    <h3 className="text-lg font-bold">Freight</h3>
                    <pre>{JSON.stringify(userData.freight, null, 2)}</pre>
                    <h3 className="text-lg font-bold">Companies</h3>
                    <pre>{JSON.stringify(userData.companies, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default UserSearch;