import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Trusted } from '@/components/Trusted';
import TopNavbar from './components/TopNavbar';
import Hero from './components/Hero';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SSTA Inc</title>
        <meta name="description" content="Welcome to SSTA Inc - Your trusted partner in Inventory Management, Procurement, and Logistics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen w-screen flex flex-col">
      <TopNavbar />
        
      
        {/* <header className="bg-gray-900 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-3xl font-bold flex gap-2 items-center"><Move3d /> SSTA Inc</h1>
            <nav>
              <Link href="/login" className="px-4 py-2 rounded-md bg-yellow-500 text-gray-900 font-medium">Sign In</Link>
              <Link href="/user/signup" className="ml-4 px-4 py-2 rounded-md bg-yellow-500 text-gray-900 font-medium">Sign Up</Link>
            </nav>
          </div>
        </header> */}
        <main className="flex-grow container mt-12 mx-auto p-4 flex flex-col justify-start items-center text-center">
    
          <h1 className="text-3xl font-bold mb-4">All In One Construction, Procurement, &amp; Logistics Management System</h1>
          <Hero />

        </main>
        <footer className="bg-gray-900 text-white p-4">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} SSTA Inc. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;