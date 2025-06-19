import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { LogIn } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role to correct routes that exist in App.tsx
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'supervisor':
          navigate('/supervisor/dashboard');
          break;
        case 'parent':
        case 'student':
          navigate('/view/attendance');
          break;
        default:
          navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(username, password);
      
      if (result.success && result.user) {
        // Navigation will be handled by useEffect
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    }
    
    setLoading(false);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/lovable-uploads/7c765988-9b43-4752-85f6-faef66cd424f.png')`
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <Card className="w-full max-w-md mx-4 relative z-10 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600 flex items-center justify-center space-x-2">
            <LogIn size={28} />
            <span>LIS Dorm Karen Login</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
