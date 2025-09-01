import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";

const ProfilePage = () => {
  const [form, setForm] = useState({ username: "", phone: "", avatarUrl: "", paymentPreference: "cash_on_delivery" });
  const [message, setMessage] = useState("");

  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const loadProfile = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/profile`);
      const data = await res.json();
      if (res.ok && data?.data) {
        const d = data.data;
        setForm({
          username: d.username || "",
          phone: d.phone || "",
          avatarUrl: d.avatarUrl || "",
          paymentPreference: d.paymentPreference || "cash_on_delivery",
        });
      }
    } catch {}
  };

  useEffect(() => { loadProfile(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (!userId) return setMessage("User not found. Please login again.");
      if (form.phone && !/^\d{10}$/.test(form.phone)) {
        return setMessage("Enter valid 10-digit phone number.");
      }
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      setMessage("Profile updated");
      setTimeout(()=> setMessage(""), 1500);
    } catch (err) {
      setMessage(err.message || "Failed to update");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 pt-24">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input value={form.username} onChange={(e)=> setForm({...form, username: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm mb-1">Phone</label>
              <input value={form.phone} onChange={(e)=> setForm({...form, phone: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="9876543210" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Avatar URL</label>
              <input value={form.avatarUrl} onChange={(e)=> setForm({...form, avatarUrl: e.target.value})} className="w-full px-3 py-2 border rounded" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Payment Preference</label>
              <select value={form.paymentPreference} onChange={(e)=> setForm({...form, paymentPreference: e.target.value})} className="w-full px-3 py-2 border rounded">
                <option value="cash_on_delivery">Cash on Delivery</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded">Save</button>
            {message && <span className="text-green-600 text-sm">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export { ProfilePage };


