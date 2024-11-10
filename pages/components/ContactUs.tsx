// pages/components/ContactUs.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface ContactUsForm {
    name: string;
    email: string;
    message: string;
}

const ContactUs = () => {
    const supabase = useSupabaseClient();
    const router = useRouter();
    const { register, handleSubmit, reset } = useForm<ContactUsForm>();

    const onSubmit = async (data: ContactUsForm) => {
        console.log('Form Data:', data);

        const { data: contactUsData, error } = await supabase.from('contact_us').insert(data);

        if (error) {
            console.error('Error inserting contact us data:', error.message);
            toast.error('Error submitting contact us form. Please try again later.');
            return;
        }

        console.log('Contact Us Data:', contactUsData);

        toast.success('Contact us form submitted successfully!');
        reset();
    };

    return (
        <div className="w-full flex justify-center gap-12 items-baseline p-4">
            <div className="w-full sm:w-2/3 lg:w-1/3">
                <h1 className="text-3xl font-bold text-center underline underline-offset-2">Contact Us</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        {...register('name', { required: 'Name is required' })}
                        className="input border p-1 rounded-md border-gray-800"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        {...register('email', { required: 'Email is required' })}
                        className="input border p-1 rounded-md border-gray-800"
                    />
                    <textarea
                        name="message"
                        placeholder="Message"
                        {...register('message', { required: 'Message is required' })}
                        className="input border p-1 rounded-md border-gray-800"
                    />
                    <button type="submit" className="dark-light-btn">
                        Submit
                    </button>
                </form>
            </div>
            <div className='flex flex-col'>
                <h2><strong>Email:</strong> info@heavyconstruct.com</h2>
                <h2><strong>Phone:</strong> 1-(800)-858-2344</h2>
            </div>
        </div>
    );
}

export default ContactUs;