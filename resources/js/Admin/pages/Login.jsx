import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent } from '../../Components/ui/Card';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', formData);
      if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsla(40,30%,99%,1)] flex items-center justify-center p-4">
      <div className="w-full max-w-md page-fade-in">
        <div className="flex justify-center mb-8">
          <img src="/img/dark_logo.png" alt="Logo" className="h-12 object-contain" />
        </div>

        <Card className="shadow-2xl border-[#E0E6ED]">
          <CardHeader
            title="Connexion Admin"
            subtitle="Entrez vos identifiants pour accéder au tableau de bord"
            className="text-center"
          />
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-[#FDEAEA] border border-[#D64545]/20 text-[#D64545] p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-in fade-in duration-200">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-[38px] text-[hsla(210,15%,55%,1)]" size={18} />
                  <Input
                    label="Adresse Email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-11"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-[38px] text-[hsla(210,15%,55%,1)]" size={18} />
                  <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                Se connecter
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-[hsla(210,15%,55%,1)] text-xs font-medium uppercase tracking-widest">
          Accès Dashboard Sécurisé
        </p>
      </div>
    </div>
  );
};

export default Login;
