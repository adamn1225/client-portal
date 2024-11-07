import React from "react";
import ContactUs from "@pages/components/ContactUs";
import Layout from "@pages/components/Layout";
import TopNavbar from "../components/TopNavbar";
import Head from "next/head";

const ContactPage = () => {
    return (
        <>

            <Head>
                <title>Welcome to Heavy Construct</title>
                <meta name="description" content="Welcome to Heavy Construct - Your trusted partner in Inventory Management, Procurement, and Logistics." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="min-h-screen w-screen flex flex-col">
                <TopNavbar />
            <main>
                <ContactUs />
            </main>
                <footer className="bg-gray-900 text-white p-4">
                    <div className="container mx-auto text-center">
                        <p>&copy; {new Date().getFullYear()} SSTA LLC. All rights reserved.</p>
                    </div>
            
            </footer>
            </div>
        </>
    );
};

export default ContactPage;