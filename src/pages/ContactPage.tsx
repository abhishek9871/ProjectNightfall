import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';

export default function ContactPage(): React.ReactNode {
    return (
        <Layout currentPage="home">
            <Helmet>
                <title>Contact Us | Project Nightfall Support</title>
                <meta name="description" content="Get in touch with the Project Nightfall team. For support, inquiries, or feedback, please reach out to us via email." />
            </Helmet>
            <div className="container mx-auto p-4 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-6">Contact Us</h1>
                <div className="space-y-4 text-lg text-gray-300 max-w-4xl">
                    <p>For any inquiries, support requests, or feedback, please do not hesitate to reach out to our team.</p>
                    <p>You can contact us directly via email at: <a href="mailto:support@projectnightfall.com" className="text-blue-400 hover:underline">support@projectnightfall.com</a>.</p>
                    <p>We aim to respond to all inquiries within 24-48 hours.</p>
                </div>
            </div>
        </Layout>
    );
}