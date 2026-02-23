import { useCallback, useEffect, useState } from "react";
import { Navbar } from "../components/navbar";

const ProfilePage = () => {
  const [form, setForm] = useState({ 
    username: "", 
    phone: "", 
    email: "",
    gender: "",
    dateOfBirth: "",
    location: "",
    alternateMobile: "",
    hintName: "",
    avatarUrl: "", 
    paymentPreference: "cash_on_delivery" 
  });
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const userId = typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'guest') : 'guest';

  const loadProfile = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3900/api/v1/users/${userId}/profile`);
      const data = await res.json();
      if (res.ok && data?.data) {
        const d = data.data;
        setForm({
          username: d.username || "",
          phone: d.phone || "",
          email: d.email || "",
          gender: d.gender || "",
          dateOfBirth: d.dateOfBirth || "",
          location: d.location || "",
          alternateMobile: d.alternateMobile || "",
          hintName: d.hintName || "",
          avatarUrl: d.avatarUrl || "",
          paymentPreference: d.paymentPreference || "cash_on_delivery",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }, [userId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
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
      setIsEditing(false);
      setTimeout(()=> setMessage(""), 1500);
    } catch (err) {
      setMessage(err.message || "Failed to update");
    }
  };

  const formatValue = (value) => {
    return value ? value : "- not added -";
  };

  if (isEditing) {
    return (
      <div className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-6 pt-24">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Edit Profile</h1>
          <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  value={form.username} 
                  onChange={(e)=> setForm({...form, username: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter your full name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input 
                  value={form.phone} 
                  onChange={(e)=> setForm({...form, phone: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter 10-digit mobile number" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email ID</label>
                <input 
                  value={form.email} 
                  onChange={(e)=> setForm({...form, email: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter your email" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  value={form.gender} 
                  onChange={(e)=> setForm({...form, gender: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select Gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date"
                  value={form.dateOfBirth} 
                  onChange={(e)=> setForm({...form, dateOfBirth: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  value={form.location} 
                  onChange={(e)=> setForm({...form, location: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter your location" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Mobile</label>
                <input 
                  value={form.alternateMobile} 
                  onChange={(e)=> setForm({...form, alternateMobile: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter alternate mobile" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hint Name</label>
                <input 
                  value={form.hintName} 
                  onChange={(e)=> setForm({...form, hintName: e.target.value})} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" 
                  placeholder="Enter hint name" 
                />
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-medium px-6 py-2 rounded-lg transition-colors">
                Save
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)} 
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {message && <span className="text-green-600 text-sm">{message}</span>}
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-6 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Profile Details</h1>
          <div className="w-24 h-px bg-gray-300 mx-auto mt-2"></div>
        </div>

        {/* Profile Information */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Full Name</span>
              <span className="text-gray-800">{formatValue(form.username)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Mobile Number</span>
              <span className="text-gray-800">{formatValue(form.phone)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Email ID</span>
              <span className="text-gray-800">{formatValue(form.email)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Gender</span>
              <span className="text-gray-800">{formatValue(form.gender)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Date of Birth</span>
              <span className="text-gray-800">{formatValue(form.dateOfBirth)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Location</span>
              <span className="text-gray-800">{formatValue(form.location)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-medium text-gray-700">Alternate Mobile</span>
              <span className="text-gray-800">{formatValue(form.alternateMobile)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Hint Name</span>
              <span className="text-gray-800">{formatValue(form.hintName)}</span>
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-8">
            <button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              EDIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };


