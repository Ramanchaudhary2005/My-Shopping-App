import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";

const WishlistPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3900/api/v1/wishlist');
      const data = await res.json();
      if (res.ok) setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  const removeItem = async (id) => {
    const res = await fetch(`http://localhost:3900/api/v1/wishlist/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (res.ok) setItems(data.data || []);
  };

  const moveToCart = async (id) => {
    const res = await fetch(`http://localhost:3900/api/v1/wishlist/${id}/move-to-cart`, { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setItems(data.data?.wishlist || []);
      setMessage('Moved to cart');
      setTimeout(()=> setMessage(''), 1200);
    }
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            My Wishlist {items.length > 0 && `${items.length} item${items.length > 1 ? 's' : ''}`}
          </h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-4">Your wishlist is empty</div>
            <Link to="/" className="text-blue-600 hover:underline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const currentPrice = (item.price * 88).toFixed(0);
              const originalPrice = (item.price * 1000).toFixed(0); // Assuming original price is higher
              const discount = calculateDiscount(parseInt(currentPrice), parseInt(originalPrice));
              
              return (
                <div key={item._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="relative">
                    {/* Product Image */}
                    <div className="relative">
                      <img 
                        src={item.thumbnail} 
                        alt={item.name} 
                        className="w-full h-48 object-cover"
                      />
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeItem(item._id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                      >
                        <FiX size={16} className="text-gray-600" />
                      </button>
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4">
                      {/* Product Name */}
                      <h3 className="font-medium text-gray-800 mb-2 truncate">
                        {item.name.length > 25 ? `${item.name.substring(0, 25)}...` : item.name}
                      </h3>
                      
                      {/* Pricing */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg font-bold text-gray-800">₹{currentPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                        {discount > 0 && (
                          <span className="text-sm font-medium text-orange-600">({discount}% OFF)</span>
                        )}
                      </div>
                      
                      {/* Move to Bag Button */}
                      <button 
                        onClick={() => moveToCart(item._id)}
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        MOVE TO CART
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {message && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export { WishlistPage };


