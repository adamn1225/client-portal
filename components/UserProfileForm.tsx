import React, { useState, useEffect } from 'react';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import Image from 'next/image';
import { UserRoundPen, BellRing, Building2 } from 'lucide-react'

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
    const [email, setEmail] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(false);
    const [profileError, setProfileError] = useState('');
    const [profileSuccess, setProfileSuccess] = useState('');
    const [notificationsError, setNotificationsError] = useState('');
    const [notificationsSuccess, setNotificationsSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to control editing
    const [activeSection, setActiveSection] = useState('personal'); // State to control active section

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!session) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('first_name, last_name, company_name, address, phone_number, profile_picture, email_notifications')
                .eq('id', session.user.id)
                .single();

            if (error) {
                console.error('Error fetching user profile:', error.message);
                setProfileError('Error fetching user profile');
            } else {
                console.log('Fetched user profile:', data); // Log the fetched data
                setFirstName(data.first_name || '');
                setLastName(data.last_name || '');
                setCompanyName(data.company_name || '');
                setAddress(data.address || '');
                setPhoneNumber(data.phone_number || '');
                setProfilePictureUrl(data.profile_picture ? `https://fazytsvctdzbhvsavvwj.supabase.co/storage/v1/object/public/profile-pictures/${data.profile_picture}` : null);
                setEmail(session.user.email || '');
                setEmailNotifications(data.email_notifications || false);
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

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        let profilePictureUrl = '';

        if (profilePicture) {
            try {
                profilePictureUrl = await uploadProfilePicture(profilePicture, session.user.id);
            } catch (error) {
                if (error instanceof Error) {
                    setProfileError(error.message);
                } else {
                    setProfileError('An unknown error occurred');
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
                email: email,
                email_notifications: false
            })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Error updating user profile:', updateError.message);
            setProfileError('Error updating user profile');
        } else {
            console.log('User profile updated successfully');
            setProfileError('');
            setProfileSuccess('Profile updated successfully');
            setProfilePictureUrl(profilePictureUrl ? `https://fazytsvctdzbhvsavvwj.supabase.co/storage/v1/object/public/profile-pictures/${profilePictureUrl}` : null);
            setIsEditing(false); // Disable editing after successful update
        }
    };

    const handleNotificationsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) return;

        const { error: updateError } = await supabase
            .from('profiles') // Ensure the table name is correct
            .update({
                email_notifications: emailNotifications,
            })
            .eq('id', session.user.id);

        if (updateError) {
            console.error('Error updating notification settings:', updateError.message);
            setNotificationsError('Error updating notification settings');
        } else {
            console.log('Notification settings updated successfully');
            setNotificationsError('');
            setNotificationsSuccess('Notification settings updated successfully');
        }
    };

    return (
        <div className="flex">
            <div className="w-1/4 p-4 bg-gray-100 border-r border-gray-300">
                <h2 className="text-xl font-bold mb-4">Settings</h2>
                <ul className="space-y-2">
                    <li className='flex gap-1 items-center'>
                        <UserRoundPen />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'personal' ? 'bg-gray-300' : ''}`}
                            onClick={() => setActiveSection('personal')}
                        >
                            Personal Details
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <Building2 />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'company' ? 'bg-gray-300' : ''}`}
                            onClick={() => setActiveSection('company')}
                        >
                            Company Details
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <BellRing />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'notifications' ? 'bg-gray-300' : ''}`}
                            onClick={() => setActiveSection('notifications')}
                        >
                            Notification Settings
                        </button>
                    </li>
                </ul>
            </div>
            <div className="w-3/4 p-4">
                {activeSection === 'personal' && (
                    <div>
                        <h1 className="text-2xl font-bold">Personal Details</h1>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-slate my-4 text-nowrap flex-nowrap cursor-pointer self-start"
                            disabled={isEditing}
                        >
                            Edit Profile Information
                        </button>
                        <div className="flex flex-col gap-4 bg-stone-100 px-12 pt-6 pb-12 border border-slate-600/40 shadow-sm rounded-sm">
                            <form onSubmit={handleProfileSubmit} className="grid grid-cols-2 gap-4 w-full">
                                {profilePictureUrl && (
                                    <div className="col-span-2">
                                        <Image
                                            src={profilePictureUrl}
                                            alt="Profile Picture"
                                            width={100}
                                            height={100}
                                            className="rounded-full shadow-md"
                                        />
                                        <div className='flex flex-col mt-3 mb-6'>
                                            <label className='font-semibold text-slate-800'>Update Profile Image</label>
                                            <input
                                                type="file"
                                                onChange={(e) => setProfilePicture(e.target.files ? e.target.files[0] : null)}
                                                className="rounded"
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <label>First Name</label>
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Last Name</label>
                                    <input
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Phone Number</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <button type="submit" className="btn-black-outline w-full" disabled={!isEditing}>
                                        Update Profile
                                    </button>
                                </div>
                                {profileError && <p className="text-red-500 col-span-2">{profileError}</p>}
                                {profileSuccess && <p className="text-green-500 col-span-2">{profileSuccess}</p>}
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === 'company' && (
                    <div>
                        <h1 className="text-2xl font-bold">Company Details</h1>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="btn-slate my-4 text-nowrap flex-nowrap cursor-pointer self-start"
                            disabled={isEditing}
                        >
                            Edit Company Information
                        </button>
                        <div className="flex flex-col gap-4 bg-stone-100 px-12 pt-6 pb-12 border border-slate-600/40 shadow-sm rounded-sm">
                            <form onSubmit={handleProfileSubmit} className="grid grid-cols-2 gap-4 w-full">
                                <div className="flex flex-col">
                                    <label>Company Name</label>
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label>Address</label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="rounded w-full p-2 border border-slate-900"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <button type="submit" className="btn-black-outline w-full" disabled={!isEditing}>
                                        Update Company Details
                                    </button>
                                </div>
                                {profileError && <p className="text-red-500 col-span-2">{profileError}</p>}
                                {profileSuccess && <p className="text-green-500 col-span-2">{profileSuccess}</p>}
                            </form>
                        </div>
                    </div>
                )}

                {activeSection === 'notifications' && (
                    <div>
                        <h1 className="text-2xl font-bold">Notification Settings</h1>
                        <div className="flex flex-col gap-4 bg-stone-100 px-12 pt-6 pb-12 border border-slate-600/40 shadow-sm rounded-sm">
                            <form onSubmit={handleNotificationsSubmit} className="flex flex-col gap-4 w-full">
                                <div className='flex items-center gap-1 flex-nowrap'>
                                    <label className='text-lg font-medium'>Email Notifications</label>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={emailNotifications}
                                            onChange={(e) => setEmailNotifications(e.target.checked)}
                                            disabled={!isEditing}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <button type="submit" className="btn-black-outline" disabled={!isEditing}>
                                    Update Notification Settings
                                </button>
                                {notificationsError && <p className="text-red-500">{notificationsError}</p>}
                                {notificationsSuccess && <p className="text-green-500">{notificationsSuccess}</p>}
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfileForm;