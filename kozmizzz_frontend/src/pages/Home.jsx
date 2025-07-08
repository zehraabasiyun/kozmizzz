import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../common/Footer';
import ProductFilter from '../components/ProductFilter';

function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [imageIndexes, setImageIndexes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9191/api/products', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAllProducts(data);
          setProducts(data);

          const indexes = {};
          data.forEach(p => indexes[p.id] = 0);
          setImageIndexes(indexes);
        } else {
          console.error('❌ Failed to fetch products');
        }
      } catch (err) {
        console.error('❌ Error:', err);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToFavorites = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:9191/api/favorites/add/${productId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const text = await res.text();
      setMessage(res.ok ? `✅ Favorilere eklendi: ${text}` : `❌ ${text}`);
    } catch (e) {
      setMessage('❌ Favori ekleme sırasında hata oluştu');
    }
  
    setTimeout(() => setMessage(''), 3000);
  };
  

  const handleApplyFilters = (filters) => {
    let filtered = [...allProducts];
    if (filters.rating) {
      filtered = filtered.filter(p => (p.rating || 0) >= filters.rating);
    }
    setProducts(filtered);
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:9191/api/cart/add/${productId}?quantity=1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const text = await res.text();
      setMessage(res.ok ? `✅ ${text}` : `❌ ${text}`);
    } catch (e) {
      setMessage('❌ Ağ hatası');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleImageChange = (productId, direction) => {
    const max = products.find(p => p.id === productId)?.imageUrls.length || 1;
    setImageIndexes(prev => ({
      ...prev,
      [productId]: (prev[productId] + direction + max) % max
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto p-6 flex-grow">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ürünler</h1>
          <ProductFilter onApply={handleApplyFilters} />
        </div>

        {/* Success Message */}
        {message && (
          <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded shadow-lg transition-all duration-300 ${
            message.startsWith('✅') ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {message}
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="cursor-pointer rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 group bg-white"
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    product.imageUrls?.length
                      ? `http://localhost:9191${product.imageUrls[imageIndexes[product.id] || 0]}`
                      : 'https://via.placeholder.com/300x300.png?text=No+Image'
                  }
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                {product.imageUrls?.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(product.id, -1);
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow"
                    >
                      ‹
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(product.id, 1);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      fill={i < (product.rating || 0) ? 'currentColor' : 'none'}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className={`w-5 h-5 ${i < (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.365a1 1 0 00.95.69h6.682c.969 0 1.371 1.24.588 1.81l-5.403 3.92a1 1 0 00-.364 1.118l2.063 6.365c.3.921-.755 1.688-1.539 1.118l-5.403-3.92a1 1 0 00-1.175 0l-5.403 3.92c-.784.57-1.838-.197-1.539-1.118l2.063-6.365a1 1 0 00-.364-1.118l-5.403-3.92c-.783-.57-.38-1.81.588-1.81h6.682a1 1 0 00.95-.69l2.062-6.365z"
                      />
                    </svg>
                  ))}
                </div>

                {/* Price and Buttons */}
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">₺{product.price}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product.id);
                      }}
                      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                    >
                      Sepete Ekle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFavorites(product.id);
                      }}
                      className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-50 text-sm"
                    >
                      Favorilere Ekle
                    </button>
                  </div>
                </div>


              </div>
            </div>
          ))}
        </div>

      </div>
    <Footer />
    </div>
  );
}

export default Home;