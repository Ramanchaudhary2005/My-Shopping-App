import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || 'guest';
      const response = await fetch(`http://localhost:3900/api/v1/orders/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Unexpected response from server.');
      }
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load orders");
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 pt-24">
        <h1 className="text-2xl font-bold mb-4">Order History</h1>
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && orders.length === 0 && (
          <div className="bg-white p-6 rounded shadow-sm">No orders found.</div>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-4 rounded shadow-sm">
              <div className="flex flex-wrap justify-between gap-3 border-b pb-3 mb-3">
                <div>
                  <div className="text-sm text-gray-600">Order ID</div>
                  <div className="font-medium">{order._id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Status</div>
                  <div className="font-medium capitalize">{order.status || 'placed'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="font-semibold">₹{((order.totalAmount || 0) * 88).toFixed(0)}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(order.items || []).map((it) => (
                  <div key={(it._id || it.productId) + String(Math.random())} className="flex gap-3 items-center">
                    <img src={it.thumbnail || it.image} alt={it.name} className="w-14 h-14 object-contain border rounded" />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-2">{it.name}</div>
                      <div className="text-sm text-gray-600">Qty: {it.quantity}</div>
                      <div className="text-sm font-semibold">₹{((it.price || 0) * (it.quantity || 1) * 88).toFixed(0)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { OrderHistoryPage };


