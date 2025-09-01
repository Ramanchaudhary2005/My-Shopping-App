import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import Pagination from "../components/pagination.jsx";

const SearchPage = () => {
  const [query] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Filter and sort states
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    sortBy: 'relevance', // relevance, price-low, price-high, rating, newest
    inStock: false,
    discount: false
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sample categories - you can fetch these from your API
  const categories = [
    'All Categories',
    'Electronics',
    'Smartphones',
    'Laptops',
    'Fashion',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Automotive'
  ];

  const getAllProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams({
        q: query.get("text") || '',
        limit: limit.toString(),
        page: page.toString(),
      });

      // Add filters to params
      if (filters.category && filters.category !== 'All Categories') {
        params.append('category', filters.category);
      }
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minRating) params.append('minRating', filters.minRating);
      if (filters.sortBy !== 'relevance') params.append('sortBy', filters.sortBy);
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.discount) params.append('hasDiscount', 'true');

      const response = await fetch(
        `http://localhost:3900/api/v1/products/list?${params.toString()}`,
        { method: "GET" }
      );
      const data = await response.json();
      setProducts(data.data.products || []);
      setTotal(data.data.total || 0);
    } catch (err) {
      alert("Cannot get products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Reset to first page when filters change
  }, [filters, query.get("text")]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line
  }, [query.get("text"), page, filters]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      sortBy: 'relevance',
      inStock: false,
      discount: false
    });
  };

  const FilterSidebar = ({ className = "" }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:underline"
        >
          Clear All
        </button>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Sort By</h4>
        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full p-2 border rounded-md text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Customer Rating</option>
          <option value="newest">Newest First</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Category</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="category"
                value={category}
                checked={filters.category === category || (category === 'All Categories' && !filters.category)}
                onChange={(e) => handleFilterChange('category', e.target.value === 'All Categories' ? '' : e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Price Range (₹)</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Minimum Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating.toString()}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="mr-2"
              />
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">
                  {'★'.repeat(rating)}{'☆'.repeat(5-rating)}
                </span>
                <span className="text-sm text-gray-600">& Up</span>
              </div>
            </label>
          ))}
          <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
            <input
              type="radio"
              name="rating"
              value=""
              checked={!filters.minRating}
              onChange={(e) => handleFilterChange('minRating', '')}
              className="mr-2"
            />
            <span className="text-sm">All Ratings</span>
          </label>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-700">Availability</h4>
        <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">In Stock Only</span>
        </label>
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-3 text-gray-700">Deals</h4>
        <label className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
          <input
            type="checkbox"
            checked={filters.discount}
            onChange={(e) => handleFilterChange('discount', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm">On Sale</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="bg-zinc-100 min-h-screen">
      <Navbar />
      
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden px-4 py-2 bg-white border-b pt-24">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          Filters & Sort
        </button>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar />
          </div>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="bg-white w-80 h-full overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button 
                    onClick={() => setShowMobileFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <FilterSidebar className="m-4" />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">
                  {query.get("text") ? `Search results for "${query.get("text")}"` : 'All Products'}
                </h2>
                <span className="text-sm text-gray-600">
                  {total} results
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <HashLoader size={70} color="#4F39F6" />
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Product Image */}
                      <div
                        onClick={() => navigate(`/view/${product._id}`)}
                        className="flex-shrink-0 w-full md:w-48 h-48 flex items-center justify-center cursor-pointer bg-gray-50 rounded-lg overflow-hidden"
                      >
                        <img
                          src={
                            product.thumbnail ||
                            product.images?.[0] ||
                            "https://via.placeholder.com/200"
                          }
                          alt={product.title}
                          className="w-full h-full object-contain hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex flex-col flex-1">
                        <h3
                          onClick={() => navigate(`/view/${product._id}`)}
                          className="text-lg font-medium text-blue-700 hover:underline cursor-pointer mb-2 line-clamp-2"
                        >
                          {product.title}
                        </h3>

                        <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                          {product.description}
                        </p>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <span className="text-yellow-500 text-sm">
                              {'★'.repeat(Math.floor(product.rating || 0))}
                              {'☆'.repeat(5 - Math.floor(product.rating || 0))}
                            </span>
                            <span className="ml-1 text-sm font-medium">
                              {product.rating?.toFixed(1) || "N/A"}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.reviews?.length || 0} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl font-bold text-black">
                            ₹{(product.price * 88).toFixed(0)}
                          </span>
                          {product.discountPercentage > 0 && (
                            <>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{((product.price * 88) * (100 / (100 - product.discountPercentage))).toFixed(0)}
                              </span>
                              <span className="text-sm text-green-600 font-semibold bg-green-100 px-2 py-1 rounded">
                                {product.discountPercentage}% off
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stock Status */}
                        <p className={`text-sm mb-2 font-medium ${
                          product.availabilityStatus === 'In Stock' ? 'text-green-700' : 'text-red-600'
                        }`}>
                          {product.availabilityStatus || "In Stock"}
                        </p>

                        {/* Shipping */}
                        <p className="text-xs text-gray-500 mb-4">
                          {product.shippingInformation}
                        </p>

                        {/* Add to Cart Button */}
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-lg w-max transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}

                  {products.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg">
                      <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
                      <p className="text-gray-500">Try adjusting your filters or search terms</p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      page={page}
                      totalPages={totalPages}
                      handlePageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { SearchPage };