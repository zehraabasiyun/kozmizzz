import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // ✅ New email state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLoginMode
      ? 'http://localhost:9191/api/auth/login'
      : 'http://localhost:9191/api/auth/register';

    const body = isLoginMode
      ? { username, password }
      : { username, password, email }; 

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      let data;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (response.ok) {
        setErrorMessage('');

        if (isLoginMode && data.message) {
          localStorage.setItem('token', data.message);
          const decoded = JSON.parse(atob(data.message.split('.')[1]));
          localStorage.setItem('isAdmin', decoded.isAdmin);

          setSuccessMessage('✅ Başarıyla giriş yaptınız! Anasayfaya yönlendiriliyorsunuz...');
          setTimeout(() => {
            navigate('/');
            window.location.reload();
          }, 1000);
        } else {
          setSuccessMessage('✅ Kayıt başarılı! Giriş yapabilirsiniz.');
          setIsLoginMode(true);
        }
      } else {
        setErrorMessage(data.message || 'Bir hata oluştu.');
      }
    } catch (error) {
      console.error('❌ Network Error:', error);
      setErrorMessage('❌ Ağ hatası!');
    }
  };

  const switchMode = () => {
    setIsLoginMode(prev => !prev);
    setUsername('');
    setPassword('');
    setEmail('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
        </h2>

        {successMessage && (
          <div className="mb-4 p-3 rounded bg-green-100 text-green-800 text-center">
            {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-800 text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />

          {!isLoginMode && (
            <input
              type="email"
              placeholder="E-posta"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border rounded px-4 py-2"
              required
            />
          )}

          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-4 py-2"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLoginMode ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLoginMode ? 'Hesabınız yok mu?' : 'Zaten bir hesabınız var mı?'}
          <button onClick={switchMode} className="ml-1 text-blue-500 hover:underline">
            {isLoginMode ? 'Kayıt Ol' : 'Giriş Yap'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
