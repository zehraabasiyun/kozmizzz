import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.isAdmin === true);
      } catch (err) {
        console.error('❌ Invalid token:', err);
        setIsAdmin(false);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsVisible(currentY < lastScrollY);
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <nav
      className={`bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <Link to="/" className="text-2xl font-bold text-gray-800">
        Kozmizzz
      </Link>

      <div className="flex gap-6 text-gray-700 font-medium">
        <Link to="/home" className="hover:text-black transition">
          Mağaza
        </Link>
        <Link to="/cart" className="hover:text-black transition">
          Sepetim
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/favorites" className="hover:text-black transition">
              Favoriler
            </Link>
            <Link to="/orders" className="hover:text-black transition">
              Siparişlerim
            </Link>
          </>
        )}

        {isAdmin && (
          <Link to="/adminpanel" className="hover:text-black transition">
            Admin Panel
          </Link>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="hover:text-black transition"
          >
            Çıkış Yap
          </button>
        ) : (
          <Link to="/login" className="hover:text-black transition">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
