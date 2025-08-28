import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { SearchPage } from "./pages/searchpage";
import { ViewPage } from "./pages/viewpage";
import { PageNotFound } from "./pages/pagenotfound";
import { LoginPage } from "./pages/loginpage";
import { SignupPage } from "./pages/signupPage";
import { CartPage } from "./pages/cartpage";
import { OrderPage } from "./pages/orderpage";
import { isAuthenticated } from "./utils/auth";
import { AddressPage } from "./pages/addresspage";
import { OrderHistoryPage } from "./pages/orderhistorypage";
import { ProfilePage } from "./pages/profilepage";
import { AddressesPage } from "./pages/addressespage";
import { WishlistPage } from "./pages/wishlistpage";

const ProtectedRoute = ({ children }) => {
  const authed = isAuthenticated();
  if (!authed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/view/:productId" element={<ViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <OrderPage />
          </ProtectedRoute>
        } />
        <Route path="/address" element={
          <ProtectedRoute>
            <AddressPage />
          </ProtectedRoute>
        } />
        <Route path="/order-history" element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/addresses" element={
          <ProtectedRoute>
            <AddressesPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
