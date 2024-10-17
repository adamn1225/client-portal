import Head from 'next/head';
import Link from 'next/link';
import Layout from './components/Layout';
import SignUp from './components/SignUp';

export default function HomePage() {
  return (
    <Layout>
      <Head>
        <title>NTS Client Portal</title>
        <meta name="description" content="Welcome to SSTA Reminders & Tasks" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-w-full min-h-screen flex flex-col items-center justify-start py-4 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">NTS Client Portal</h1>
        <p className="text-lg mb-8">Manage your freight and shipments efficiently.</p>
        <div className="w-full h-full sm:h-auto sm:w-2/5 max-w-sm p-5 bg-white shadow flex flex-col items-center text-base">
          <span className="font-sans text-nowrap text-4xl text-center pb-2 mb-1 border-b mx-1 align-center">
            Let&apos;s Get Organized
          </span>
          <SignUp /> {/* Use the SignUp component */}
          <div className="mt-4 text-center">
            <p>Already have an account?</p>
            <Link href="/login" legacyBehavior>
              <a className="text-blue-500">Sign In</a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}