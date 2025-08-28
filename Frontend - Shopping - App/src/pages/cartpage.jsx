import { Navbar } from "../components/navbar";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Truck, Plus, Minus, X } from "lucide-react";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const navigate = useNavigate();

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3900/api/v1/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Failed to fetch cart items');
      
      const data = await response.json();
      setCartItems(data.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart items on component mount
  useEffect(() => {
    fetchCartItems();
  }, []);

  // Update quantity using PUT endpoint
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const response = await fetch(`http://localhost:3900/api/v1/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const data = await response.json();
      if (data.success) {
        setCartItems(data.data || []);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`http://localhost:3900/api/v1/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to remove item');

      const data = await response.json();
      if (data.success) {
        setCartItems(data.data || []);
      }
    } catch (error) {
      console.error('Error removing item:', error);
      alert('Failed to remove item from cart');
    } finally {
      setIsUpdating(false);
    }
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

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    const price = item.price || 0;
    return total + (price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Handle proceed to buy
  const handleProceedToBuy = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    
    navigate('/orders');
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-4">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m-.4-2L3 3m4 10v6a1 1 0 001 1h8a1 1 0 001-1v-6M9 19v2m6-2v2" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
              <Link 
                to="/" 
                className="inline-block bg-orange-400 hover:bg-orange-500 text-black font-medium px-6 py-2 rounded transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              
              {/* Success Message */}
              <div className="p-4 border-b bg-green-50 rounded-t-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Added to cart</span>
                </div>
              </div>

              {/* Free Delivery Message */}
              <div className="p-4 border-b bg-blue-50">
                <div className="flex items-center gap-2 text-blue-700">
                  <Truck className="w-5 h-5" />
                  <div>
                    <span className="font-medium">Part of your order qualifies for FREE Delivery.</span>
                    <span className="ml-1">Choose <span className="font-medium underline">FREE Delivery</span> option at checkout.</span>
                  </div>
                </div>
              </div>

              {/* Cart Header */}
              <div className="p-4 border-b">
                <h1 className="text-2xl font-medium">Shopping Cart</h1>
                <p className="text-sm text-gray-600 mt-1">Select all items</p>
              </div>

              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map((item, index) => {
                  const itemId = item._id;
                  const discountedPrice = item.discountedPrice || 
                    (item.price * (1 - (item.discountPercentage || 0) / 100)).toFixed(0);
                  const originalPrice = item.originalPrice || item.price;
                  const imageUrl = item.thumbnail || item.image || item.images?.[0];
                  
                  return (
                    <div key={itemId} className="p-4">
                      <div className="flex gap-4">
                        
                        {/* Product Image with Magnifier */}
                        <div className="flex-shrink-0 relative">
                          <div
                            className="relative overflow-hidden border rounded cursor-pointer"
                            onMouseMove={(e) => handleMouseMove(e, imageUrl)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <img
                              src={imageUrl}
                              alt={item.name || item.title}
                              className="w-24 h-24 object-contain transition-transform hover:scale-110"
                            />
                            {index === 0 && (
                              <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded-br-lg absolute top-0 left-0">
                                Choice
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-1 hover:text-orange-600 cursor-pointer">
                            {item.name || item.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-2">{item.brand}</p>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-semibold">₹{(item.price * 88).toFixed(0)}</span>
                            {item.discountPercentage && (
                              <>
                                <span className="text-gray-500 line-through text-sm">
                                  ₹{((item.price * 88) * (100 / (100 - item.discountPercentage))).toFixed(0)}
                                </span>
                                <span className="text-green-600 text-sm font-medium">
                                  ({item.discountPercentage || 0}% off)
                                </span>
                              </>
                            )}
                          </div>

                          <div className="text-sm text-green-700 font-medium mb-2">In stock</div>
                          
                          <div className="text-xs text-gray-600 mb-3">
                            <div>✓ Eligible for FREE Shipping</div>
                            <div>✓ Eligible for Pay On Delivery</div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center border border-gray-300 rounded">
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity - 1)}
                                disabled={isUpdating}
                                className="p-1 hover:bg-gray-100 rounded-l disabled:opacity-50"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 border-x border-gray-300 min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(itemId, item.quantity + 1)}
                                disabled={isUpdating}
                                className="p-1 hover:bg-gray-100 rounded-r disabled:opacity-50"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(itemId)}
                              disabled={isUpdating}
                              className="text-sm text-blue-600 hover:text-orange-600 hover:underline disabled:opacity-50"
                            >
                              {isUpdating ? 'Removing...' : 'Delete'}
                            </button>
                            
                            <button
                              onClick={async ()=>{
                                try {
                                  await fetch('http://localhost:3900/api/v1/wishlist', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ productId: item.productId, name: item.name, price: item.price, thumbnail: item.thumbnail })
                                  });
                                  await removeItem(itemId);
                                } catch {}
                              }}
                              className="text-sm text-blue-600 hover:text-orange-600 hover:underline"
                            >
                              Save for later
                            </button>
                            
                            <button className="text-sm text-blue-600 hover:text-orange-600 hover:underline">
                              See more like this
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Cart Footer */}
              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                <div className="text-right">
                  <span className="text-lg">Subtotal ({totalItems} items): </span>
                  <span className="text-xl font-semibold">₹{(subtotal * 88).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Items ({totalItems}):</span>
                  <span>₹{(subtotal * 88).toFixed(0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-600">FREE</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Order Total:</span>
                    <span>₹{(subtotal * 88).toFixed(0)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleProceedToBuy}
                className="w-full mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded transition-colors"
              >
                Proceed to Buy
              </button>

              {/* Additional Actions */}
              <div className="mt-4 space-y-3">
                <div className="text-center">
                  <span className="text-sm text-gray-600">or</span>
                </div>
                
                <Link
                  to="/"
                  className="block text-center text-sm text-blue-600 hover:text-orange-600 hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Secure Transaction Note */}
              <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-medium">Secure transaction</span>
                </div>
                <p className="text-xs">Your transaction is secure. We work hard to protect your security and privacy.</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
              <h3 className="font-medium mb-3">Frequently bought together</h3>
              <p className="text-sm text-gray-600">Loading recommendations...</p>
            </div>
          </div>
        </div>

        {/* Image Magnifier */}
        {hoveredImage && (
          <div
            className="fixed pointer-events-none z-50 w-64 h-64 border-2 border-gray-300 rounded-lg overflow-hidden bg-white shadow-xl"
            style={{
              left: mousePosition.x + 150,
              top: mousePosition.y - 100,
              backgroundImage: `url(${hoveredImage})`,
              backgroundPosition: `${-mousePosition.x * 2}px ${-mousePosition.y * 2}px`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: '200%'
            }}
          />
        )}
      </div>

      {/* Bottom Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-xl font-bold">₹{(subtotal * 88).toFixed(0)}</span>
        </div>
        <button
          onClick={handleProceedToBuy}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-3 rounded transition-colors"
        >
          Proceed to Buy ({totalItems} items)
        </button>
      </div>
    </div>
  );
};

export { CartPage };