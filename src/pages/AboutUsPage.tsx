import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';

export default function AboutUsPage(): React.ReactNode {
    return (
        <Layout currentPage="home">
            <Helmet>
                <title>About Us | Our Mission at Project Nightfall</title>
                <meta name="description" content="Discover the mission behind Project Nightfall. We're dedicated to providing a premium, curated library of high-quality adult entertainment on a fast, modern, and user-friendly platform." />
            </Helmet>
            <div className="container mx-auto p-4 text-white">
                <h1 className="text-3xl lg:text-4xl font-bold mb-6">About Project Nightfall</h1>
                <div className="space-y-6 text-lg text-gray-300 max-w-4xl">
                    <p>Project Nightfall was founded on a simple principle: adult entertainment deserves a better experience. We grew tired of navigating cluttered, slow, and poorly organized websites. We believed it was possible to create a platform that was not only visually stunning and incredibly fast, but also intelligently organized for effortless discovery.</p>
                    <p>Our mission is to provide a premium, curated library of high-quality adult content. Every video in our collection is meticulously categorized to ensure you can always find exactly what you're looking for. From our powerful category hub to our lightning-fast watch pages, every aspect of Project Nightfall has been engineered for your satisfaction.</p>
                    <p>Welcome to the future of adult entertainment. Welcome to Project Nightfall.</p>
                </div>
            </div>
        </Layout>
    );
}