import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";

const AddressPage = () => {
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/address`);
        const data = await res.json();
        if (res.ok && data?.data) {
          setAddress({
            fullName: data.data.fullName || "",
            phone: data.data.phone || "",
            street: data.data.street || "",
            city: data.data.city || "",
            state: data.data.state || "",
            zipCode: data.data.zipCode || "",
            country: data.data.country || "India",
          });
        }
      } catch {}
    };
    load();
  }, []);

  const handleChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setMessage("User not found. Please login again.");
        return;
      }
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save');
      setMessage("Address saved successfully.");
      setTimeout(() => setMessage(""), 1500);
    } catch (err) {
      setMessage(err.message || "Failed to save address.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Your Address</h1>
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input value={address.fullName} onChange={(e)=>handleChange('fullName', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input value={address.phone} onChange={(e)=>handleChange('phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="9876543210" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Street</label>
              <input value={address.street} onChange={(e)=>handleChange('street', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="123 Main St" />
            </div>
            <div>
              <label className="block text-sm mb-1">City</label>
              <input value={address.city} onChange={(e)=>handleChange('city', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Mumbai" />
            </div>
            <div>
              <label className="block text-sm mb-1">State</label>
              <input value={address.state} onChange={(e)=>handleChange('state', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="Maharashtra" />
            </div>
            <div>
              <label className="block text-sm mb-1">ZIP Code</label>
              <input value={address.zipCode} onChange={(e)=>handleChange('zipCode', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="400001" />
            </div>
            <div>
              <label className="block text-sm mb-1">Country</label>
              <input value={address.country} onChange={(e)=>handleChange('country', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="India" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded">Save Address</button>
            {message && <span className="text-green-600 text-sm">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export { AddressPage };


