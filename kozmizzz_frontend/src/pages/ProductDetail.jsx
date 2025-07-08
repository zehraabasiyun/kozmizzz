import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../common/Footer';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9191/api/products/${id}/reviews`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const reviewData = await response.json();
        setReviews(reviewData);
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:9191/api/products/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('❌ Failed to fetch product');
        }
      } catch (error) {
        console.error('❌ Error fetching product:', error);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  if (!product) {
    return <div className="text-center py-20 text-gray-700">Yükleniyor...</div>;
  }

  const { name, description, imageUrls = [], price, rating, stockQuantity } = product;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left: Image */}
          <div className="w-full md:w-1/2 relative">
            <img
              src={
                imageUrls.length
                  ? `http://localhost:9191${imageUrls[imageIndex]}`
                  : 'https://via.placeholder.com/500x500.png?text=No+Image'
              }
              alt={name}
              className="rounded-lg w-full object-cover max-h-[500px]"
            />

            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((imageIndex - 1 + imageUrls.length) % imageUrls.length)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow"
                >
                  ‹
                </button>
                <button
                  onClick={() => setImageIndex((imageIndex + 1) % imageUrls.length)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold shadow"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold mb-3">{name}</h1>
            <p className="text-lg text-gray-700 mb-2">{description || 'Açıklama mevcut değil.'}</p>
            <p className="text-lg font-semibold text-black mb-1">Stok: {stockQuantity ?? 'Bilinmiyor'}</p>
            <p className="text-xl font-bold text-orange-600 mb-4">₺{price}</p>

            {/* Rating */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < (rating || 0) ? 'currentColor' : 'none'}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className={`w-6 h-6 ${i < (rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.365a1 1 0 00.95.69h6.682c.969 0 1.371 1.24.588 1.81l-5.403 3.92a1 1 0 00-.364 1.118l2.063 6.365c.3.921-.755 1.688-1.539 1.118l-5.403-3.92a1 1 0 00-1.175 0l-5.403 3.92c-.784.57-1.838-.197-1.539-1.118l2.063-6.365a1 1 0 00-.364-1.118l-5.403-3.92c-.783-.57-.38-1.81.588-1.81h6.682a1 1 0 00.95-.69l2.062-6.365z"
                  />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-500">{rating ?? 'Yok'} / 5</span>
            </div>

            <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition">
              Sepete Ekle
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Yorumlar</h2>
          {reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review, index) => {
                const date = new Date(review.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                });

                return (
                  <div key={index} className="bg-white border rounded p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-gray-800">@{review.username}</p>
                      <span className="text-sm text-gray-500">{date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          fill={i < review.rating ? 'currentColor' : 'none'}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.062 6.365a1 1 0 00.95.69h6.682c.969 0 1.371 1.24.588 1.81l-5.403 3.92a1 1 0 00-.364 1.118l2.063 6.365c.3.921-.755 1.688-1.539 1.118l-5.403-3.92a1 1 0 00-1.175 0l-5.403 3.92c-.784.57-1.838-.197-1.539-1.118l2.063-6.365a1 1 0 00-.364-1.118l-5.403-3.92c-.783-.57-.38-1.81.588-1.81h6.682a1 1 0 00.95-.69l2.062-6.365z"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">Henüz yorum yapılmamış.</p>
          )}
        </div>

        {/* Review Form */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-3">Yorum Yap</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newComment.trim() || newRating === 0 || isSubmitting) return;

              try {
                setIsSubmitting(true);
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:9191/api/products/${id}/reviews`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    comment: newComment,
                    rating: newRating
                  }),
                });

                if (response.ok) {
                  await fetchReviews(); // 🔁 Refresh from backend
                  setNewComment('');
                  setNewRating(0);
                } else {
                  const errorText = await response.text();
                  console.error('❌ Failed to submit review:', errorText);
                }
              } catch (error) {
                console.error('❌ Error submitting review:', error);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-4"
          >
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              className="w-full border rounded p-2"
              rows={3}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Puan:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setNewRating(num)}
                  className={`w-6 h-6 rounded-full text-center ${newRating >= num ? 'bg-yellow-400' : 'bg-gray-300'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ProductDetail;
