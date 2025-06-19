import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simple hardcoded admin check for demo
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials');
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
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center justify-center space-x-2">
            <Shield size={28} />
            <span>Admin Login</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Admin Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
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
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
