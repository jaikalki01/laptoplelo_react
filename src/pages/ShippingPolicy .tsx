import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold text-[rgb(155,135,245)] mb-6">
        Shipping Policy – mumbaipcmart.in
      </h1>
      <p className="mb-6 text-sm text-gray-600">Last updated: May 6, 2025</p>
      <p className="mb-6">
        mumbaipcmart.in is committed to ensuring a smooth and reliable shipping experience for all customers. This policy outlines the terms related to product shipping, order processing, tracking, and timelines.
      </p>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">1. Shipping Coverage</h1>
        <p>
          We deliver across India to all serviceable pin codes. Orders may be fulfilled and shipped directly by the vendors registered on mumbaipcmart.in.
        </p>
      </section>

      <section className="mb-6 bg-gray-100 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">2. Order Processing Time</h1>
        <p>
          Orders are usually processed within 1–3 business days from the date of purchase. Orders placed on weekends or holidays will be processed on the next business day. In the case of refurbished or second-hand laptops, processing may take up to 5 business days for quality assurance and testing.
        </p>
      </section>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">3. Shipping Methods and Delivery Time</h1>
        <p>
          <strong>Standard Delivery:</strong> Estimated delivery time is 3–10 business days depending on location. Delivery timelines are estimated and may vary due to logistical constraints or unforeseen circumstances.
        </p>
      </section>

      <section className="mb-6 bg-gray-100 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">4. Shipping Charges</h1>
        <p>
          Shipping charges, if applicable, will be displayed at checkout. Free shipping may be offered on select products or during promotional campaigns.
        </p>
      </section>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">5. Order Tracking</h1>
        <p>
          Once your order is dispatched, you will receive a shipping confirmation email or SMS with the tracking number and courier details. You can also track your order status via your mumbaipcmart.in account dashboard.
        </p>
      </section>

      <section className="mb-6 bg-gray-100 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">6. Delays and Unavailability</h1>
        <p>
          mumbaipcmart.in and its vendors are not liable for delays caused by force majeure, courier partner issues, or incorrect shipping information provided by the customer. In case of delivery failure, the product may be returned to the vendor, and additional charges may apply for re-shipment.
        </p>
      </section>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">7. Packaging and Handling</h1>
        <p>
          Products are securely packaged to prevent damage during transit. Please inspect the package upon delivery. If you find any visible damage, report it immediately to the delivery personnel and to us at <a href="mailto:support@mumbaipcmart.in" className="text-[rgb(155,135,245)] underline">support@mumbaipcmart.in</a>.
        </p>
      </section>

      <section className="mb-6 bg-gray-100 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">8. Multiple Shipments</h1>
        <p>
          If your order contains multiple products, they may be shipped separately and arrive on different days.
        </p>
      </section>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">9. Vendor Responsibilities</h1>
        <p>
          Vendors are responsible for timely dispatch and providing correct tracking information. Repeated shipping delays or issues may lead to penalties or account suspension.
        </p>
      </section>

      <section className="mb-6 bg-gray-50 p-4 rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-[rgb(155,135,245)] mb-2">10. Contact Us</h1>
        <p>For shipping-related queries, please contact:</p>
        <ul className="list-none mt-2">
          <li><strong>mumbaipcmart.in</strong></li>
          <li>Email: <a href="mailto:support@mumbaipcmart.in" className="text-[rgb(155,135,245)] underline">support@mumbaipcmart.in</a></li>
          <li>Address: Jaikalki Technology Pvt Ltd Anand India Business Hub, Mira Road, Mumbai, India</li>
        </ul>
      </section>
    </div>
  );
};

export default ShippingPolicy;
