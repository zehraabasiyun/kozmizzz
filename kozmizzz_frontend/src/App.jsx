import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Cart from './pages/Cart' 
import Greeter from './pages/Greeter';
import Navbar from './common/Navbar'
import ProductDetail from './pages/ProductDetail'; 
import Checkout from './pages/Checkout'; 
import Orders from './pages/Orders'; 
import AdminPanel from './pages/AdminPanel';
import Favorites from './pages/Favorites';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow p-4">
        <Routes>
          <Route path="/" element={<Greeter />} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cart" element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/adminpanel' element={<AdminPanel />} />
          <Route path='/favorites' element={<Favorites />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
