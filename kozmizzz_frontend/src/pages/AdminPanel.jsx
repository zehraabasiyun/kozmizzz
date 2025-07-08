import { useState } from 'react';

function AdminPanel() {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrls: '',
    categoryId: 1, 
  });

  const [coupon, setCoupon] = useState({
    code: '',
    discountPercentage: ''
  });

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleCouponChange = (e) => {
    setCoupon({ ...coupon, [e.target.name]: e.target.value });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:9191/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...product,
          price: parseFloat(product.price),
          stock: parseInt(product.stock),
          imageUrls: product.imageUrls.split(',').map(url => url.trim())
        })
      });

      if (response.ok) {
        alert('✅ Ürün başarıyla eklendi!');
        setProduct({ name: '', description: '', price: '', stock: '', imageUrls: '', categoryId: 1 });
      } else {
        alert('❌ Ürün eklenemedi!');
      }
    } catch (err) {
      console.error('❌ Ürün ekleme hatası:', err);
    }
  };

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:9191/api/admin/discount-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...coupon,
          discountPercentage: parseInt(coupon.discountPercentage),
          active: true,
          oneTimeUse: true
        })
      });

      if (response.ok) {
        alert('✅ Kupon başarıyla eklendi!');
        setCoupon({ code: '', discountPercentage: '' });
      } else {
        alert('❌ Kupon eklenemedi!');
      }
    } catch (err) {
      console.error('❌ Kupon ekleme hatası:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Ürün Ekleme */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Ürün Ekle</h2>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <input type="text" name="name" value={product.name} onChange={handleProductChange} placeholder="Ürün Adı" className="w-full border p-2 rounded" required />
          <textarea name="description" value={product.description} onChange={handleProductChange} placeholder="Açıklama" className="w-full border p-2 rounded" />
          <input type="number" name="price" value={product.price} onChange={handleProductChange} placeholder="Fiyat (₺)" className="w-full border p-2 rounded" required />
          <input type="number" name="stock" value={product.stock} onChange={handleProductChange} placeholder="Stok Adedi" className="w-full border p-2 rounded" required />
          <input type="number" name="categoryId" value={product.categoryId} onChange={handleProductChange} placeholder="Kategori ID (varsayılan 1)" className="w-full border p-2 rounded" />
          <input type="text" name="imageUrls" value={product.imageUrls} onChange={handleProductChange} placeholder="Resim URL'leri (virgül ile ayırın)" className="w-full border p-2 rounded" />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Ürünü Ekle</button>
        </form>
      </section>

      {/* Kupon Ekleme */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Kupon Ekle</h2>
        <form onSubmit={handleCouponSubmit} className="space-y-4">
          <input type="text" name="code" value={coupon.code} onChange={handleCouponChange} placeholder="Kupon Kodu" className="w-full border p-2 rounded" required />
          <input type="number" name="discountPercentage" value={coupon.discountPercentage} onChange={handleCouponChange} placeholder="İndirim (%)" className="w-full border p-2 rounded" required />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Kuponu Ekle</button>
        </form>
      </section>
    </div>
  );
}

export default AdminPanel;