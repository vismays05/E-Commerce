import React, { useState, useEffect } from 'react';
import TopBar from './components/TopBar';
import NavBar from './components/NavBar';
import CategoryBar from './components/CategoryBar';
import HeroCarousel from './components/HeroCarousel';
import ProductGrid from './components/ProductGrid';
import ProductQuickViewModal from './components/ProductQuickViewModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrdersModal from './components/OrdersModal';
import PincodeModal from './components/PincodeModal';
import RegisterModal from './components/RegisterModal';
import AdminModal from './components/AdminModal';
import Footer from './components/Footer';
import { initialProducts, categories, heroBanners } from './data/products';
import { api } from './services/api';

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [pincode, setPincode] = useState('400001');
  const [deliveryMode, setDeliveryMode] = useState('home');

  // User Profile state (null by default so Register/Sign In button is shown)
  const [userProfile, setUserProfile] = useState(null);

  // Interactive States
  const [cart, setCart] = useState([
    { ...initialProducts[0], selectedWeight: '5 kg', quantity: 1 },
    { ...initialProducts[4], selectedWeight: '500 g', quantity: 2 }
  ]);
  const [wishlist, setWishlist] = useState([2, 8]);
  const [orders, setOrders] = useState([
    {
      id: 'DMART-879412',
      date: '20 Aug 2026',
      status: 'Delivered',
      total: 395,
      savings: 85,
      items: [
        { ...initialProducts[1], selectedWeight: '1 L', quantity: 1 },
        { ...initialProducts[6], selectedWeight: '840 g Pack', quantity: 1 }
      ]
    }
  ]);

  // Modal Visibility Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Load products, orders & wishlist from Live Backend API if available
  useEffect(() => {
    async function loadData() {
      // Load Products
      const liveProducts = await api.getProducts();
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }

      // Load Orders
      const liveOrders = await api.getOrders();
      if (liveOrders && liveOrders.length > 0) {
        setOrders(liveOrders);
      }

      // Load Wishlist
      const liveWishlist = await api.getWishlist('USR-1001');
      if (liveWishlist && Array.isArray(liveWishlist) && liveWishlist.length > 0) {
        setWishlist(liveWishlist);
      }
    }
    loadData();
  }, []);


  // Cart Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Cart Handlers
  const handleAddToCart = (product, selectedWeight = 'Standard') => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex(item => item.id === product.id && item.selectedWeight === selectedWeight);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        return updated;
      } else {
        return [...prevCart, { ...product, selectedWeight, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
      );
    }
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  // Wishlist Handler
  const handleToggleWishlist = (productId) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      api.syncWishlist('USR-1001', updated);
      return updated;
    });
  };

  // Order Complete Handler
  const handleOrderComplete = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
  };

  const handleReorder = (order) => {
    setCart((prev) => {
      let updatedCart = [...prev];
      order.items.forEach(orderItem => {
        const existingIdx = updatedCart.findIndex(item => item.id === orderItem.id);
        if (existingIdx > -1) {
          updatedCart[existingIdx].quantity += orderItem.quantity;
        } else {
          updatedCart.push({ ...orderItem });
        }
      });
      return updatedCart;
    });
    setIsOrdersOpen(false);
    setIsCartOpen(true);
  };

  const handleRegisterSuccess = (profile) => {
    setUserProfile(profile);
    alert(`🎉 Account created successfully! Welcome to DMart, ${profile.fullName}!`);
  };

  const handleLoginSuccess = (profile) => {
    setUserProfile(profile);
    alert(`Welcome back to DMart, ${profile.fullName}!`);
  };

  const handleLogout = () => {
    setUserProfile(null);
    alert('You have signed out of your DMart account.');
  };

  const selectedCategoryObj = categories.find(c => c.id === selectedCategory);

  const [discountAmount, setDiscountAmount] = useState(0);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Top Bar for location and delivery mode */}
      <TopBar
        pincode={pincode}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
        deliveryMode={deliveryMode}
        setDeliveryMode={setDeliveryMode}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Header Navbar */}
      <NavBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenPincodeModal={() => setIsPincodeOpen(true)}
        onOpenRegisterModal={() => setIsRegisterOpen(true)}
        onOpenAdminModal={() => setIsAdminOpen(true)}
        userProfile={userProfile}
        onLogout={handleLogout}
        pincode={pincode}
        products={products}
      />

      {/* Category Pills Scroller */}
      <CategoryBar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Hero Carousel (Only shown on 'All Categories' view without search) */}
      {selectedCategory === 'all' && searchQuery.trim() === '' && (
        <HeroCarousel
          banners={heroBanners}
          onSelectCategory={(catId) => setSelectedCategory(catId)}
        />
      )}

      {/* Product Catalog Grid */}
      <main className="flex-grow-1">
        <ProductGrid
          products={products}
          cartItems={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onQuickView={(prod) => setQuickViewProduct(prod)}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          selectedCategory={selectedCategory}
          categoryName={selectedCategoryObj ? selectedCategoryObj.name : 'All Categories'}
          searchQuery={searchQuery}
        />
      </main>

      {/* Footer */}
      <Footer onSelectCategory={(catId) => setSelectedCategory(catId)} />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        cartQuantity={quickViewProduct ? (cart.find(i => i.id === quickViewProduct.id)?.quantity || 0) : 0}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderComplete={handleOrderComplete}
        pincode={pincode}
      />

      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
        onReorder={handleReorder}
      />

      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        currentPincode={pincode}
        onSavePincode={(pin) => setPincode(pin)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onProductsUpdated={(p) => setProducts(p)}
        orders={orders}
        onOrdersUpdated={(o) => setOrders(o)}
      />
    </div>
  );
}

export default App;