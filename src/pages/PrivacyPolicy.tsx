import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-[rgb(155,135,245)] mb-6">
        Privacy Policy – MumbaiPcMart.com
      </h1>
      <p className="mb-6 text-sm text-gray-600">Last updated: May 6, 2025</p>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Information We Collect</h1>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>a. Personal Information</strong>
            <ul className="list-inside list-decimal space-y-1 ml-4">
              <li>Name, email address, phone number</li>
              <li>Shipping and billing address</li>
              <li>Government-issued ID (for vendor KYC)</li>
              <li>Bank account or UPI details (for vendors)</li>
            </ul>
          </li>
          <li><strong>b. Device and Usage Information</strong>
            <ul className="list-inside list-decimal space-y-1 ml-4">
              <li>IP address, browser type, and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited, time spent, referring websites</li>
            </ul>
          </li>
          <li><strong>c. Transaction Data</strong>
            <ul className="list-inside list-decimal space-y-1 ml-4">
              <li>Order history</li>
              <li>Payment details (processed via secure third-party gateways)</li>
            </ul>
          </li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">How We Use Your Information</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Creating and managing user/vendor accounts</li>
          <li>Processing orders and payments</li>
          <li>Verifying vendor identity and legal compliance</li>
          <li>Providing customer support</li>
          <li>Marketing and promotional communication (only with user consent)</li>
          <li>Improving platform performance and security</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Sharing of Information</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Payment gateways and logistics partners (to fulfill orders)</li>
          <li>Government or law enforcement (where legally required)</li>
          <li>Our internal service providers and consultants</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Cookies and Tracking Technologies</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Maintain session information</li>
          <li>Customize your user experience</li>
          <li>Analyze usage and improve services</li>
          <li>You may manage cookie preferences through your browser settings.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Data Security</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>We implement appropriate technical and organizational security measures, including encryption and secure servers, to protect your data.</li>
          <li>However, no system is 100% secure, and we cannot guarantee absolute security of your information.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Your Rights</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the data we hold about you</li>
          <li>Request correction of incorrect or incomplete data</li>
          <li>Request deletion of your data (subject to legal and transactional requirements)</li>
          <li>Withdraw consent for marketing communications</li>
          <li>To exercise your rights, contact us at: <a href="mailto:support@mumbaipcmart.in" className="text-[rgb(155,135,245)] underline">support@mumbaipcmart.in</a></li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Data Retention</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>We retain your personal information as long as necessary for legal, operational, or business purposes.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Third-Party Links</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Our platform may contain links to third-party websites. We are not responsible for their privacy practices.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Updates to This Policy</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>We may update this Privacy Policy from time to time. All updates will be posted on this page with a revised effective date.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Contact Us</h1>
        <p>For any queries, please contact:</p>
        <ul className="list-none mt-2">
          <li><strong>MumbaiPcMart.com</strong></li>
          <li>Email: <a href="mailto:support@mumbaipcmart.in" className="text-[rgb(155,135,245)] underline">support@mumbaipcmart.in</a></li>
          <li>Address: Jaikalki Technology Pvt Ltd Anand India Business Hub, Mira Road, Mumbai, India</li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
