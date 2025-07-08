import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:9191/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          console.error('❌ Failed to fetch orders:', res.status);
        }
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Siparişlerim</h1>

        {loading ? (
          <div className="text-center text-gray-600">Yükleniyor...</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-600">Henüz bir siparişiniz yok.</div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded shadow p-4">
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Tarih:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Durum:</strong> {order.status}
                </div>
                <div className="mb-2 text-sm text-gray-600">
                  <strong>Kargo Şirketi:</strong> {order.shippingCompany}
                </div>

                <table className="w-full mt-4 text-sm">
                  <thead className="text-left border-b">
                    <tr>
                      <th>Ürün</th>
                      <th>Adet</th>
                      <th>Birim Fiyat</th>
                      <th>Toplam</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b last:border-none">
                        <td className="py-1">{item.productName}</td>
                        <td className="py-1">{item.quantity}</td>
                        <td className="py-1">₺{item.price}</td>
                        <td className="py-1 font-medium">₺{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
