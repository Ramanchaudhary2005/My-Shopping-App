import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Link } from "react-router-dom";

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Your Wishlist</h1>
          <Link to="/cart" className="text-blue-600 hover:underline">Go to Cart</Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((it) => (
              <div key={it._id} className="bg-white p-4 rounded shadow-sm flex gap-4">
                <img src={it.thumbnail} alt={it.name} className="w-20 h-20 object-contain border rounded" />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-600">₹{(it.price * 88).toFixed(0)}</div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={()=> moveToCart(it._id)} className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded">Move to Cart</button>
                    <button onClick={()=> removeItem(it._id)} className="px-3 py-1 border rounded">Remove</button>
                  </div>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="bg-white p-6 rounded shadow-sm text-gray-600">No items in wishlist.</div>
            )}
          </div>
        )}
        {message && <div className="mt-3 text-green-600">{message}</div>}
      </div>
    </div>
  );
};

export { WishlistPage };


