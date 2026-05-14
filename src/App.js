import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminIngredients from './pages/AdminIngredients';
import AdminPurchaseOrders from './pages/AdminPurchaseOrders';
import AdminInventory from './pages/AdminInventory';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAnalytics from './pages/AdminAnalytics';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Catering from './pages/Catering';
import About from './pages/About';
import AdminSiteManager from './pages/AdminSiteManager';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/ingredients" element={<ProtectedRoute adminOnly><AdminIngredients /></ProtectedRoute>} />
        <Route path="/admin/purchase-orders" element={<ProtectedRoute adminOnly><AdminPurchaseOrders /></ProtectedRoute>} />
        <Route path="/admin/inventory" element={<ProtectedRoute adminOnly><AdminInventory /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/catering" element={<Catering />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/site" element={<ProtectedRoute adminOnly><AdminSiteManager /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;