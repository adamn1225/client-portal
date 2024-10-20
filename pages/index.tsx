// pages/index.tsx
import Head from 'next/head';
import Link from 'next/link';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Auth, ThemeSupa } from '@supabase/auth-ui-react';
import Layout from './components/Layout';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/admin/AdminLayout'; // Import AdminLayout
import { UserProvider, useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import FreightInventory from '@/components/FreightInventory';
import AdminLogin from '@/components/AdminLogin'; // Import AdminLogin component

const HomePageContent = () => {
  const { userProfile } = useUser();
  const [profileComplete, setProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    if (userProfile) {
      console.log('User Profile:', userProfile); // Debugging
      setProfileComplete(true); // Simplified as we no longer check for first_name
    }
  }, [userProfile]);

  return (
    <>
      <Head>
        <title>NTS Client Portal</title>
        <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full flex justify-center items-center p-4">
        <div className="w-full sm:w-2/3 lg:w-3/4">
          <FreightInventory />
          {userProfile?.role === 'admin' && <AdminLogin />} {/* Conditionally render AdminLogin */}
        </div>
      </div>
    </>
  );
};

export default function HomePage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('Session:', session); // Debugging

    const createUserProfile = async () => {
      if (session?.user) {
        const { id, email } = session.user;

        // Check if the user already exists in the custom profiles table by email
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', email)
          .single();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is the code for no rows returned
          console.error(`Error checking user ${id}:`, checkError.message);
          return;
        }

        if (existingUser) {
          console.log(`User with email ${email} already exists. Skipping insertion.`);
          setUserProfile(existingUser);
          return;
        }

        const { data, error } = await supabase
          .from('profiles')
          .insert({
            id,
            email,
            role: 'user', // Default role
            inserted_at: new Date().toISOString(),
          })
          .select();

        if (error) {
          console.error('Error creating/updating user profile:', error.message);
        } else {
          console.log('User profile created/updated:', data);
          setUserProfile(data[0]);
        }
      }
    };

    if (session) {
      createUserProfile();
    }
  }, [session, supabase]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3000/auth/callback'
          : 'https://your-production-url.com/auth/callback',
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  if (!session) {
    return (
      <Layout>
        <Head>
          <title>NTS Client Portal</title>
          <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-full h-full bg-200">
          <div className="min-w-full min-h-screen flex items-center justify-center">
            <div className="w-full h-full flex justify-center items-center p-4">
              <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                  Sign In
                </span>
                <div className="mt-4">
                  <Auth
                    supabaseClient={supabase}
                    providers={['google']}
                    appearance={{ theme: ThemeSupa }}
                    theme="dark"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p>Don&apos;t have an account?</p>
                  <Link href="/signup" legacyBehavior>
                    <a className="text-blue-500">Sign Up</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session.user.email_confirmed_at) {
    return (
      <Layout>
        <Head>
          <title>NTS Client Portal</title>
          <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="w-full h-full bg-200">
          <div className="min-w-full min-h-screen flex items-center justify-center">
            <div className="w-full h-full flex justify-center items-center p-4">
              <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col text-base">
                <span className="font-sans text-4xl text-center pb-2 mb-1 border-b mx-4 align-center">
                  Verify Your Email
                </span>
                <div className="mt-4 text-center">
                  <p>Please verify your email address to access the application.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <UserProvider>
      {userProfile?.role === 'admin' ? (
        <AdminLayout>
          <HomePageContent />
        </AdminLayout>
      ) : (
        <UserLayout>
          <HomePageContent />
        </UserLayout>
      )}
    </UserProvider>
  );
}