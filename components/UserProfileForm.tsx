import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import Image from 'next/image';

const UserProfileForm = () => {
    const session = useSession();
    const supabase = useSupabaseClient<Database>();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, company_name, address, phone_number, profile_picture')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                setError('Error fetching user profile');
            } else {
                console.log('Fetched user profile:', data); // Log the fetched data
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setCompanyName(data.company_name || '');
                setAddress(data.address || '');
                setPhoneNumber(data.phone_number || '');
                setProfilePictureUrl(data.profile_picture ? `https://fazytsvctdzbhvsavvwj.supabase.co/storage/v1/object/public/${data.profile_picture}` : null);
                setProfilePicture(null); // Reset the profile picture input
            }
        };

        fetchUserProfile();
    }, [session, supabase]);

    const uploadProfilePicture = async (file: File, userId: string) => {
        const { data, error } = await supabase.storage
            .from('profile-pictures')
            .upload(`public/${userId}/${file.name}`, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (error) {
            console.error('Upload error:', error.message);
            throw new Error('Error uploading profile picture');
        }

        return data?.path || '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        let profilePictureUrl = '';

        if (profilePicture) {
            try {
                profilePictureUrl = await uploadProfilePicture(profilePicture, session.user.id);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
                return;
            }
        }

        const { error: updateError } = await supabase
            .from('profiles') // Ensure the table name is correct
            .update({
                first_name: firstName,
                last_name: lastName,
                company_name: companyName,
                address: address,
                phone_number: phoneNumber,
                profile_picture: profilePictureUrl || undefined, // Update profile picture URL if available
            })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Error updating user profile:', updateError.message);
            setError('Error updating user profile');
        } else {
            console.log('User profile updated successfully');
            setError('');
            setSuccess('Profile updated successfully');
            setProfilePictureUrl(profilePictureUrl ? `https://fazytsvctdzbhvsavvwj.supabase.co/storage/v1/object/public/${profilePictureUrl}` : null);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
            <div>
                <label>First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            <div>
                <label>Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            <div>
                <label>Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            <div>
                <label>Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            <div>
                <label>Phone Number</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            <div>
                <label>Profile Picture</label>
                <input
                    type="file"
                    onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                    className="rounded w-full p-2 border border-slate-900"
                />
            </div>
            {profilePictureUrl && (
                <div>
                    <Image
                        src={profilePictureUrl}
                        alt="Profile Picture"
                        width={100}
                        height={100}
                        className="rounded-full"
                    />
                </div>
            )}
            <button type="submit" className="btn-slate">
                Update Profile
            </button>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
        </form>
    );
};

export default UserProfileForm;