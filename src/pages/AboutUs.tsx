import React from 'react';
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Banner Section */}
      <div
        className="relative w-full h-64 md:h-96 flex items-center justify-center"
        style={{
          backgroundImage: 'url("https://sm.ign.com/t/ign_ap/deal/s/save-500-o/save-500-off-the-most-powerful-alienware-gaming-laptop-of-20_tmn7.1280.jpg")', // replace with actual path
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[rgb(155,135,245)] bg-opacity-60" />
        <h1 className="relative text-white text-4xl md:text-5xl font-bold text-center z-10 drop-shadow-lg">
          About Us
        </h1>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10 text-gray-800">
        <div className="bg-white py-16 px-6 md:px-12 lg:px-24">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2">
            {/* Mission */}
            <div className="bg-blue-100 rounded-2xl shadow p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                At RentTech, we are dedicated to providing high-quality laptops and accessories for rent.
                Whether you're a business, student, or professional, we offer affordable rental solutions for your technology needs.
                Our mission is to make the latest technology accessible without the burden of ownership.
              </p>
            </div>

            {/* What We Offer */}
            <div className="bg-blue-50 rounded-2xl shadow p-8 hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">What We Offer</h2>
              <ul className="space-y-4 text-gray-700 list-disc pl-5">
                <li>
                  <strong>Laptop Rentals:</strong> Rent the latest laptops for short-term or long-term use.
                </li>
                <li>
                  <strong>Accessories:</strong> A variety of accessories including chargers, keyboards, mice, and docking stations.
                </li>
                <li>
                  <strong>Flexible Rental Plans:</strong> Choose from daily, weekly, or monthly rental plans that suit your needs.
                </li>
                <li>
                  <strong>Premium Customer Support:</strong> We provide dedicated support to ensure smooth rental experiences.
                </li>
              </ul>
            </div>

            {/* Single Photo */}
            <div className="md:col-span-2 mt-8 flex justify-center">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThJ0psGP-1j3GzrysV17HRI0cWfiX6b4L_5Q&sm"
                alt="Team or Office"
                className="rounded-xl shadow-lg w-full max-w-3xl"
              />
            </div>


            {/* Why Choose Us */}
            <div className="md:col-span-2 bg-white border-l-4 border-blue-600 p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-blue-800 mb-4">Why Choose Us?</h2>
              <p className="text-gray-700 leading-relaxed">
                RentTech blends technology with affordability. We understand that businesses and individuals
                need reliable tech solutions without the high upfront costs. Our rental service is flexible,
                cost-effective, and designed to meet your specific needs.
                Whether you're attending a conference, need temporary equipment for a project, or looking for
                a cost-effective way to access high-end laptops, we have you covered.
              </p>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-2 bg-white border-l-4 border-blue-600 p-8 rounded-xl shadow-md">
              <div className="md:col-span-2 text-center mt-12">
                <h2 className="text-2xl font-bold text-blue-800 mb-4">Connect With Us</h2>
                <p className="text-gray-700 mb-6">
                  We're here to assist you! Have any questions or need help with a rental? Reach out to us via our{" "}
                  <Link
                    to="/contact"
                    className="text-blue-600 font-medium underline hover:text-blue-800"
                  >
                    Contact Us
                  </Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
