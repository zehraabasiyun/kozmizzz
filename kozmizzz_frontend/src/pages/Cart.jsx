import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState('0.00');
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:9191/api/cart', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setCartItems(data);
        const total = data.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2);
        setCartTotal(total);
      } else if (Array.isArray(data.items)) {
        setCartItems(data.items);
        setCartTotal(data.total?.toFixed?.(2) || String(data.total || '0.00'));
      } else {
        setCartItems([]);
        setCartTotal('0.00');
        console.error('Unexpected cart format:', data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:9191/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setCartItems(prev =>
          prev
            .map(item => {
              if (item.product.id === productId) {
                return {
                  ...item,
                  quantity: item.quantity - 1
                };
              }
              return item;
            })
            .filter(item => item.quantity > 0)
        );
        fetchCart(); // update total
      } else {
        console.error('❌ Failed to remove product:', await res.text());
      }
    } catch (err) {
      console.error('❌ Error removing product:', err);
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    setIsApplyingCoupon(true);
    try {
      const res = await fetch(`http://localhost:9191/api/cart/apply-discount?code=${discountCode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setCouponMessage(`✅ ${data.message || 'Kod uygulandı'}`);
        await fetchCart();
      }
       else {
        const errorText = await res.text();
        setCouponMessage(`❌ ${errorText}`);
      }
    } catch (err) {
      setCouponMessage('❌ Ağ hatası');
    } finally {
      setDiscountCode('');
      setIsApplyingCoupon(false);
      setTimeout(() => setCouponMessage(''), 3000);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-700">Loading cart...</div>;
  if (cartItems.length === 0) return <div className="text-center py-10 text-gray-700">🛒 Sepetin boş!</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Sepetim</h1>

      <div className="space-y-6">
        {cartItems.map(item => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b pb-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  item.product.imageUrls?.length
                    ? `http://localhost:9191${item.product.imageUrls[0]}`
                    : 'https://via.placeholder.com/80x80.png?text=No+Image'
                }
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="text-xl font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">₺{item.product.price} x {item.quantity}</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-lg font-bold">
                ₺{(item.product.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemoveItem(item.product.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Ürünü Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        {/* Total Price */}
        <h2 className="text-2xl font-bold">Toplam: ₺{cartTotal}</h2>

        {/* Right: Coupon + Checkout */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Kupon kodu"
              className="border px-3 py-1 rounded text-sm w-40"
              required
            />
            <button
              type="submit"
              disabled={isApplyingCoupon}
              className={`px-3 py-1 rounded text-sm text-white ${
                isApplyingCoupon ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isApplyingCoupon ? 'Uygulanıyor...' : 'Uygula'}
            </button>
          </form>

          <button
            onClick={() => navigate('/checkout')}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition text-sm"
          >
            Siparişi Tamamla
          </button>
        </div>
      </div>

      {/* Coupon message */}
      {couponMessage && (
        <p className="mt-3 text-sm text-center text-gray-700">{couponMessage}</p>
      )}
    </div>
  );
}

export default Cart;
