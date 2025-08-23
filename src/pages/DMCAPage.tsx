import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Layout } from '../../components/Layout';

export default function DMCAPage(): React.ReactNode {
    return (
        <Layout currentPage="home">
            <Helmet>
                <title>DMCA Takedown Policy | Project Nightfall</title>
                <meta name="description" content="Project Nightfall respects intellectual property rights. Find out how to submit a DMCA takedown notice and learn about our compliance procedures." />
            </Helmet>
            <div className="container mx-auto p-4 text-white max-w-4xl">
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6">DMCA Takedown Policy</h1>
                        <div className="space-y-6 text-gray-300">
                            <h2 className="text-2xl font-semibold text-white">Digital Millennium Copyright Act Compliance</h2>
                            <p>Project Nightfall respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement committed using our website.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">Filing a DMCA Takedown Notice</h2>
                            <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on our website, please notify our copyright agent as specified below. For your complaint to be valid under the DMCA, you must provide the following information:</p>
                            
                            <ol className="list-decimal list-inside ml-4 space-y-3">
                                <li><strong>Physical or electronic signature</strong> of the copyright owner or a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                                
                                <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed, or if multiple copyrighted works are covered by a single notification, a representative list of such works.</li>
                                
                                <li><strong>Identification of the material</strong> that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.</li>
                                
                                <li><strong>Contact information</strong> including your address, telephone number, and email address.</li>
                                
                                <li><strong>A statement</strong> that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                                
                                <li><strong>A statement</strong> that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                            </ol>
                            
                            <h2 className="text-2xl font-semibold text-white">Designated Copyright Agent</h2>
                            <p>Please send DMCA takedown notices to our designated copyright agent:</p>
                            <div className="bg-slate-800 p-4 rounded-lg my-4">
                                <p><strong>Email:</strong> <a href="mailto:dmca@project-nightfall.com" className="text-purple-400 hover:text-purple-300">dmca@project-nightfall.com</a></p>
                                <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                            </div>
                            
                            <h2 className="text-2xl font-semibold text-white">Counter-Notification Process</h2>
                            <p>If you believe that your material was removed or disabled by mistake or misidentification, you may file a counter-notification with our copyright agent. Your counter-notification must include:</p>
                            
                            <ol className="list-decimal list-inside ml-4 space-y-2">
                                <li>Your physical or electronic signature</li>
                                <li>Identification of the material that was removed and its location before removal</li>
                                <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                                <li>Your name, address, and telephone number</li>
                                <li>A statement that you consent to jurisdiction of the federal district court</li>
                            </ol>
                            
                            <h2 className="text-2xl font-semibold text-white">Repeat Infringer Policy</h2>
                            <p>We maintain a policy of terminating access for users who are repeat infringers of copyright, as determined in our sole discretion.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">False Claims</h2>
                            <p>Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material is infringing may be subject to liability for damages.</p>
                            
                            <h2 className="text-2xl font-semibold text-white">Response Time</h2>
                            <p>We will process valid DMCA notices within 24-48 hours of receipt. You will receive confirmation once your notice has been processed.</p>
                            
                            <p className="text-sm text-gray-400 italic">This policy is effective as of {new Date().toLocaleDateString()}</p>
                        </div>
            </div>
        </Layout>
    );
}