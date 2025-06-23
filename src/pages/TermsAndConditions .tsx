import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-[rgb(155,135,245)] mb-6">
        Terms and Conditions – mumbaipcmart.in
      </h1>
      <p className="mb-6 text-sm text-gray-600">Last updated: May 6, 2025</p>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Definitions</h1>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Platform:</strong> Refers to mumbaipcmart.in.</li>
          <li><strong>Vendor:</strong> Any person or entity registered to sell products via mumbaipcmart.in.</li>
          <li><strong>User:</strong> Any individual or entity browsing or placing orders on the platform.</li>
          <li><strong>Products:</strong> Laptops (new, refurbished, or second-hand), and computer accessories sold through the platform.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Platform Use</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>mumbaipcmart.in provides a marketplace for users to purchase and vendors to sell laptops and accessories.</li>
          <li>Users must be 18 years or older to place orders.</li>
          <li>Vendors must complete a registration process and provide valid business and KYC details.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Product Listings</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Vendors are solely responsible for the accuracy, quality, and legality of the products listed.</li>
          <li>Refurbished and second-hand laptops must be clearly marked as such with detailed condition descriptions.</li>
          <li>All listings must include complete specifications, warranty (if any), and pricing.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Orders and Payments</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Orders placed by users are binding once confirmed.</li>
          <li>Payments are processed via secure payment gateways.</li>
          <li>mumbaipcmart.in may withhold payments to vendors until order delivery is confirmed.</li>
          <li>Prices are inclusive of applicable taxes unless stated otherwise.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Shipping and Delivery</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Vendors are responsible for packaging and shipping products.</li>
          <li>Users will be provided tracking details once orders are dispatched.</li>
          <li>Estimated delivery timeframes are indicative and not guaranteed.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Return and Refund</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Users can request returns for defective or misrepresented products within 7 days of delivery.</li>
          <li>Returns are subject to product condition verification.</li>
          <li>Refunds, if applicable, will be initiated within 7 working days of approval.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Vendor Obligations</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>Vendors must comply with all applicable laws and platform policies.</li>
          <li>Vendors are prohibited from listing counterfeit or illegal items.</li>
          <li>Failure to comply may result in account suspension or termination.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Intellectual Property</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>All content on mumbaipcmart.in, including logos, images, and text, is owned by or licensed to mumbaipcmart.in.</li>
          <li>Unauthorized use is strictly prohibited.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Limitation of Liability</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>mumbaipcmart.in is a marketplace and does not take responsibility for the products sold.</li>
          <li>We are not liable for any damages, losses, or disputes arising from transactions between users and vendors.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Account Suspension or Termination</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>We reserve the right to suspend or terminate any account for breach of these terms or suspected fraudulent activity.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Governing Law</h1>
        <ul className="list-disc list-inside space-y-1">
          <li>These Terms shall be governed by and construed in accordance with the laws of India.</li>
          <li>Any disputes shall be subject to the jurisdiction of the courts in Mumbai, Maharashtra.</li>
        </ul>
      </section>

      <section className="bg-gray-50 p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">Contact Us</h1>
        <p>For any queries, please contact:</p>
        <ul className="list-none mt-2">
          <li><strong>mumbaipcmart.in</strong></li>
          <li>Email: <a href="mailto:support@mumbaipcmart.in" className="text-[rgb(155,135,245)] underline">support@mumbaipcmart.in</a></li>
          <li>Address: Jaikalki Technology Pvt Ltd Anand India Business Hub, Mira Road, Mumbai, India</li>
        </ul>
      </section>
    </div>
  );
};

export default TermsAndConditions;
