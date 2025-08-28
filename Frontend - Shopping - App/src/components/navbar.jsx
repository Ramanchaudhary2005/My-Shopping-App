import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TfiMenuAlt } from "react-icons/tfi"; 
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
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900 shadow-xl font-sans text-white rounded-none w-full">
            {/* My Shopping App Logo */}
            <div className="flex-shrink-0">
                <a href="/" className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                    My Shopping App
                </a>
            </div>

            {/* Search Input and Button */}
            <div className="flex items-center gap-0 flex-1 max-w-full sm:max-w-none">
                <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 pl-4 w-full sm:w-48 md:w-64 rounded-l-full bg-zinc-800 border-2 border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder:text-zinc-400"
                    value={searchText} onChange={(e)=>{setSearchText(e.target.value)}}
                />
                <button className="p-2 px-4 rounded-r-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-300 cursor-pointer"
                onClick={handleSearch}>
                    Search
                </button>
            </div>
            
            {/* Navigation Links, including the new menu icon */}
            <div className="flex items-center gap-3 sm:gap-6">
                <Link
                    to="/"
                    className="text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200"
                >
                    Home
                </Link>

                {!loggedIn && (
                    <>
                        <Link
                            to="/login"
                            className="text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                            SignUp
                        </Link>
                    </>
                )}

                {loggedIn && (
                    <>
                        <Link to="/cart" className="relative text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200">
                            Cart
                            <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white rounded-full px-1.5 py-0.5">{/* cart count */}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200"
                        >
                            Logout
                        </button>
                    </>
                )}

                <button
                    onClick={()=> setIsMenuOpen((v)=>!v)}
                    className="text-zinc-300 font-medium hover:text-white hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors duration-200"
                    aria-label="Menu"
                >
                    <TfiMenuAlt size={24} />
                </button>
            </div>

            {isMenuOpen && (
                <div className="fixed inset-0 z-40" onClick={()=> setIsMenuOpen(false)}>
                    <div className="absolute inset-0 bg-black/50"></div>
                    <div className="absolute right-0 top-0 h-full w-72 bg-zinc-900 shadow-2xl p-4 animate-slide-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Menu</h3>
                            <button onClick={()=> setIsMenuOpen(false)} className="px-2 py-1 rounded hover:bg-zinc-800">✕</button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {loggedIn ? (
                                <>
                                    <button onClick={handleLogout} className="text-left w-full px-3 py-2 rounded hover:bg-zinc-800">Signout</button>
                                    <Link to="/profile" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Profile</Link>
                                    <Link to="/address" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Address</Link>
                                    <Link to="/addresses" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Manage Addresses</Link>
                                    <Link to="/orders" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Orders</Link>
                                    <Link to="/order-history" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Order History</Link>
                                    <Link to="/wishlist" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Wishlist</Link>
                                    <Link to="/seller" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Become a Seller</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">Login</Link>
                                    <Link to="/signup" onClick={()=> setIsMenuOpen(false)} className="px-3 py-2 rounded hover:bg-zinc-800">SignUp</Link>
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