import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';

// User components
import Navbar from './components/user/Navbar';
import Footer from './components/user/Footer';
import Home from './pages/user/Home';
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Profile from './pages/user/Profile';
import AboutUs from './pages/user/AboutUs';
import ContactUs from './pages/user/ContactUs';
import Shop from './pages/user/Shop';
import Cart from './pages/user/Cart';
import Checkout from './pages/user/Checkout';
import Services from './pages/user/Services';
import Appointment from './pages/user/Appointment';
import BookService from './pages/user/BookService';

// Admin components
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import ProductManagement from './pages/admin/ProductManagement';
import ServiceManagement from './pages/admin/ServiceManagement';
import AppointmentManagement from './pages/admin/AppointmentManagement';
import OrderManagement from './pages/admin/OrderManagement';

// User Layout component
const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Routes with Layout */}
          <Route
            path="/*"
            element={
              <UserLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />
                  <Route path="/checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  <Route path="/services" element={<Services />} />
                  <Route path="/appointment" element={
                    <ProtectedRoute>
                      <Appointment />
                    </ProtectedRoute>
                  } />
                  <Route path="/book-service" element={
                    <ProtectedRoute>
                      <BookService />
                    </ProtectedRoute>
                  } />
                </Routes>
              </UserLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="services" element={<ServiceManagement />} />
            <Route path="appointments" element={<AppointmentManagement />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;