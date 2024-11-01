import Head from 'next/head';
import Link from 'next/link';

import TopNavbar from './components/TopNavbar';

const HomePage = () => {
  return (
    <>
      <Head>
        <title>Welcome to SSTA Inc</title>
        <meta name="description" content="Welcome to SSTA Inc - Your trusted partner in Inventory Management, Procurement, and Logistics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
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
        <main className="flex-grow container mx-auto p-4 flex flex-col justify-center items-center text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to SSTA Inc</h2>
          <p className="text-xl mb-8">Your trusted partner in Inventory Management, Procurement, and Logistics.</p>
          <div>
            <Link href="/about" className="ml-4 px-4 py-2 border border-gray-900 bg-gray-900 text-gray-100 font-medium hover:bg-gray-900 hover:border hover:border-amber-300 hover:text-amber-300">Learn More</Link>
            <Link href="/contact" className="ml-4 px-4 py-2 border border-gray-900 bg-gray-900 text-gray-100 font-medium hover:bg-gray-900 hover:border hover:border-amber-300 hover:text-amber-300">Contact Us</Link>
          </div>
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