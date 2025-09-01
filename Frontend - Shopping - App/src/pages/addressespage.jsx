import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";

const emptyAddr = { fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "India", isDefault: false };

const AddressesPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(emptyAddr);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  const loadAddresses = async () => {
    try {
      if (!userId) return;
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/addresses`);
      const data = await res.json();
      if (res.ok) setAddresses(data.data || []);
    } catch {}
  };

  useEffect(()=>{ loadAddresses(); },[]);

  const validate = () => {
    if (!form.fullName.trim()) return "Full name required";
    if (!/^\d{10}$/.test(form.phone)) return "Valid 10-digit phone required";
    if (!form.street.trim()) return "Street required";
    if (!form.city.trim()) return "City required";
    if (!form.state.trim()) return "State required";
    if (!/^\d{5,6}$/.test(form.zipCode)) return "Valid ZIP required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setMessage(err); return; }
    try {
      if (!userId) return setMessage("User not found. Please login again.");
      const url = editingId ? `http://localhost:3900/api/v1/users/${userId}/addresses/${editingId}` : `http://localhost:3900/api/v1/users/${userId}/addresses`;
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setMessage(editingId ? 'Address updated' : 'Address added');
      setForm(emptyAddr);
      setEditingId(null);
      loadAddresses();
      setTimeout(()=> setMessage(''), 1200);
    } catch (err) {
      setMessage(err.message || 'Failed');
    }
  };

  const setDefault = async (addressId) => {
    try {
      if (!userId) return;
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/addresses/${addressId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isDefault: true }) });
      const data = await res.json();
      if (res.ok) { setAddresses(data.data || []); }
    } catch {}
  };

  const onEdit = (addr) => {
    setEditingId(addr._id);
    setForm({ fullName: addr.fullName || '', phone: addr.phone || '', street: addr.street || '', city: addr.city || '', state: addr.state || '', zipCode: addr.zipCode || '', country: addr.country || 'India', isDefault: addr.isDefault || false });
  };

  const onDelete = async (addressId) => {
    try {
      if (!userId) return;
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/addresses/${addressId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) setAddresses(data.data || []);
    } catch {}
  };

  const autofillPin = async () => {
    if (!/^\d{5,6}$/.test(form.zipCode)) { setMessage('Enter valid ZIP first'); return; }
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${form.zipCode}`);
      const data = await res.json();
      const po = Array.isArray(data) && data[0]?.PostOffice?.[0];
      if (po) {
        setForm({ ...form, city: po.District || form.city, state: po.State || form.state });
      } else {
        setMessage('PIN not found');
      }
    } catch {}
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6 pt-24">
        <h1 className="text-2xl font-bold mb-4">Your Addresses</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-3 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="px-3 py-2 border rounded" placeholder="Full Name" value={form.fullName} onChange={(e)=> setForm({...form, fullName: e.target.value})} />
            <input className="px-3 py-2 border rounded" placeholder="Phone (10 digits)" value={form.phone} onChange={(e)=> setForm({...form, phone: e.target.value})} />
            <div className="flex gap-2">
              <input className="flex-1 px-3 py-2 border rounded" placeholder="ZIP" value={form.zipCode} onChange={(e)=> setForm({...form, zipCode: e.target.value})} />
              <button type="button" onClick={autofillPin} className="px-3 py-2 border rounded">Auto-fill</button>
            </div>
            <input className="md:col-span-3 px-3 py-2 border rounded" placeholder="Street" value={form.street} onChange={(e)=> setForm({...form, street: e.target.value})} />
            <input className="px-3 py-2 border rounded" placeholder="City" value={form.city} onChange={(e)=> setForm({...form, city: e.target.value})} />
            <input className="px-3 py-2 border rounded" placeholder="State" value={form.state} onChange={(e)=> setForm({...form, state: e.target.value})} />
            <select className="px-3 py-2 border rounded" value={form.country} onChange={(e)=> setForm({...form, country: e.target.value})}>
              <option>India</option>
            </select>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.isDefault} onChange={(e)=> setForm({...form, isDefault: e.target.checked})} />
              <span>Set as default</span>
            </label>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded">{editingId ? 'Update Address' : 'Add Address'}</button>
            {editingId && <button type="button" onClick={()=> { setEditingId(null); setForm(emptyAddr); }} className="px-3 py-2 border rounded">Cancel</button>}
            {message && <span className="text-sm text-green-600">{message}</span>}
          </div>
        </form>

        <div className="space-y-3">
          {addresses.map(addr => (
            <div key={addr._id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
              <div>
                <div className="font-medium">{addr.fullName} {addr.isDefault && <span className="text-xs text-green-600">(Default)</span>}</div>
                <div className="text-sm text-gray-600">{addr.phone}</div>
                <div className="text-sm">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}, {addr.country}</div>
              </div>
              <div className="flex gap-2">
                {!addr.isDefault && <button onClick={()=> setDefault(addr._id)} className="px-3 py-1 border rounded">Set Default</button>}
                <button onClick={()=> onEdit(addr)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={()=> onDelete(addr._id)} className="px-3 py-1 border rounded text-red-600">Delete</button>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <div className="bg-white p-4 rounded shadow-sm text-gray-600">No addresses yet. Add one above.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export { AddressesPage };


