import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-[rgb(155,135,245)] mb-4 text-left">
        Refund and Return Policy – LaptopLelo.in
      </h1>
      <p className="mb-8 text-sm text-gray-600 text-left">Last updated: May 6, 2025</p>

      <div className="space-y-6">
        {/* Section Block Template */}
        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">1. Eligibility for Return</h1>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Item received is defective, damaged, or not as described.</li>
            <li>Wrong product delivered.</li>
            <li>The product is not functional upon first use (Dead on Arrival).</li>
            <li>Returns must be initiated within 7 days from the date of delivery.</li>
            <li>The product must be unused, in its original packaging, and with all accessories, manuals, and invoices.</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">2. Non-Returnable Items</h1>
          <p className="mb-2 text-gray-700">The following items are not eligible for return unless damaged or defective upon delivery:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Software, antivirus, or license-based products.</li>
            <li>Products damaged due to customer misuse or improper installation.</li>
            <li>Products with altered or missing serial numbers or warranty stickers.</li>
            <li>Items purchased during clearance sales marked “Final Sale”.</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">3. Return Process</h1>
          <p className="text-gray-700">To initiate a return, customers must contact <a href="mailto:support@laptoplelo.in" className="text-[rgb(155,135,245)] underline">support@laptoplelo.in</a> with:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 mt-2">
            <li>Order ID</li>
            <li>Description and photo/video of the issue</li>
          </ul>
          <p className="mt-2 text-gray-700">
            Once approved, we will schedule a reverse pickup (if available). In areas without reverse pickup, customers may need to ship the item back and share the tracking details.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">4. Inspection and Approval</h1>
          <p className="text-gray-700">
            Returned products will be inspected by the vendor or LaptopLelo.in team. Approval or rejection of the return/refund will be communicated within 5–7 business days of receiving the item.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">5. Refund Process</h1>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>Refunds will be processed via the original payment method.</li>
            <li>For prepaid orders: Refund within 7 business days of approval.</li>
            <li>For COD orders: Customers must provide bank details for NEFT refund.</li>
            <li>Shipping charges are non-refundable (unless item is defective or incorrect).</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">6. Replacement Policy</h1>
          <p className="text-gray-700">
            Customers may request a replacement instead of a refund. Replacements depend on stock availability. If not available, a full refund will be issued.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">7. Vendor Responsibility</h1>
          <p className="text-gray-700">
            Vendors must honor all approved return and refund requests. Non-compliance may lead to penalties or account suspension.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-sm text-left">
          <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-3">8. Contact Us</h1>
          <p className="text-gray-700">For any return or refund-related assistance:</p>
          <ul className="list-none mt-2 text-gray-700">
            <li><strong>LaptopLelo.in</strong></li>
            <li>Email: <a href="mailto:support@laptoplelo.in" className="text-[rgb(155,135,245)] underline">support@laptoplelo.in</a></li>
            <li>Address: [Insert Business Address Here]</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
