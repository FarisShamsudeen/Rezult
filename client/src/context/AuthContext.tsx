import { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockedModal } from '../components/modals/BlockedModal';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'rezulter' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check local storage for token and user on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Self-heal: if role is missing or invalid due to previous backend DTO issues
        if (!parsedUser.role || !['candidate', 'rezulter', 'super_admin'].includes(parsedUser.role)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          setToken(storedToken);
          setUser(parsedUser);
        }
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    const checkSession = async () => {
      if (token) {
        try {
          await api.get('/auth/me');
        } catch (error) {
          // api.ts will handle the ACCOUNT_BLOCKED and dispatch the event
        }
      }
    };

    if (token) {
      // Check immediately and then every 15 seconds
      checkSession();
      intervalId = setInterval(checkSession, 15000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, location.pathname]);

  useEffect(() => {
    const handleAccountBlocked = () => {
      setIsBlockedModalOpen(true);
    };

    window.addEventListener('accountBlocked', handleAccountBlocked);

    return () => {
      window.removeEventListener('accountBlocked', handleAccountBlocked);
    };
  }, []);

  const login = (userData: User, newToken: string) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const handleBlockedConfirm = () => {
    setIsBlockedModalOpen(false);
    logout();
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
      <BlockedModal isOpen={isBlockedModalOpen} onConfirm={handleBlockedConfirm} />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
