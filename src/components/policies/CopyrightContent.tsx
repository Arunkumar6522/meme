import React from 'react';

export const CopyrightContent: React.FC = () => (
    <div className="prose prose-sm sm:prose max-w-none text-gray-500">
        <div className="bg-primary-50 border-l-4 border-primary-600 p-6 mb-8 rounded">
            <h2 className="text-primary-900 mt-0 mb-2">Copyright & DMCA Takedown Policy</h2>
            <p className="text-primary-800 mb-0">
                ilovememe.in respects intellectual property rights. This page explains how to report copyright infringement and our takedown procedures.
            </p>
        </div>

        <h3>Our Platform</h3>
        <p>
            <strong>ilovememe.in is a user-generated content (UGC) platform.</strong> We do not create, upload, or own the content on our website. All memes, audio, videos, and images are uploaded by our users. We operate as a hosting platform, similar to social media services.
        </p>
        <p>
            <strong>We do NOT:</strong>
        </p>
        <ul>
            <li>Create or produce content</li>
            <li>Monetize user content for profit (we're not an OTT platform)</li>
            <li>Claim ownership of user uploads</li>
            <li>Pre-screen or approve content before it's published</li>
        </ul>
        <p>
            <strong>We DO:</strong>
        </p>
        <ul>
            <li>Provide a platform for users to share meme content</li>
            <li>Respond promptly to valid copyright complaints</li>
            <li>Remove infringing content when properly notified</li>
            <li>Terminate accounts of repeat infringers</li>
        </ul>

        <h3>For Content Uploaders: Your Responsibilities</h3>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
            <p className="font-semibold text-yellow-900 mb-2">⚠️ Before You Upload:</p>
            <p className="text-yellow-800 mb-0">
                You MUST own the rights to the content OR have permission from the copyright owner. Uploading copyrighted material without authorization is illegal and violates our Terms of Service.
            </p>
        </div>

        <p>
            <strong>You may upload content if:</strong>
        </p>
        <ul>
            <li>✅ You created the content yourself</li>
            <li>✅ You have written permission from the copyright owner</li>
            <li>✅ The content is in the public domain</li>
            <li>✅ Your use qualifies as fair use/fair dealing (educational, commentary, parody, etc.)</li>
        </ul>

        <p>
            <strong>You must NOT upload:</strong>
        </p>
        <ul>
            <li>❌ Movies, TV shows, or commercial videos you don't own</li>
            <li>❌ Copyrighted music or audio without permission</li>
            <li>❌ Images or artwork created by others without permission</li>
            <li>❌ Any content that infringes on third-party rights</li>
        </ul>

        <h3>For Copyright Owners: How to Report Infringement</h3>
        <p>
            If you believe your copyrighted work has been uploaded to ilovememe.in without your permission, we will remove it promptly upon receiving a valid DMCA takedown notice.
        </p>

        <h4>Step 1: Identify the Infringing Content</h4>
        <p>
            Locate the specific content on our platform that infringes your copyright. Note the URL or content ID.
        </p>

        <h4>Step 2: Send a DMCA Takedown Notice</h4>
        <p>
            Email your takedown notice to: <strong className="text-primary-600">copyright@ilovememe.in</strong>
        </p>

        <h4>Step 3: Include Required Information</h4>
        <p>
            Your notice must include ALL of the following:
        </p>
        <ol>
            <li>
                <strong>Your Contact Information:</strong>
                <ul>
                    <li>Full legal name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Mailing address</li>
                </ul>
            </li>
            <li>
                <strong>Description of Copyrighted Work:</strong>
                <ul>
                    <li>Detailed description of the work being infringed</li>
                    <li>If available, provide a link to the original work</li>
                </ul>
            </li>
            <li>
                <strong>Location of Infringing Content:</strong>
                <ul>
                    <li>Direct URL(s) to the infringing content on ilovememe.in</li>
                    <li>Content ID or title if URL is not available</li>
                </ul>
            </li>
            <li>
                <strong>Good Faith Statement:</strong>
                <ul>
                    <li>"I have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law."</li>
                </ul>
            </li>
            <li>
                <strong>Accuracy Statement:</strong>
                <ul>
                    <li>"I declare, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or authorized to act on behalf of the copyright owner."</li>
                </ul>
            </li>
            <li>
                <strong>Signature:</strong>
                <ul>
                    <li>Physical or electronic signature</li>
                </ul>
            </li>
        </ol>

        <h4>Sample DMCA Notice Template</h4>
        <div className="bg-gray-100 p-4 rounded font-mono text-sm my-4">
            <p>To: copyright@ilovememe.in</p>
            <p>Subject: DMCA Takedown Notice</p>
            <br />
            <p>I, [Your Full Name], am the copyright owner (or authorized agent) of the following work:</p>
            <p>[Description of copyrighted work]</p>
            <br />
            <p>The following content on ilovememe.in infringes my copyright:</p>
            <p>URL: [URL of infringing content]</p>
            <br />
            <p>Contact Information:</p>
            <p>Name: [Your Name]</p>
            <p>Email: [Your Email]</p>
            <p>Phone: [Your Phone]</p>
            <p>Address: [Your Address]</p>
            <br />
            <p>I have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.</p>
            <br />
            <p>I declare, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or authorized to act on behalf of the copyright owner.</p>
            <br />
            <p>Signature: [Your Signature]</p>
            <p>Date: [Date]</p>
        </div>

        <h3>Our Response Process</h3>
        <p>
            <strong>Timeline:</strong>
        </p>
        <ul>
            <li>✅ We acknowledge receipt within 24 hours</li>
            <li>✅ We review the notice within 48 hours</li>
            <li>✅ Valid notices: Content removed within 48-72 hours</li>
            <li>✅ Uploader notified of removal</li>
        </ul>

        <p>
            <strong>What Happens After Removal:</strong>
        </p>
        <ul>
            <li>The infringing content is immediately removed</li>
            <li>The uploader receives a copyright strike</li>
            <li>The uploader may file a counter-notice if they believe the removal was in error</li>
            <li>Repeat offenders (3 strikes) will have their accounts permanently terminated</li>
        </ul>

        <h3>Counter-Notice (For Uploaders)</h3>
        <p>
            If you believe your content was removed by mistake or misidentification, you may file a counter-notice to: <strong>copyright@ilovememe.in</strong>
        </p>
        <p>
            Your counter-notice must include:
        </p>
        <ul>
            <li>Your contact information</li>
            <li>Identification of the removed content</li>
            <li>A statement under penalty of perjury that the content was removed by mistake</li>
            <li>Consent to jurisdiction of your local court</li>
            <li>Your signature</li>
        </ul>

        <h3>Repeat Infringer Policy</h3>
        <p>
            We take copyright infringement seriously. Users who receive multiple valid copyright strikes will face:
        </p>
        <ul>
            <li><strong>1st Strike:</strong> Warning + content removal</li>
            <li><strong>2nd Strike:</strong> Temporary account suspension (7 days)</li>
            <li><strong>3rd Strike:</strong> Permanent account termination</li>
        </ul>

        <h3>False Claims</h3>
        <p>
            Filing a false DMCA notice is illegal and may result in:
        </p>
        <ul>
            <li>Legal liability for damages</li>
            <li>Perjury charges</li>
            <li>Attorney fees</li>
        </ul>
        <p>
            Only file a DMCA notice if you genuinely own the copyright or are authorized to act on behalf of the owner.
        </p>

        <h3>Contact Information</h3>
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg my-6">
            <h4 className="mt-0">DMCA Agent Contact</h4>
            <p className="mb-2"><strong>Email:</strong> <a href="mailto:copyright@ilovememe.in" className="text-primary-600 hover:text-primary-700">copyright@ilovememe.in</a></p>
            <p className="mb-2"><strong>Response Time:</strong> 24-72 hours</p>
            <p className="mb-2"><strong>For General Support:</strong> <a href="mailto:support@ilovememe.in" className="text-primary-600 hover:text-primary-700">support@ilovememe.in</a></p>
            <p className="mb-0"><strong>Platform:</strong> ilovememe.in</p>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 my-6">
            <p className="font-semibold text-green-900 mb-2">✅ We're Here to Help</p>
            <p className="text-green-800 mb-0">
                We respect copyright and will work with rights holders to resolve issues quickly. If you have questions about our copyright policy, please contact us at copyright@ilovememe.in
            </p>
        </div>

        <p className="text-sm text-gray-600 italic mt-8">
            Last Updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
    </div>
);
