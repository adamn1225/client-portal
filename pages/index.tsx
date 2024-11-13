import Head from 'next/head';
import type { NextPage } from 'next';
import Link from 'next/link';
import { Trusted } from '@/components/Trusted';
import TopNavbar from './components/TopNavbar';
import Hero from './components/Hero';
import ChromeExtAd from './components/ChromeExtAd';
import Feature from "@/components/features";

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Welcome to Heavy Construct</title>
        <meta name="description" content="Welcome to Heavy Construct - Your trusted partner in Inventory Management, Procurement, and Logistics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/hc-28.png" />
      </Head>
      <div className="w-screen min-h-screen flex flex-col">
      <TopNavbar />
        
        <section>
    
          <div className=' mt-4 md:mt-12 flex flex-col justify-start items-center text-center"'>
            <h1 className="text-lg md:text-3xl font-bold mb-4">
              All In One
              <span className="block md:inline"> Construction, Procurement, &amp; Logistics Management System</span>
            </h1>
          </div>
          <Hero />
          <ChromeExtAd />
          <Feature />
        </section>
        <footer className="bg-gray-900 text-white p-4 flex flex-col justify-center text-center gap-3 ">
          <div className="container mx-auto text-center">
            <Link href="/policies" className="underline font-semibold max-w-max self-center">Policies</Link>
            <p className='mt-5'>&copy; {new Date().getFullYear()} SSTA LLC. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;