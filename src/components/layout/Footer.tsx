
import { Link } from "react-router-dom";
import { Phone, MessageCircle,Store } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-40">
        <a
          href="https://wa.me/9987108345"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
        <a
          href="tel:+919987108345"
          className="bg-primary text-white rounded-full p-3 shadow-lg hover:bg-purple-700 transition-colors"
        >
          <Phone className="h-6 w-6" />
        </a>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
          <Link to="/" className="flex items-center">
            <Store className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold text-primary">MumbaiPcMart</span>
          </Link><br/>
            <p className="text-gray-600 mb-4">
              Your one-stop destination for laptop buying and renting solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/aboutus"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/products/sale"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Buy Laptops
                </Link>
              </li>
              <li>
                <Link
                  to="/products/rent"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Rent Laptops
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/membership"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Membership
                </Link>
              </li> */}
              <li>
                <Link
                  to="/contact"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping-policy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-600 space-y-2">
              <p>Sh N B1/A Grd Flr Mahavir, Ngr,t</p>
              <p>Deepak Hospital, Mira Road, Thane,</p>
              <p>Maharashtra - 401107</p>
              <p className="mt-2">
                <a href="tel:+919999999999" className="hover:text-primary">
                  +91 9987108345
                </a>
              </p>
              <p>
                <a
                  href="mailto:mumbaipcmart@gmail.com"
                  className="hover:text-primary"
                >
                  mumbaipcmart@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} LaptopLelo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
