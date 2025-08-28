import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "../components/navbar";
import { Star, Heart, Share2, Shield, Truck, RotateCcw } from "lucide-react";

const ViewPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const getProductViaPatch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3900/api/v1/products/view/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch product");
      const data = await response.json();
      setProduct(data.data.product);
    } catch (err) {
      alert("Cannot load product");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      const cartItem = {
        productId: product._id,
        name: product.title,
        price: parseFloat(product.price),
        quantity: parseInt(quantity),
        thumbnail: product.thumbnail || product.images?.[0]
      };
      
      const response = await fetch('http://localhost:3900/api/v1/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      
      const data = await response.json();
      console.log('Item added to cart:', data);
      
      navigate('/cart');
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const buyNow = async () => {
    await addToCart();
  };

  // Handle mouse movement for magnifier
  const handleMouseMove = (e, imageUrl) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredImage(imageUrl);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  useEffect(() => {
    getProductViaPatch();
  }, [productId]);

  if (loading) return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    </div>
  );

  if (!product) return (
    <div>
      <Navbar />
      <p className="text-center mt-20 text-lg text-gray-600">Product not found.</p>
    </div>
  );

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100) * 88).toFixed(0);
  const originalPrice = (product.price * 88).toFixed(0);

  return (
    <div className="bg-white min-h-screen relative">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-2">
        <nav className="text-sm text-gray-600">
          <span>Home</span> › <span>Electronics</span> › <span className="text-orange-600">{product.category}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Product Images */}
          <div className="lg:col-span-5">
            <div className="sticky top-4">
              {/* Share button */}
              <div className="flex justify-end mb-2">
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-4">
                {/* Thumbnail Images */}
                <div className="flex flex-col gap-2">
                  {product.images?.slice(0, 6).map((img, i) => (
                    <div
                      key={i}
                      className="relative"
                      onMouseMove={(e) => handleMouseMove(e, img)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <img
                        src={img}
                        alt={`View ${i + 1}`}
                        className={`w-12 h-12 object-contain border rounded cursor-pointer hover:border-orange-500 transition-all hover:scale-110 ${
                          selectedImage === i ? 'border-orange-500' : 'border-gray-300'
                        }`}
                        onClick={() => setSelectedImage(i)}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Main Image */}
                <div className="flex-1">
                  <div
                    className="relative overflow-hidden border rounded"
                    onMouseMove={(e) => handleMouseMove(e, product.images?.[selectedImage] || product.thumbnail)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img
                      src={product.images?.[selectedImage] || product.thumbnail}
                      alt={product.title}
                      className="w-full h-96 object-contain cursor-zoom-in transition-transform hover:scale-105"
                    />
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    Hover to zoom • Click to see full view
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Product Details */}
          <div className="lg:col-span-4">
            <h1 className="text-2xl font-normal mb-2 leading-tight">{product.title}</h1>
            
            <div className="text-sm text-blue-600 hover:text-orange-600 hover:underline cursor-pointer mb-2">
              Visit the {product.brand?.toUpperCase()} Store
            </div>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                <span className="text-orange-500 text-lg">{product.rating.toFixed(1)}</span>
                <div className="flex ml-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <span className="text-blue-600 text-sm hover:text-orange-600 hover:underline cursor-pointer">
                {product.reviews?.length || 0} ratings
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <span className="font-medium">{Math.floor(Math.random() * 900) + 100}+ bought in past month</span>
            </div>

            <div className="border-t border-b py-4 mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-red-600 text-lg font-normal">-{Math.round(product.discountPercentage)}%</span>
                <span className="text-3xl font-normal">₹{discountedPrice}</span>
              </div>
              <div className="text-sm text-gray-600">
                M.R.P: <span className="line-through">₹{originalPrice}</span>
              </div>
              
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                <span className="bg-red-600 text-white px-1 py-0.5 rounded text-xs mr-2">Fulfilled</span>
                Inclusive of all taxes
              </div>
              
              <div className="mt-2 text-sm">
                EMI starts at ₹{Math.floor(discountedPrice / 12)}. No Cost EMI available 
                <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer ml-1">EMI options</span>
              </div>
            </div>

            {/* Service Icons */}
            <div className="flex justify-between py-4 border-t border-b text-xs text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-gray-400 mb-1" />
                <span>Paid Installation available</span>
              </div>
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-gray-400 mb-1" />
                <span>1 Year Warranty Care</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-8 h-8 text-gray-400 mb-1" />
                <span>10 days Replacement by Brand</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-8 h-8 text-gray-400 mb-1" />
                <span>Free Delivery</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm mb-2">
                <span className="font-medium">Availability: </span>
                <span className={`${product.availabilityStatus === 'In Stock' ? 'text-green-700' : 'text-red-600'} font-medium`}>
                  {product.availabilityStatus}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Ships from My Shopping App
              </div>
              <div className="text-sm text-gray-600">
                Sold by <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">ELECTRONICS PRIVATE LIMITED</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm">
                <div className="font-medium mb-1">Payment</div>
                <div className="text-gray-600">Secure transaction</div>
              </div>
            </div>
          </div>

          {/* Right: Purchase Options */}
          <div className="lg:col-span-3">
            <div className="border rounded p-4 sticky top-4">
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">With Exchange</div>
                <div className="text-red-600 text-sm mb-2">Up to ₹ 4,460.00 off</div>
                
                <div className="text-sm text-gray-600 mb-1">Without Exchange</div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-normal">₹ {discountedPrice}</span>
                  <span className="text-gray-500 line-through">₹ {originalPrice}</span>
                </div>
              </div>

              <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-sm">
                <span className="bg-green-700 text-white px-1 py-0.5 rounded text-xs mr-2">Fulfilled</span>
                FREE scheduled delivery as soon as <span className="font-medium">Wednesday, 27 August, 7 am - 9 pm.</span>
                <span className="text-blue-600 hover:text-orange-600 hover:underline cursor-pointer ml-1">Details</span>
              </div>

              <div className="text-sm text-green-700 font-medium mb-4">In stock</div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Quantity:</label>
                <select 
                  className="border border-gray-300 rounded px-3 py-1 bg-gray-50 focus:bg-white focus:border-orange-500"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 mb-4">
                <button 
                  onClick={addToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-black font-medium py-2 rounded-full transition-colors disabled:opacity-50"
                >
                  {isAddingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                </button>
                <button 
                  onClick={buyNow}
                  disabled={isAddingToCart}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 rounded-full transition-colors disabled:opacity-50"
                >
                  {isAddingToCart ? 'Processing...' : 'Buy Now'}
                </button>
              </div>

              <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center justify-center gap-1">
                <Heart className="w-4 h-4" />
                Add to Wish List
              </button>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-8 max-w-4xl">
          <h2 className="text-xl font-semibold mb-4">About this item</h2>
          <div className="bg-gray-50 rounded p-4">
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Shipping: </span>
                <span>{product.shippingInformation}</span>
              </div>
              <div>
                <span className="font-medium">Warranty: </span>
                <span>{product.warrantyInformation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 max-w-5xl">
          <h2 className="text-xl font-semibold mb-6">Customer reviews</h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-normal">{product.rating.toFixed(1)}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">{product.reviews?.length || 0} global ratings</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {product.reviews?.slice(0, 5).map((review, idx) => (
              <div key={idx} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="font-medium text-sm">{review.reviewerName}</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                <div className="mt-2 text-xs text-gray-500">
                  Verified Purchase
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Image Magnifier */}
      {hoveredImage && (
        <div 
          className="fixed pointer-events-none z-50 border-2 border-gray-300 bg-white rounded-lg shadow-xl overflow-hidden"
          style={{
            left: mousePosition.x + 20,
            top: mousePosition.y - 150,
            width: '300px',
            height: '300px',
            transform: 'translateX(10px) translateY(-50%)'
          }}
        >
          <img
            src={hoveredImage}
            alt="Magnified view"
            className="w-full h-full object-contain p-2"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
            Zoom View
          </div>
        </div>
      )}
    </div>
  );
};

export { ViewPage };