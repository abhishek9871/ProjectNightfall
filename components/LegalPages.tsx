import React from 'react';

export type LegalPageType = 'terms' | 'privacy' | 'dmca' | '2257' | 'about' | 'contact';

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
                        <p>By accessing and using Project Nightfall ("the Website"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                        
                        <h3>2. Age Verification and Restrictions</h3>
                        <p><strong>YOU MUST BE AT LEAST 18 YEARS OF AGE TO ACCESS THIS WEBSITE.</strong> This website contains adult content that is not suitable for minors. By using this site, you represent and warrant that:</p>
                        <ul>
                            <li>You are at least 18 years old or the age of majority in your jurisdiction</li>
                            <li>You have the legal right to access adult material in your location</li>
                            <li>You will not allow minors to access this website through your account or device</li>
                            <li>You understand that this website contains explicit adult content</li>
                        </ul>
                        
                        <h3>3. Content Usage and Restrictions</h3>
                        <p>All content on this website is for personal, non-commercial use only. You agree that you will not:</p>
                        <ul>
                            <li>Redistribute, republish, or share any content from this website</li>
                            <li>Use automated systems to access or download content</li>
                            <li>Attempt to circumvent any security measures or access restrictions</li>
                            <li>Use the content for commercial purposes without explicit permission</li>
                        </ul>
                        
                        <h3>4. User Conduct</h3>
                        <p>You agree to use this website in a manner consistent with all applicable laws and regulations. Prohibited activities include but are not limited to:</p>
                        <ul>
                            <li>Harassment or abuse of other users</li>
                            <li>Posting or transmitting illegal content</li>
                            <li>Attempting to gain unauthorized access to our systems</li>
                            <li>Interfering with the proper functioning of the website</li>
                        </ul>
                        
                        <h3>5. Privacy and Data Protection</h3>
                        <p>Your privacy is important to us. Please review our Privacy Policy, which governs the collection, use, and disclosure of your personal information and forms part of these Terms of Service.</p>
                        
                        <h3>6. Intellectual Property</h3>
                        <p>All content, trademarks, and intellectual property on this website are owned by their respective owners. Unauthorized use of any intellectual property is strictly prohibited.</p>
                        
                        <h3>7. Disclaimer of Warranties</h3>
                        <p>This website is provided "as is" without any warranties, express or implied. We do not guarantee the accuracy, completeness, or reliability of any content.</p>
                        
                        <h3>8. Limitation of Liability</h3>
                        <p>In no event shall Project Nightfall be liable for any indirect, incidental, special, or consequential damages arising from your use of this website.</p>
                        
                        <h3>9. Modifications to Terms</h3>
                        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of any modifications.</p>
                        
                        <h3>10. Termination</h3>
                        <p>We may terminate or suspend your access to the website at any time, without prior notice, for conduct that we believe violates these Terms of Service.</p>
                        
                        <h3>11. Governing Law</h3>
                        <p>These Terms of Service shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.</p>
                        
                        <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
                    `
                };
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    content: `
                        <h3>1. Information We Collect</h3>
                        <p>We collect several types of information from and about users of our website:</p>
                        
                        <h4>Information You Provide</h4>
                        <ul>
                            <li>Age verification data (confirmation that you are 18+)</li>
                            <li>Contact information when you reach out to us</li>
                            <li>Preferences and settings you configure</li>
                        </ul>
                        
                        <h4>Information Collected Automatically</h4>
                        <ul>
                            <li>Usage data and browsing patterns</li>
                            <li>Device information and IP addresses</li>
                            <li>Cookies and similar tracking technologies</li>
                            <li>Analytics data to improve our services</li>
                        </ul>
                        
                        <h3>2. How We Use Your Information</h3>
                        <p>We use the information we collect to:</p>
                        <ul>
                            <li>Provide, maintain, and improve our services</li>
                            <li>Ensure compliance with age verification requirements</li>
                            <li>Personalize your experience and content recommendations</li>
                            <li>Communicate with you about our services</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                            <li>Comply with legal obligations and industry regulations</li>
                        </ul>
                        
                        <h3>3. Information Sharing and Disclosure</h3>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties, except:</p>
                        <ul>
                            <li>With your explicit consent</li>
                            <li>To comply with legal obligations or court orders</li>
                            <li>To protect our rights, property, or safety</li>
                            <li>With service providers who assist in website operations</li>
                            <li>In connection with business transfers or mergers</li>
                        </ul>
                        
                        <h3>4. Cookies and Tracking Technologies</h3>
                        <p>We use cookies and similar technologies to:</p>
                        <ul>
                            <li>Remember your preferences and settings</li>
                            <li>Analyze website traffic and usage patterns</li>
                            <li>Provide personalized content and advertisements</li>
                            <li>Ensure website security and prevent fraud</li>
                        </ul>
                        <p>You can control cookie settings through your browser preferences.</p>
                        
                        <h3>5. Data Security</h3>
                        <p>We implement industry-standard security measures to protect your personal information, including:</p>
                        <ul>
                            <li>Encryption of sensitive data in transit and at rest</li>
                            <li>Regular security audits and vulnerability assessments</li>
                            <li>Access controls and authentication measures</li>
                            <li>Secure hosting infrastructure and monitoring</li>
                        </ul>
                        
                        <h3>6. Data Retention</h3>
                        <p>We retain personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, and resolve disputes.</p>
                        
                        <h3>7. Your Rights and Choices</h3>
                        <p>Depending on your location, you may have the right to:</p>
                        <ul>
                            <li>Access and review your personal information</li>
                            <li>Correct inaccurate or incomplete data</li>
                            <li>Delete your personal information</li>
                            <li>Restrict or object to certain processing activities</li>
                            <li>Data portability where applicable</li>
                        </ul>
                        
                        <h3>8. Third-Party Links</h3>
                        <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies.</p>
                        
                        <h3>9. Children's Privacy</h3>
                        <p>Our website is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware of such collection, we will take steps to delete the information immediately.</p>
                        
                        <h3>10. International Data Transfers</h3>
                        <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data during such transfers.</p>
                        
                        <h3>11. Changes to This Policy</h3>
                        <p>We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on this page with an updated effective date.</p>
                        
                        <h3>12. Contact Information</h3>
                        <p>If you have questions about this Privacy Policy, please contact us at: <a href="mailto:privacy@project-nightfall.com" class="text-purple-400 hover:text-purple-300">privacy@project-nightfall.com</a></p>
                        
                        <p><em>Last updated: ${new Date().toLocaleDateString()}</em></p>
                    `
                };
            case 'dmca':
                return {
                    title: 'DMCA Copyright Policy',
                    content: `
                        <h3>Digital Millennium Copyright Act Compliance</h3>
                        <p>Project Nightfall respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), we will respond expeditiously to claims of copyright infringement committed using our website.</p>
                        
                        <h3>Filing a DMCA Takedown Notice</h3>
                        <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on our website, please notify our copyright agent as specified below. For your complaint to be valid under the DMCA, you must provide the following information:</p>
                        
                        <ol>
                            <li><strong>Physical or electronic signature</strong> of the copyright owner or a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                            
                            <li><strong>Identification of the copyrighted work</strong> claimed to have been infringed, or if multiple copyrighted works are covered by a single notification, a representative list of such works.</li>
                            
                            <li><strong>Identification of the material</strong> that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.</li>
                            
                            <li><strong>Contact information</strong> including your address, telephone number, and email address.</li>
                            
                            <li><strong>A statement</strong> that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
                            
                            <li><strong>A statement</strong> that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
                        </ol>
                        
                        <h3>Designated Copyright Agent</h3>
                        <p>Please send DMCA takedown notices to our designated copyright agent:</p>
                        <div class="bg-slate-800 p-4 rounded-lg my-4">
                            <p><strong>Email:</strong> <a href="mailto:dmca@project-nightfall.com" class="text-purple-400 hover:text-purple-300">dmca@project-nightfall.com</a></p>
                            <p><strong>Subject Line:</strong> DMCA Takedown Notice</p>
                        </div>
                        
                        <h3>Counter-Notification Process</h3>
                        <p>If you believe that your material was removed or disabled by mistake or misidentification, you may file a counter-notification with our copyright agent. Your counter-notification must include:</p>
                        
                        <ol>
                            <li>Your physical or electronic signature</li>
                            <li>Identification of the material that was removed and its location before removal</li>
                            <li>A statement under penalty of perjury that you have a good faith belief the material was removed by mistake</li>
                            <li>Your name, address, and telephone number</li>
                            <li>A statement that you consent to jurisdiction of the federal district court</li>
                        </ol>
                        
                        <h3>Repeat Infringer Policy</h3>
                        <p>We maintain a policy of terminating access for users who are repeat infringers of copyright, as determined in our sole discretion.</p>
                        
                        <h3>False Claims</h3>
                        <p>Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material is infringing may be subject to liability for damages.</p>
                        
                        <h3>Response Time</h3>
                        <p>We will process valid DMCA notices within 24-48 hours of receipt. You will receive confirmation once your notice has been processed.</p>
                        
                        <p><em>This policy is effective as of ${new Date().toLocaleDateString()}</em></p>
                    `
                };
            case '2257':
                return {
                    title: '18 U.S.C. 2257 Record-Keeping Requirements Compliance Statement',
                    content: `
                        <h3>Age Verification and Record-Keeping Compliance</h3>
                        <p>Project Nightfall is committed to full compliance with 18 U.S.C. § 2257 and 28 C.F.R. Part 75 record-keeping requirements for all content displayed on this website.</p>
                        
                        <h3>Age Verification Statement</h3>
                        <p><strong>All models, actors, actresses, and other persons that appear in any visual depiction of actual sexually explicit conduct appearing or otherwise contained in or accessible through this website were over the age of eighteen (18) years at the time of the creation of such depictions.</strong></p>
                        
                        <h3>Content Sourcing</h3>
                        <p>This website displays embedded content from third-party platforms that maintain their own 2257 compliance records. We do not host, store, or produce any sexually explicit content directly. All embedded content is sourced from platforms that maintain proper age verification and record-keeping compliance.</p>
                        
                        <h3>Custodian of Records</h3>
                        <p>For content that falls under our direct responsibility, the records required by 18 U.S.C. § 2257 and 28 C.F.R. Part 75 are kept by the Custodian of Records at:</p>
                        
                        <div class="bg-slate-800 p-4 rounded-lg my-4">
                            <p><strong>Project Nightfall - Custodian of Records</strong><br/>
                            Legal Compliance Department<br/>
                            Email: <a href="mailto:records@project-nightfall.com" class="text-purple-400 hover:text-purple-300">records@project-nightfall.com</a></p>
                        </div>
                        
                        <h3>Record Inspection</h3>
                        <p>Records may be inspected during regular business hours by contacting our Custodian of Records. Reasonable advance notice is required for inspection requests.</p>
                        
                        <h3>Third-Party Content Compliance</h3>
                        <p>All embedded content displayed on this website is sourced from established adult entertainment platforms that maintain their own 2257 compliance programs. These platforms include but are not limited to:</p>
                        <ul>
                            <li>Xvideos.com and affiliated domains</li>
                            <li>Other verified adult content platforms</li>
                        </ul>
                        
                        <h3>Reporting Non-Compliance</h3>
                        <p>If you believe any content on this website does not comply with age verification requirements, please contact us immediately at: <a href="mailto:compliance@project-nightfall.com" class="text-purple-400 hover:text-purple-300">compliance@project-nightfall.com</a></p>
                        
                        <h3>Legal Framework</h3>
                        <p>This compliance statement is made pursuant to:</p>
                        <ul>
                            <li>18 U.S.C. § 2257 - Record keeping requirements</li>
                            <li>28 C.F.R. Part 75 - Record keeping requirements under section 2257</li>
                            <li>18 U.S.C. § 2257A - Record keeping requirements for simulated sexual conduct</li>
                        </ul>
                        
                        <h3>Compliance Certification</h3>
                        <p>Project Nightfall certifies that it maintains full compliance with all applicable federal record-keeping requirements and age verification laws. This compliance statement is reviewed and updated regularly to ensure continued adherence to all legal requirements.</p>
                        
                        <p><em>This compliance statement is effective as of ${new Date().toLocaleDateString()} and supersedes all previous versions.</em></p>
                    `
                };
            case 'about':
                return {
                    title: 'About Project Nightfall',
                    content: `
                        <div class="text-center mb-8">
                            <p class="text-lg text-slate-300 leading-relaxed">
                                Project Nightfall is a curated media platform dedicated to showcasing the highest quality content in adult entertainment. Our mission is to provide a superior user experience with in-depth reviews and a professionally organized library.
                            </p>
                        </div>
                        
                        <h3>Our Mission</h3>
                        <p>We believe that adult entertainment should be presented with professionalism, quality, and respect for both creators and consumers. Our platform carefully curates content to ensure the highest standards of quality and user experience.</p>
                        
                        <h3>Quality Standards</h3>
                        <p>Every piece of content on our platform undergoes a thorough review process. We prioritize high-definition video quality, professional production values, and content that meets our strict guidelines for excellence.</p>
                        
                        <h3>User Experience</h3>
                        <p>Our platform is designed with user experience at the forefront. From our intuitive navigation to our advanced search and filtering capabilities, every feature is crafted to help you discover content that matches your preferences quickly and easily.</p>
                        
                        <h3>Content Curation</h3>
                        <p>Our team of experts carefully selects and organizes content across multiple categories, ensuring diversity and quality in our offerings. We maintain partnerships with reputable content providers to bring you the best available material.</p>
                        
                        <h3>Technology & Innovation</h3>
                        <p>We leverage cutting-edge web technologies to deliver a fast, responsive, and secure browsing experience across all devices. Our platform is optimized for both desktop and mobile users.</p>
                        
                        <h3>Commitment to Compliance</h3>
                        <p>Project Nightfall maintains the highest standards of legal compliance, including strict age verification, comprehensive record-keeping, and adherence to all applicable regulations in the adult entertainment industry.</p>
                        
                        <h3>Community & Support</h3>
                        <p>We value our users and are committed to providing excellent customer support. Our team is available to assist with any questions or concerns you may have about our platform.</p>
                    `
                };
            case 'contact':
                return {
                    title: 'Contact Us',
                    content: `
                        <div class="text-center mb-8">
                            <p class="text-lg text-slate-300 leading-relaxed">
                                We value your feedback and are here to assist you with any questions or concerns.
                            </p>
                        </div>
                        
                        <div class="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                            <div class="bg-slate-800 rounded-lg p-6">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg class="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    General Inquiries
                                </h3>
                                <p class="text-purple-400 text-lg mb-2">
                                    <a href="mailto:contact@project-nightfall.com" class="hover:text-purple-300 transition-colors">
                                        contact@project-nightfall.com
                                    </a>
                                </p>
                                <p class="text-slate-400">
                                    For general questions, feedback, or support requests.
                                </p>
                            </div>
                            
                            <div class="bg-slate-800 rounded-lg p-6">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg class="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                                    </svg>
                                    Legal & Compliance
                                </h3>
                                <p class="text-purple-400 text-lg mb-2">
                                    <a href="mailto:legal@project-nightfall.com" class="hover:text-purple-300 transition-colors">
                                        legal@project-nightfall.com
                                    </a>
                                </p>
                                <p class="text-slate-400">
                                    For DMCA notices, legal inquiries, and compliance matters.
                                </p>
                            </div>
                            
                            <div class="bg-slate-800 rounded-lg p-6">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg class="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
                                    </svg>
                                    Business Inquiries
                                </h3>
                                <p class="text-purple-400 text-lg mb-2">
                                    <a href="mailto:business@project-nightfall.com" class="hover:text-purple-300 transition-colors">
                                        business@project-nightfall.com
                                    </a>
                                </p>
                                <p class="text-slate-400">
                                    For partnership opportunities, advertising, and business development.
                                </p>
                            </div>
                            
                            <div class="bg-slate-800 rounded-lg p-6">
                                <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                                    <svg class="w-6 h-6 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Response Time
                                </h3>
                                <p class="text-slate-300 leading-relaxed">
                                    We strive to respond to all inquiries within 24-48 hours during business days. For urgent legal matters, please mark your email as "URGENT" in the subject line.
                                </p>
                            </div>
                        </div>
                        
                        <div class="mt-8 bg-slate-800 rounded-lg p-6">
                            <h3 class="text-xl font-semibold text-white mb-4">Additional Support</h3>
                            <p class="text-slate-300 leading-relaxed mb-4">
                                Before contacting us, you may find answers to common questions in our legal pages:
                            </p>
                            <div class="flex flex-wrap gap-2">
                                <span class="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">Terms of Service</span>
                                <span class="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">Privacy Policy</span>
                                <span class="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">DMCA Policy</span>
                                <span class="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">2257 Compliance</span>
                            </div>
                        </div>
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