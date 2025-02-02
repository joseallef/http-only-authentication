import { useEffect, useState } from 'react';
import './App.css';
import { fetchUser, logout } from './authService';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkUser = async () => {
      const data = await fetchUser();
      if (data) setIsAuthenticated(true);
      setLoading(false);
    };
    checkUser();
  }, []);

  return (
    <div>
      <h1>Autenticação com Node.js e React</h1>
      <header className="header">
        <div className="btn-logout">{!loading && isAuthenticated && (<button onClick={handleLogout}>Logout</button>)}</div>
      </header>
      <div className="box">
        {loading ? <p>Carregando...</p> : (
          <>
            {isAuthenticated ? (
              <>
                <RegisterForm />
              </>
            ) : (
              <LoginForm onLogin={() => setIsAuthenticated(true)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App
