import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* COLLECTIONS SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-4">COLLECTIONS</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">LEARN</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Black teas
                  </a>
                </li>
                <li className="text-sm text-gray-600">About us</li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Green teas
                  </a>
                </li>
                <li className="text-sm text-gray-600">About our teas</li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    White teas
                  </a>
                </li>
                <li className="text-sm text-gray-600">Tea academy</li>
              </ul>
            </div>
            <div className="mt-8">
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Herbal teas
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Matcha
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Chai
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Oolong
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Rooibos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-amber-700 transition">
                    Teaware
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CUSTOMER SERVICE SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-4">CUSTOMER SERVICE</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Ordering and payment
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Delivery
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Privacy and policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-amber-700 transition">
                Terms & Conditions
              </a>
            </li>
          </ul>
        </div>

        {/* CONTACT US SECTION */}
        <div>
          <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>
          <address className="not-italic space-y-3">
            <p className="flex items-start">
              <span className="mr-2">💷</span>
              <span>
                3 Falahi, Falahi St, Pasdaran Ave, Shiraz, Fars Providence Iran
              </span>
            </p>
            <p className="flex items-center">
              <span className="mr-2">📧</span>
              <a
                href="mailto:amoopur@gmail.com"
                className="hover:text-amber-700 transition"
              >
                amoopur@gmail.com
              </a>
            </p>
            <p className="flex items-center">
              <span className="mr-2">📜</span>
              <a
                href="tel:+989173038406"
                className="hover:text-amber-700 transition"
              >
                +98 9173038406
              </a>
            </p>
          </address>
        </div>
      </div>

      {/* Divider - hidden on mobile */}
      <div className="max-w-7xl mx-auto mt-8 mb-8 hidden md:block">
        <div className="border-t border-gray-300"></div>
      </div>

      {/* Copyright or additional info can go here */}
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Tea Company. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
