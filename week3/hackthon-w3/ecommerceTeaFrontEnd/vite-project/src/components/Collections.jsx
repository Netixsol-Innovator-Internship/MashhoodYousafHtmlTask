import React from "react";
import { FaCoffee, FaCertificate, FaTruck, FaTag } from "react-icons/fa";

const Collections = () => {
  return (
    <>
      <section className="flex flex-col md:flex-row max-w-s7xl mx-austo md:p-1s2 p-6 gap-8 md:gap-19">
        {/* Left image container */}
        <div className="w-full md:w-1/2 relastive">
          <img
            src="/images/spoons.jpg" // Replace this with your image path
            alt="Tea spoons and leaves"
            className="w-full h-[550px] object-cover "
            style={{ minHeight: "400px" }} // adjust height for desktop view
          />
        </div>

        {/* Right content container */}
        <div className="w-full md:w-1/3 flex flex-col ml-16 justify-center text-center md:text-left">
          <h2 className="font-semibold text-4xl mb-6 max-w-md leading-snug">
            Every day is unique, <br /> just like our tea
          </h2>

          <p className="text-gray-700 mb-6 max-w-[370px]">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>
          <p className="text-gray-700 mb-10 max-w-[370px]">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>

          <button className="bg-black text-white px-14 py-3 s max-w-max hover:bg-gray-800 transition">
            BROWSE TEAS
          </button>
        </div>
      </section>

      <section className="bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center">
            {/* Feature Items - centered with flex-col and items-center */}
            <div className="flex flex-wrap justify-around   gap-8 md:gap-12 w-full py-4">
              <FeatureItem
                icon={<FaCoffee size={18} />}
                text="450+ KIND OF LOOSEF TEA"
              />
              <FeatureItem
                icon={<FaCertificate size={18} />}
                text="CERTIFICATED ORGANIC TEAS"
              />
              <FeatureItem icon={<FaTruck size={18} />} text="FREE DELIVERY" />
              <FeatureItem
                icon={<FaTag size={18} />}
                text="SAMPLE FOR ALL TEAS"
              />
            </div>

            {/* Button - centered with flex and justify-center */}
            <div className="flex justify-center mt-6">
              <button className="border border-gray-600 text-gray-600 uppercase px-6 py-2 text-sm tracking-wider hover:bg-gray-200 transition">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-700 font-semibold uppercase">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
export default Collections;
