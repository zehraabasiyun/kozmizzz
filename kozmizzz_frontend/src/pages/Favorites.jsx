import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:9191/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      } else {
        console.error('❌ Failed to fetch favorites');
      }
    } catch (err) {
      console.error('❌ Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:9191/api/favorites/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setFavorites(prev => prev.filter(p => p.id !== productId));
        setMessage('❌ Ürün favorilerden kaldırıldı.');
      } else {
        setMessage('❌ Kaldırma başarısız.');
      }
    } catch (err) {
      setMessage('❌ Ağ hatası');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-center py-10">Favoriler yükleniyor...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Favorilerim</h1>

      {message && (
        <div className="mb-4 text-center p-3 bg-yellow-100 text-yellow-800 rounded">
          {message}
        </div>
      )}

      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">Hiç favori ürününüz yok.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map(product => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white shadow rounded p-4 cursor-pointer hover:shadow-md transition relative"
            >
              <img
                src={
                  product.imageUrls?.[0]
                    ? `http://localhost:9191${product.imageUrls[0]}`
                    : 'https://via.placeholder.com/300x300.png?text=No+Image'
                }
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-4"
              />

              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{product.category?.name}</p>

              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-800 font-bold">₺{product.price}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering card click
                    handleRemove(product.id);
                  }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Ürünü Kaldır
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
