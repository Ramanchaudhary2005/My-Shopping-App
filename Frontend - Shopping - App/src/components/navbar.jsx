import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TfiMenuAlt } from "react-icons/tfi";
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from "react-icons/fi";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate(`/search?text=${searchText}`);
    };

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mr-2">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">My Shopping App</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-8 ml-12">
                        <Link to="/search?category=fashion" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            FASHION
                        </Link>
                        <Link to="/search?category=kids" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            KIDS
                        </Link>
                        <Link to="/search?category=home" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            HOME
                        </Link>
                        <Link to="/search?category=electronics" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            ELECTRONICS
                        </Link>
                        <Link to="/search?category=sport" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            SPORT
                        </Link>
                    </div>

                    <div className="flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchText}
                                onChange={(e) => { setSearchText(e.target.value); }}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link to="/recently-viewed" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span className="text-xs mt-1">Recent</span>
                        </Link>

                        <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <FiUser size={20} />
                            <span className="text-xs mt-1">Profile</span>
                        </Link>
                        <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <FiHeart size={20} />
                            <span className="text-xs mt-1">Wishlist</span>
                        </Link>
                        <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                            <FiShoppingBag size={20} />
                            <span className="text-xs mt-1">Cart</span>
                        </Link>

                        <button
                            onClick={() => setIsMenuOpen((value) => !value)}
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                            aria-label="Menu"
                        >
                            <TfiMenuAlt size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}>
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-4 animate-slide-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
                            <button onClick={() => setIsMenuOpen(false)} className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600">X</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link to="/recently-viewed" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Recently Viewed</Link>
                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Profile</Link>
                            <Link to="/address" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Address</Link>
                            <Link to="/addresses" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Manage Addresses</Link>
                            <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Orders</Link>
                            <Link to="/order-history" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Order History</Link>
                            <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Wishlist</Link>
                            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Cart</Link>
                            <Link to="/seller" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Become a Seller</Link>
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Login (Optional)</Link>
                            <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Sign Up (Optional)</Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { Navbar };
