import { supabase } from '@/lib/initSupabase';
import '@/styles/app.css';
import '@/styles/tailwind.css';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/context/UserContext'; // Adjust the import path as needed

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SessionContextProvider>
  );
}