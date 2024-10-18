import React, { useState, useEffect } from 'react';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';

const UserProfileForm = () => {
    const supabase = useSupabaseClient<Database>();
    const session = useSession();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [companyName, setCompanyName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('users') // Ensure the table name is correct
                .select('first_name, last_name, company_name, address, phone_number, profile_picture')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                setError('Error fetching user profile');
            } else {
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setCompanyName(data.company_name || '');
                setAddress(data.address || '');
                setPhoneNumber(data.phone_number || '');
                setProfilePicture(null); // Reset the profile picture input
            }
        };

        fetchUserProfile();
    }, [session, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        let profilePictureUrl = '';

        if (profilePicture) {
            const { data, error: uploadError } = await supabase.storage
                .from('profile-pictures')
                .upload(`public/${session.user.id}/${profilePicture.name}`, profilePicture);

            if (uploadError) {
                console.error('Upload error:', uploadError.message);
                setError('Error uploading profile picture');
                return;
            }

            profilePictureUrl = data?.path || '';
        }

        const { error: updateError } = await supabase
            .from('users') // Ensure the table name is correct
            .update({
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                address: address,
                phone_number: phoneNumber,
                profile_picture: profilePictureUrl
            })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Update error:', updateError.message);
            setError('Error updating profile');
        } else {
            setError('');
            alert('Profile updated successfully');
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
            <div className='flex gap-2'>
                <label>Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className='border border-slate-900 rounded p-2'
                />
            </div>
            <div className='flex gap-2'>
                <label>Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className='border border-slate-900 rounded p-2'
                />
            </div>
            <div className='flex gap-2'>
                <label>Phone Number</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className='border border-slate-900 rounded p-2'
                />
            </div>
            <div className='flex gap-2'>
                <label>Profile Picture</label>
                <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                    className='border border-slate-900 rounded p-2'
                />
            </div>
            <button className='bg-gray-900 px-6 rounded-sm py-2 text-white' type="submit">Save</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default UserProfileForm;