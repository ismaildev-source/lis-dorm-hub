
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
        backgroundImage: 'url(/lovable-uploads/5a2300a9-e590-42f0-9a9d-df8b27a02794.png)'
      }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <Card className="w-full max-w-md mx-4 shadow-xl bg-white/95 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center pb-6 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
            <Shield size={28} />
            <span>Admin Login</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-gray-700 font-semibold">Admin Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="mt-2 bg-white border-2 border-gray-200 focus:border-gray-500 rounded-lg py-3"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-700 font-semibold">Admin Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-2 bg-white border-2 border-gray-200 focus:border-gray-500 rounded-lg py-3"
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-4 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold text-lg shadow-lg"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login as Admin'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 rounded-lg font-semibold"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
