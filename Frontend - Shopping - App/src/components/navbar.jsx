import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TfiMenuAlt } from "react-icons/tfi"; 
import { FiSearch, FiUser, FiHeart, FiShoppingBag } from "react-icons/fi";
import { isAuthenticated, logoutLocal } from "../utils/auth";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
    
    const handleSearch = ()=>{
        navigate(`/search?text=${searchText}`);
    };
    
    const handleLogout = () => {
        logoutLocal();
        setLoggedIn(false);
        setIsMenuOpen(false);
        navigate("/");
    };

    useEffect(()=>{
        setLoggedIn(isAuthenticated());
        const onStorage = ()=> setLoggedIn(isAuthenticated());
        window.addEventListener('storage', onStorage);
        return ()=> window.removeEventListener('storage', onStorage);
    },[]);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center mr-2">
                                <span className="text-white font-bold text-lg">M</span>
                            </div>
                            <span className="text-xl font-bold text-gray-800">My Shopping App</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8 ml-12">
                        
                        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            FASHION
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            KIDS
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            HOME
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            ELECTRONICS
                        </Link>
                        <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                            SPORT
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for products, brands and more"
                                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchText} 
                                onChange={(e)=>{setSearchText(e.target.value)}}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* User Icons */}
                    <div className="flex items-center space-x-6">
                        {!loggedIn ? (
                            <>
                                <Link to="/login" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
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
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                                    <FiUser size={20} />
                                    <span className="text-xs mt-1">Profile</span>
                                </Link>
                                <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors">
                                    <FiHeart size={20} />
                                    <span className="text-xs mt-1">Wishlist</span>
                                </Link>
                                <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-gray-900 transition-colors relative">
                                    <FiShoppingBag size={20} />
                                    <span className="text-xs mt-1">Cart</span>
                                    <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5 min-w-[16px] text-center">{/* cart count */}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {/* Menu Button - Always Visible */}
                        <button
                            onClick={()=> setIsMenuOpen((v)=>!v)}
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                            aria-label="Menu"
                        >
                            <TfiMenuAlt size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu - Always Visible */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={()=> setIsMenuOpen(false)}>
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl p-4 animate-slide-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Menu</h3>
                            <button onClick={()=> setIsMenuOpen(false)} className="px-2 py-1 rounded hover:bg-gray-100 text-gray-600">✕</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {loggedIn ? (
                                <>
                                    <button onClick={handleLogout} className="text-left w-full px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Signout</button>
                                    <Link to="/profile" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Profile</Link>
                                    <Link to="/address" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Address</Link>
                                    <Link to="/addresses" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Manage Addresses</Link>
                                    <Link to="/orders" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Orders</Link>
                                    <Link to="/order-history" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Order History</Link>
                                    <Link to="/wishlist" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Wishlist</Link>
                                    <Link to="/cart" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Cart</Link>
                                    <Link to="/seller" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Become a Seller</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Login</Link>
                                    <Link to="/signup" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">SignUp</Link>
                                    <Link to="/wishlist" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Wishlist</Link>
                                    <Link to="/cart" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-gray-100 text-gray-700">Cart</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )    
}

export { Navbar };