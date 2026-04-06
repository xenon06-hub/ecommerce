import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ProductsPage from './pages/ProductsPage';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div style={{ minHeight:'100vh', background:'#f8f9fa' }}>
          <Navbar />
          <Routes>
            <Route path="/"            element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart"        element={<CartPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}