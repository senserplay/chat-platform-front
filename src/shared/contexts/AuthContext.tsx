import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService, { UserInfo } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email:string,password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      if (authService.isAuthenticated()) {
        authService.setupAuthInterceptor();
        
        // const userInfo = await authService.getCurrentUser();
        // setUser(userInfo);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      authService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.login({ email, password });
      // const userInfo = await authService.getCurrentUser();
      // setUser(userInfo);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username:string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('try to register');
      
      await authService.register({ username,password, email });
      setIsAuthenticated(false);
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  console.log('im here');
  
  const context = useContext(AuthContext);
  console.log(context)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 