import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { SearchPage } from "./pages/searchpage";
import { ViewPage } from "./pages/viewpage";
import { PageNotFound } from "./pages/pagenotfound";
import { LoginPage } from "./pages/loginpage";
import { SignupPage } from "./pages/signupPage";
import { CartPage } from "./pages/cartpage";
import { OrderPage } from "./pages/orderpage";
import { AddressPage } from "./pages/addresspage";
import { OrderHistoryPage } from "./pages/orderhistorypage";
import { ProfilePage } from "./pages/profilepage";
import { AddressesPage } from "./pages/addressespage";
import { WishlistPage } from "./pages/wishlistpage";
import { RecentlyViewedPage } from "./pages/recentlyviewedpage";
import { Footer } from "./components/footer";
import { SellerPage } from "./pages/sellerpage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/view/:productId" element={<ViewPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/order-history" element={<OrderHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/addresses" element={<AddressesPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/recently-viewed" element={<RecentlyViewedPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export { App };
