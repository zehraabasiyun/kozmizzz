import { useEffect, useState } from 'react';

function FavItems() {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopRated = async () => {
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

          const sorted = data
            .filter(p => p.rating !== null) 
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 4);

          setTopProducts(sorted);
        } else {
          console.error('❌ Failed to fetch products', response.status);
        }
      } catch (err) {
        console.error('❌ Error fetching top rated products:', err);
      }
    };

    fetchTopRated();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Öne Çıkan Ürünler</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {topProducts.map(product => (
          <div key={product.id} className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition bg-white">
            <img
              src={
                product.imageUrls?.[0]
                  ? `http://localhost:9191${product.imageUrls[0]}`
                  : 'https://via.placeholder.com/300x300.png?text=No+Image'
              }
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-2">₺{product.price}</p>

              {/* Stars */}
              <div className="flex mb-2">
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

              <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition">
                Sepete Ekle
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FavItems;
