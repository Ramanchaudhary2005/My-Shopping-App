import { Navbar } from "../components/navbar";
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle, Truck, CreditCard, MapPin, User, ArrowLeft } from "lucide-react";

const OrderPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  // Form states
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [formErrors, setFormErrors] = useState({});
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [hasSavedAddress, setHasSavedAddress] = useState(false);

  // Get userId from localStorage or your auth context
  const userId = localStorage.getItem('userId') || '68a2d87c1292385b9c8c30ce'; // Fallback to your test user

  // Fetch cart items
  const fetchCartItems = useCallback(async () => {
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
      if (data.data && data.data.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(data.data || []);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      alert('Failed to load cart items');
      navigate('/cart');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCartItems();
    const loadSavedFlag = async () => {
      try {
        const uid = localStorage.getItem('userId');
        if (!uid) return;
        const res = await fetch(`http://localhost:3900/api/v1/users/${uid}/address`);
        const data = await res.json();
        if (res.ok && data?.data && (data.data.street || data.data.city || data.data.state || data.data.zipCode)) {
          setHasSavedAddress(true);
        }
      } catch (error) {
        console.error('Error loading saved address flag:', error);
      }
    };
    loadSavedFlag();
  }, [fetchCartItems]);

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const deliveryFee = 0; // Free delivery
  const total = subtotal + deliveryFee;

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!shippingAddress.street.trim()) {
      errors.street = 'Street address is required';
    }
    if (!shippingAddress.city.trim()) {
      errors.city = 'City is required';
    }
    if (!shippingAddress.state.trim()) {
      errors.state = 'State is required';
    }
    if (!shippingAddress.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    if (!/^\d{5,6}$/.test(shippingAddress.zipCode)) {
      errors.zipCode = 'Please enter a valid ZIP code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsPlacingOrder(true);
    
    try {
      const orderData = {
        userId,
        shippingAddress,
        paymentMethod
      };

      const response = await fetch('http://localhost:3900/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const data = await response.json();
      
      if (data.success) {
        setOrderDetails(data.data);
        setOrderPlaced(true);
      } else {
        throw new Error(data.message || 'Failed to place order');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle input changes
  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-green-600 mb-4">Order Placed Successfully!</h1>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-600">Order Number</p>
                  <p className="font-semibold">{orderDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-semibold">{orderDetails.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-semibold">₹{(orderDetails.totalAmount * 88).toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{orderDetails.status}</p>
                </div>
              </div>
            </div>

            <div className="text-gray-600 mb-6">
              <p>Thank you for your order! We'll send you a confirmation email shortly.</p>
              <p>You can track your order status in your account.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/orders/${orderDetails.orderId}`}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded transition-colors"
              >
                View Order Details
              </Link>
              <Link
                to="/"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded transition-colors"
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
      
      <div className="max-w-6xl mx-auto px-4 py-6 pt-24">
        
        {/* Header */}
        <div className="mb-6">
          <Link to="/cart" className="flex items-center gap-2 text-blue-600 hover:text-orange-600 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Shipping & Payment Info */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              {hasSavedAddress && (
                <div className="mb-4 p-3 bg-gray-50 border rounded">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={useSavedAddress}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        setUseSavedAddress(checked);
                        if (checked) {
                          try {
                            const uid = localStorage.getItem('userId');
                            if (!uid) return;
                            const res = await fetch(`http://localhost:3900/api/v1/users/${uid}/address`);
                            const data = await res.json();
                            if (res.ok && data?.data) {
                              setShippingAddress({
                                street: data.data.street || '',
                                city: data.data.city || '',
                                state: data.data.state || '',
                                zipCode: data.data.zipCode || '',
                                country: data.data.country || 'India',
                              });
                            }
                          } catch (error) {
                            console.error('Error loading saved shipping address:', error);
                          }
                        }
                      }}
                    />
                    <span>Use saved address</span>
                  </label>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={shippingAddress.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.street ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter your street address"
                  />
                  {formErrors.street && <p className="text-red-500 text-sm mt-1">{formErrors.street}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter city"
                  />
                  {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter state"
                  />
                  {formErrors.state && <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                  <input
                    type="text"
                    value={shippingAddress.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${formErrors.zipCode ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Enter ZIP code"
                  />
                  {formErrors.zipCode && <p className="text-red-500 text-sm mt-1">{formErrors.zipCode}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    value={shippingAddress.country}
                    onChange={(e) => handleAddressChange('country', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
                  { value: 'debit_card', label: 'Debit Card', icon: '💳' },
                  { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span>{method.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              
              {/* Order Summary Header */}
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              {/* Items List */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-12 object-contain border rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">₹{(item.price * item.quantity * 88).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Items ({totalItems}):</span>
                  <span>₹{(subtotal * 88).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total:</span>
                  <span>₹{(total * 88).toFixed(0)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isPlacingOrder ? 'Placing Order...' : `Place Order - ₹${(total * 88).toFixed(0)}`}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-xs text-gray-600 text-center">
                <p>🔒 Your payment information is secure and encrypted</p>
                <p className="mt-2">By placing your order, you agree to our terms and conditions.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export { OrderPage };
