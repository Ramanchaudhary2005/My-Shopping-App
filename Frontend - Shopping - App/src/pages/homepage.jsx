import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealsProducts, setDealsProducts] = useState([]);
  const [electronicsProducts, setElectronicsProducts] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", icon: "📱", color: "bg-blue-100" },
    { name: "Fashion", icon: "👗", color: "bg-pink-100" },
    { name: "Home & Garden", icon: "🏡", color: "bg-green-100" },
    { name: "Sports", icon: "⚽", color: "bg-orange-100" },
    { name: "Books", icon: "📚", color: "bg-purple-100" },
    { name: "Beauty", icon: "💄", color: "bg-red-100" },
    { name: "Automotive", icon: "🚗", color: "bg-gray-100" },
    { name: "Smartphones", icon: "📱", color: "bg-indigo-100" }
  ];

  const banners = [
    {
      title: "Up to 60% off",
      subtitle: "Fashion & beauty",
      gradient: "from-orange-400 to-pink-500",
      textColor: "text-white"
    },
    {
      title: "Appliances for your home",
      subtitle: "Up to 55% off",
      gradient: "from-blue-400 to-purple-500", 
      textColor: "text-white"
    },
    {
      title: "Starting ₹149",
      subtitle: "Headphones",
      gradient: "from-green-400 to-blue-500",
      textColor: "text-white"
    }
  ];

  // Fetch data from your backend
  const fetchProducts = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams({
        limit: "12",
        page: "1",
        ...params
      });

      const response = await fetch(
        `http://localhost:3900/api/v1/products/list?${queryParams.toString()}`,
        { method: "GET" }
      );
      const data = await response.json();
      console.log("API Response:", data); // Debug log
      return data.data.products || [];
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  };

  // Function to get diverse products by filtering different categories
  const getProductsByCategory = (allProducts, categoryKeywords) => {
    return allProducts.filter(product => {
      const title = product.title?.toLowerCase() || '';
      const category = product.category?.toLowerCase() || '';
      return categoryKeywords.some(keyword => 
        title.includes(keyword.toLowerCase()) || 
        category.includes(keyword.toLowerCase())
      );
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Fetch all products using your API
        const allProducts = await fetchProducts({ limit: "30" });
        console.log("All products from API:", allProducts);
        
        // Log unique categories to see what's in your database
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))];
        console.log("Available categories in your database:", uniqueCategories);

        // Shuffle array to get random distribution
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());

        // Distribute products across different sections
        setFeaturedProducts(shuffled.slice(0, 6));
        setDealsProducts(shuffled.slice(6, 14));
        setElectronicsProducts(shuffled.slice(14, 18));
        setFashionProducts(shuffled.slice(18, 22));

      } catch (error) {
        console.error("Error loading homepage data:", error);
        // Fallback: try to fetch with minimal params
        try {
          const fallbackProducts = await fetchProducts();
          const shuffled = [...fallbackProducts].sort(() => 0.5 - Math.random());
          setFeaturedProducts(shuffled.slice(0, 6));
          setDealsProducts(shuffled.slice(6, 14));
          setElectronicsProducts(shuffled.slice(14, 18));
          setFashionProducts(shuffled.slice(18, 22));
        } catch (fallbackError) {
          console.error("Fallback also failed:", fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Auto rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleCategoryClick = (category) => {
    navigate(`/search?text=${encodeURIComponent(category)}`);
  };

  const ProductCard = ({ product, size = "normal" }) => (
    <div 
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden ${
        size === "small" ? "min-w-[200px]" : ""
      }`}
      onClick={() => navigate(`/view/${product._id}`)}
    >
      <div className={`w-full ${size === "small" ? "h-40" : "h-48"} bg-gray-50 flex items-center justify-center overflow-hidden`}>
        <img
          src={
            product.thumbnail ||
            product.images?.[0] ||
            "https://via.placeholder.com/200"
          }
          alt={product.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-500 text-xs">
            {'★'.repeat(Math.floor(product.rating || 0))}
            {'☆'.repeat(5 - Math.floor(product.rating || 0))}
          </span>
          <span className="text-xs text-gray-500">
            ({product.reviews?.length || 0})
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-black">
            ₹{(product.price * 88).toFixed(0)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-xs text-green-600 font-semibold">
              {product.discountPercentage}% off
            </span>
          )}
        </div>
      </div>
    </div>
  );

  const SectionTitle = ({ title, viewAllLink }) => (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {viewAllLink && (
        <button 
          onClick={() => navigate(viewAllLink)}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          See all
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="bg-zinc-100 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <HashLoader size={70} color="#4F39F6" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-100 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 pt-24">
        {/* Hero Banner */}
        <div className="relative mb-8">
          <div className={`bg-gradient-to-r ${banners[currentBanner].gradient} rounded-xl p-8 text-center relative overflow-hidden`}>
            <div className="relative z-10">
              <h1 className={`text-4xl font-bold mb-2 ${banners[currentBanner].textColor}`}>
                {banners[currentBanner].title}
              </h1>
              <p className={`text-xl ${banners[currentBanner].textColor} opacity-90`}>
                {banners[currentBanner].subtitle}
              </p>
              <button 
                onClick={() => navigate('/search')}
                className="mt-6 bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </button>
            </div>
            
            {/* Banner Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentBanner === index ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-8">
          <SectionTitle title="Shop by Category" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`${category.color} rounded-xl p-4 text-center cursor-pointer hover:scale-105 transition-transform`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <p className="text-sm font-medium text-gray-700">{category.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="mb-8">
            <SectionTitle title="Featured Products" viewAllLink="/search?text=" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Deals Section */}
        {dealsProducts.length > 0 && (
          <div className="mb-8">
            <SectionTitle title="Deals on home" viewAllLink="/search?hasDiscount=true" />
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {dealsProducts.map((product) => (
                <ProductCard key={product._id} product={product} size="small" />
              ))}
            </div>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Electronics Section */}
          {electronicsProducts.length > 0 && (
            <div className="bg-white rounded-xl p-6">
              <SectionTitle title="Electronics" viewAllLink="/search?text=Electronics" />
              <div className="grid grid-cols-2 gap-4">
                {electronicsProducts.map((product) => (
                  <ProductCard key={product._id} product={product} size="small" />
                ))}
              </div>
            </div>
          )}

          {/* Fashion Section */}
          {fashionProducts.length > 0 && (
            <div className="bg-white rounded-xl p-6">
              <SectionTitle title="Fashion" viewAllLink="/search?text=Fashion" />
              <div className="grid grid-cols-2 gap-4">
                {fashionProducts.map((product) => (
                  <ProductCard key={product._id} product={product} size="small" />
                ))}
              </div>
            </div>
          )}
        </div>


      </div>
    </div>
  );
};

export { HomePage };