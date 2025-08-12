import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { PageType } from '../../types';

export default function ContactPage(): React.ReactNode {
    const navigate = useNavigate();

    const handlePageChange = (page: PageType) => {
        switch (page) {
            case 'home':
                navigate('/');
                break;
            case 'trending':
            case 'top-rated':
                navigate(`/?page=${page}`);
                break;
            case 'categories':
                navigate('/categories');
                break;
            default:
                navigate('/');
        }
    };

    return (
        <div className="bg-slate-950 text-slate-300 min-h-screen">
            <Helmet>
                <title>Contact Us | Project Nightfall Support</title>
                <meta name="description" content="Get in touch with the Project Nightfall team. For support, inquiries, or feedback, please reach out to us via email." />
            </Helmet>
            <div className="flex">
                <Sidebar
                    currentPage="home"
                    onPageChange={handlePageChange}
                    isMobileOpen={false}
                    onMobileClose={() => {}}
                />
                <main className="flex-1 lg:ml-64">
                    <Header
                        searchQuery=""
                        onSearchChange={() => {}}
                        onMobileMenuToggle={() => {}}
                    />
                    <div className="container mx-auto p-4 text-white">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">Contact Us</h1>
                        <div className="space-y-4 text-lg text-gray-300 max-w-4xl">
                            <p>For any inquiries, support requests, or feedback, please do not hesitate to reach out to our team.</p>
                            <p>You can contact us directly via email at: <a href="mailto:support@projectnightfall.com" className="text-blue-400 hover:underline">support@projectnightfall.com</a>.</p>
                            <p>We aim to respond to all inquiries within 24-48 hours.</p>
                        </div>
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
}