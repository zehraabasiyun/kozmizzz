import { useState } from 'react';
import insta1 from '../assets/insta1.png';
import insta2 from '../assets/insta2.png';
import insta3 from '../assets/insta3.png';
import footerBackground from '../assets/footer.png';

function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <footer className="relative w-full overflow-hidden min-h-[400px]">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={footerBackground}
          alt="Footer Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />
      </div>


      {/* Content overlay */}
      <div className="relative z-10 py-16 px-6 min-h-[400px] flex flex-col justify-between">
        {/* About Section */}
        <section className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">HAKKIMIZDA</h2>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            Kendinizi güzelliklerimizle şımartın! Kozmizzz olarak cilt bakımı, makyaj, saç bakımı ve aksesuarların yanı sıra parfüm ürünleri de sunuyoruz. Kozmetik olarak sizi en iyi şekilde yansıtacak ürünleri özenle seçiyoruz.
          </p>
        </section>

        {/* Instagram + Email Section */}
        <section className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Instagram Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800">@kozmizzz kozmetik</h3>
            <p className="text-gray-600 text-sm mb-3">Bizi Instagram’da takip edin!</p>
            <div className="flex gap-2">
              <img src={insta1} alt="Insta 1" className="w-14 h-14 rounded-md object-cover" />
              <img src={insta2} alt="Insta 2" className="w-14 h-14 rounded-md object-cover" />
              <img src={insta3} alt="Insta 3" className="w-14 h-14 rounded-md object-cover" />
            </div>
          </div>

          {/* Email Subscription */}
          <div className="text-center md:text-left w-full md:w-auto">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              Kampanya ve fırsatları ilk sen öğren!
            </h4>
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="örnek@mail.com"
                className="border px-4 py-2 rounded focus:outline-none w-full sm:w-auto"
                required
              />
              <button
                type="submit"
                className="bg-[#a45c4c] text-white px-5 py-2 rounded hover:bg-[#8b4c3e] transition w-full sm:w-auto"
              >
                Gönder
              </button>
            </form>
            {submitted && (
              <div className="mt-3 bg-green-100 text-green-800 px-4 py-2 rounded shadow text-sm">
                ✅ Email adresinizi kaydettik. İndirim ve fırsatları size mail ile bildireceğiz.
              </div>
            )}
          </div>
        </section>
      </div>
    </footer>
  );
}

export default Footer;
