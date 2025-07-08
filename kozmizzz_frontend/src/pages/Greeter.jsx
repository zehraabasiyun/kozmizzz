import { useState } from 'react';
import { Link } from 'react-router-dom';
import greeterImage from '../assets/greeter.png';
import FavItems from '../components/FavItems';
import Footer from '../common/Footer';

function Greeter() {
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
    <>
      <div className="relative w-full h-[90vh]">
        <img
          src={greeterImage}
          alt="Yaza Özel Kampanya"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white bg-black/40">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-xl">
            YAZA ÖZEL <span className="text-orange-300">%30 İNDİRİM</span>
          </h1>
          <Link
            to="/home"
            className="mt-4 bg-white text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Alışverişe Başla
          </Link>
        </div>
      </div>

      {/* Featured Section */}
      <FavItems />
      <Footer />
    </>
  );
}

export default Greeter;
