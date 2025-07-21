import React from 'react';

export type LegalPageType = 'terms' | 'privacy' | 'dmca' | '2257';

interface LegalPagesProps {
    page: LegalPageType;
    onClose: () => void;
}

export function LegalPages({ page, onClose }: LegalPagesProps): React.ReactNode {
    const getPageContent = () => {
        switch (page) {
            case 'terms':
                return {
                    title: 'Terms of Service',
                    content: `
                        <h3>1. Acceptance of Terms</h3>
                        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                        
                        <h3>2. Age Verification</h3>
                        <p>You must be at least 18 years of age to access this website. By using this site, you represent and warrant that you are at least 18 years old.</p>
                        
                        <h3>3. Content Usage</h3>
                        <p>All content on this website is for personal, non-commercial use only. Redistribution or republication of any content is strictly prohibited.</p>
                        
                        <h3>4. Privacy</h3>
                        <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website.</p>
                        
                        <h3>5. Prohibited Uses</h3>
                        <p>You may not use our service for any illegal or unauthorized purpose nor may you, in the use of the service, violate any laws in your jurisdiction.</p>
                    `
                };
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    content: `
                        <h3>Information We Collect</h3>
                        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us.</p>
                        
                        <h3>How We Use Your Information</h3>
                        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                        
                        <h3>Information Sharing</h3>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
                        
                        <h3>Cookies</h3>
                        <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information.</p>
                        
                        <h3>Data Security</h3>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    `
                };
            case 'dmca':
                return {
                    title: 'DMCA Notice',
                    content: `
                        <h3>Digital Millennium Copyright Act</h3>
                        <p>We respect the intellectual property rights of others and expect our users to do the same.</p>
                        
                        <h3>Filing a DMCA Notice</h3>
                        <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our copyright agent with the following information:</p>
                        
                        <ul>
                            <li>A physical or electronic signature of the copyright owner</li>
                            <li>Identification of the copyrighted work claimed to have been infringed</li>
                            <li>Identification of the material that is claimed to be infringing</li>
                            <li>Information reasonably sufficient to permit us to contact you</li>
                            <li>A statement that you have a good faith belief that use of the material is not authorized</li>
                            <li>A statement that the information in the notification is accurate</li>
                        </ul>
                        
                        <h3>Contact Information</h3>
                        <p>DMCA notices should be sent to: [email]@projectnightfall.com</p>
                    `
                };
            case '2257':
                return {
                    title: '18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement',
                    content: `
                        <h3>Record-Keeping Requirements</h3>
                        <p>All models, actors, actresses and other persons that appear in any visual depiction of actual sexually explicit conduct appearing or otherwise contained in this website were over the age of eighteen years at the time of the creation of such depictions.</p>
                        
                        <h3>Custodian of Records</h3>
                        <p>The records required by 18 U.S.C. § 2257 and 28 C.F.R. 75 for all content contained in this website are kept by the Custodian of Records at:</p>
                        
                        <p>
                            Project Nightfall<br/>
                            [Address Line 1]<br/>
                            [Address Line 2]<br/>
                            [City, State ZIP]
                        </p>
                        
                        <h3>Compliance</h3>
                        <p>This website is in full compliance with 18 U.S.C. § 2257 and 28 C.F.R. 75 record-keeping requirements.</p>
                    `
                };
            default:
                return { title: '', content: '' };
        }
    };

    const { title, content } = getPageContent();

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    <div 
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{
                            color: '#e2e8f0',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}