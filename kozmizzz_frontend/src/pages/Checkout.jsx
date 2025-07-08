import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const cityRegionMap = {
  Istanbul: ['Kadıköy', 'Beşiktaş', 'Üsküdar'],
  Kocaeli: ['İzmit', 'Gölcük', 'Başiskele'],
  Ankara: ['Çankaya', 'Keçiören', 'Mamak']
};

function Checkout() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    region: ''
  });

  const [cardInfo, setCardInfo] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [countdown, setCountdown] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'city') {
      setForm({ ...form, city: e.target.value, region: '' });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleCardChange = (e) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      try {
        const token = localStorage.getItem('token');
        const randomShippingId = Math.floor(Math.random() * 4) + 1;
  
        const response = await fetch(`http://localhost:9191/api/orders/complete/${randomShippingId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
  
        if (!response.ok) {
          const text = await response.text();
          console.error('❌ Order completion failed:', text);
          alert('Sipariş tamamlanamadı. Lütfen tekrar deneyin.');
          return;
        }
  
        setStep(3);
      } catch (err) {
        console.error('❌ Error completing order:', err);
        alert('Sipariş sırasında bir hata oluştu.');
      }
    }
  };  

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Siparişi Tamamla</h1>

        {step === 1 && (
          <div className="space-y-4">
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ad" className="w-full border px-4 py-2 rounded" required />
            <input type="text" name="surname" value={form.surname} onChange={handleChange} placeholder="Soyad" className="w-full border px-4 py-2 rounded" required />

            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '');
                let formatted = raw;
                if (raw.length > 3) formatted = raw.slice(0, 3) + '-' + raw.slice(3);
                if (raw.length > 6) formatted = raw.slice(0, 3) + '-' + raw.slice(3, 6) + '-' + raw.slice(6);
                if (raw.length > 8) formatted = raw.slice(0, 3) + '-' + raw.slice(3, 6) + '-' + raw.slice(6, 8) + '-' + raw.slice(8, 10);
                setForm({ ...form, phone: formatted.slice(0, 13) });
              }}
              placeholder="5xx-xxx-xx-xx"
              className="w-full border px-4 py-2 rounded"
            />

            <input type="text" name="address1" value={form.address1} onChange={handleChange} placeholder="Adres Satırı 1" className="w-full border px-4 py-2 rounded" required />
            <input type="text" name="address2" value={form.address2} onChange={handleChange} placeholder="Adres Satırı 2 (isteğe bağlı)" className="w-full border px-4 py-2 rounded" />

            <select name="city" value={form.city} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
              <option value="">Şehir Seçiniz</option>
              {Object.keys(cityRegionMap).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>

            {form.city && (
              <select name="region" value={form.region} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
                <option value="">İlçe Seçiniz</option>
                {cityRegionMap[form.city].map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input type="text" name="nameOnCard" value={cardInfo.nameOnCard} onChange={handleCardChange} placeholder="Kart Üzerindeki İsim" className="w-full border px-4 py-2 rounded" />
            <input type="text" name="cardNumber" value={cardInfo.cardNumber} onChange={handleCardChange} placeholder="Kart Numarası" className="w-full border px-4 py-2 rounded" />
            <div className="flex gap-4">
              <input type="text" name="expiry" value={cardInfo.expiry} onChange={handleCardChange} placeholder="SKT (AA/YY)" className="w-full border px-4 py-2 rounded" />
              <input type="text" name="cvv" value={cardInfo.cvv} onChange={handleCardChange} placeholder="CVV" className="w-full border px-4 py-2 rounded" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">✅ Siparişiniz alındı</h2>
            <p className="text-gray-600">Anasayfaya yönlendiriliyorsunuz... ({countdown})</p>
          </div>
        )}

        {step !== 3 && (
          <button
            onClick={handleNext}
            className="mt-6 w-full bg-black text-white py-3 rounded hover:bg-gray-800"
          >
            {step === 1 ? 'Devam Et' : 'Siparişi Tamamla'}
          </button>
        )}
      </main>

    </div>
  );
}

export default Checkout;
