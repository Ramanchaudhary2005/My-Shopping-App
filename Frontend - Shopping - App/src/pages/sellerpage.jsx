import { useState } from "react";
import { Navbar } from "../components/navbar";

const initial = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  discountPercentage: "",
  quantity: "",
  thumbnail: "",
  images: "",
};

const SellerPage = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const onChange = (key, val) => setForm({ ...form, [key]: val });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!form.title.trim() || !form.price) {
      setMessage("Title and Price are required");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        brand: form.brand,
        price: Number(form.price),
        discountPercentage: form.discountPercentage ? Number(form.discountPercentage) : undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        thumbnail: form.thumbnail,
        images: form.images ? form.images.split(",").map(s => s.trim()).filter(Boolean) : undefined,
      };
      const res = await fetch('http://localhost:3900/api/v1/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');
      setMessage('Product listed successfully');
      setForm(initial);
    } catch (err) {
      setMessage(err.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Become a Seller</h1>
        <p className="text-sm text-gray-600 mb-4">Add your product details below to list it on the store.</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Title *</label>
              <input className="w-full px-3 py-2 border rounded" value={form.title} onChange={(e)=> onChange('title', e.target.value)} placeholder="Product title" />
            </div>
            <div>
              <label className="block text-sm mb-1">Brand</label>
              <input className="w-full px-3 py-2 border rounded" value={form.brand} onChange={(e)=> onChange('brand', e.target.value)} placeholder="Brand" />
            </div>
            <div>
              <label className="block text-sm mb-1">Category</label>
              <input className="w-full px-3 py-2 border rounded" value={form.category} onChange={(e)=> onChange('category', e.target.value)} placeholder="Category" />
            </div>
            <div>
              <label className="block text-sm mb-1">Price (₹) *</label>
              <input type="number" min="1" className="w-full px-3 py-2 border rounded" value={form.price} onChange={(e)=> onChange('price', e.target.value)} placeholder="1000" />
            </div>
            <div>
              <label className="block text-sm mb-1">Discount %</label>
              <input type="number" min="0" max="100" className="w-full px-3 py-2 border rounded" value={form.discountPercentage} onChange={(e)=> onChange('discountPercentage', e.target.value)} placeholder="10" />
            </div>
            <div>
              <label className="block text-sm mb-1">Quantity</label>
              <input type="number" min="1" className="w-full px-3 py-2 border rounded" value={form.quantity} onChange={(e)=> onChange('quantity', e.target.value)} placeholder="1" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Thumbnail URL</label>
              <input className="w-full px-3 py-2 border rounded" value={form.thumbnail} onChange={(e)=> onChange('thumbnail', e.target.value)} placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Images URLs (comma separated)</label>
              <input className="w-full px-3 py-2 border rounded" value={form.images} onChange={(e)=> onChange('images', e.target.value)} placeholder="https://..., https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <textarea className="w-full px-3 py-2 border rounded" rows="4" value={form.description} onChange={(e)=> onChange('description', e.target.value)} placeholder="Describe your product" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded disabled:opacity-50">
              {submitting ? 'Listing...' : 'List Product'}
            </button>
            {message && <span className="text-sm text-green-600">{message}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export { SellerPage };


