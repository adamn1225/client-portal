import { useState } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

interface UserProfileFormProps {
    session: Session;
}

const UserProfileForm = ({ session }: UserProfileFormProps) => {
    const supabase = useSupabaseClient<Database>();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: session.user.id,
                first_name: firstName,
                last_name: lastName,
            });

        if (error) {
            setError(error.message);
        } else {
            setError(null);
        }
    };

    return (
        <form className='text-slate-900 text-lg flex flex-col gap-4 justify-center items-center' onSubmit={handleSubmit}>
            <div className='flex gap-2'>
                <label>First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className='border border-slate-900 rounded p-2'
                    required
                />
            </div>
            <div className='flex gap-2'>
                <label>Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className='border border-slate-900 rounded p-2'
                    required
                />
            </div>
            <button className='bg-gray-900 px-6 rounded-sm py-2 text-white' type="submit">Save</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default UserProfileForm;