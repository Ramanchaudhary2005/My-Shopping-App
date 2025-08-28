import { Link } from "react-router-dom";
import { Navbar } from "../components/navbar";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      {/* Navbar (unchanged) */}
      <Navbar />

      {/* Center Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-[100px] font-extrabold text-white">
          <span className="text-blue-500">404</span> Error
        </h1>
        <p className="text-gray-400 mt-2 text-sm">
          Oops! That page doesn’t exist!
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-gradient-to-r from-blue-400 to-blue-600 
                     text-white font-medium px-6 py-3 rounded-full shadow-lg 
                     hover:opacity-90 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export { PageNotFound };
