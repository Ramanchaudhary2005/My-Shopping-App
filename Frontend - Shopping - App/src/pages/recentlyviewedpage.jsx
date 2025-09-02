import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/navbar";
import { Star, Eye, Trash2, ArrowLeft } from "lucide-react";

const RecentlyViewedPage = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentlyViewed();
  }, []);

  const getRecentlyViewed = () => {
    try {
      setLoading(true);
      const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(recent);
    } catch (error) {
      console.error('Error getting recently viewed:', error);
      setRecentlyViewed([]);
    } finally {
      setLoading(false);
    }
  };

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem('recentlyViewed');
      setRecentlyViewed([]);
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  const removeProduct = (productId) => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const filtered = recent.filter(p => p._id !== productId);
      localStorage.setItem('recentlyViewed', JSON.stringify(filtered));
      setRecentlyViewed(filtered);
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-6 h-6 text-orange-500" />
                Recently Viewed Products
              </h1>
              <p className="text-gray-600 mt-1">
                {recentlyViewed.length} product{recentlyViewed.length !== 1 ? 's' : ''} viewed
              </p>
            </div>
          </div>
          
          {recentlyViewed.length > 0 && (
            <button
              onClick={clearRecentlyViewed}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Products Grid */}
        {recentlyViewed.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No Recently Viewed Products</h2>
            <p className="text-gray-500 mb-6">Start browsing products to see them here</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {recentlyViewed.map((item, index) => {
              const discountedPrice = (item.price * (1 - item.discountPercentage / 100) * 88).toFixed(0);
              const originalPrice = (item.price * 88).toFixed(0);
              
              return (
                <div 
                  key={item._id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 group"
                >
                  <div className="relative">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-48 object-contain rounded-t-lg p-4 group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onClick={() => navigate(`/view/${item._id}`)}
                    />
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => removeProduct(item._id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove from recently viewed"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    
                    {/* Discount Badge */}
                    {item.discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                        -{Math.round(item.discountPercentage)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 
                      className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 cursor-pointer hover:text-orange-600 transition-colors"
                      onClick={() => navigate(`/view/${item._id}`)}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < Math.floor(item.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({item.rating.toFixed(1)})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-bold text-gray-900">₹{discountedPrice}</span>
                      {item.discountPercentage > 0 && (
                        <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                      )}
                    </div>
                    
                    {/* Brand */}
                    {item.brand && (
                      <p className="text-xs text-blue-600 font-medium mb-3">{item.brand.toUpperCase()}</p>
                    )}
                    
                    {/* View Product Button */}
                    <button
                      onClick={() => navigate(`/view/${item._id}`)}
                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors text-sm font-medium"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export { RecentlyViewedPage };
