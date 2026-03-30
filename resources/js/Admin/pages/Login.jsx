import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import Cookies from 'js-cookie';
import api from '../../utils/api';
import Button from '../../Components/ui/Button';
import { Input } from '../../Components/ui/Input';
import { Card, CardHeader, CardContent } from '../../Components/ui/Card';

const loginSchema = z.object({
  email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit faire au moins 6 caractères'),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', data);
      if (response.token) {
        // Sécurisation avec Cookie (Expires in 7 days, Secure if HTTPS)
        Cookies.set('auth_token', response.token, {
          expires: 7,
          secure: window.location.protocol === 'https:',
          sameSite: 'strict'
        });

        localStorage.setItem('user', JSON.stringify(response.data));

        // Set authorization header for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Identifiants invalides. Veuillez réessayer.');
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                    {...register('email')}
                    error={errors.email?.message}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-[38px] text-[hsla(210,15%,55%,1)]" size={18} />
                  <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="••••••••"
                    className="pl-11"
                    {...register('password')}
                    error={errors.password?.message}
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
