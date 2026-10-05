'use client';

import React, { useState } from 'react';
import { ChevronLeft, Mail, KeyRound, Eye, Lock } from 'lucide-react';
import { useParkours } from '../lib/context';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { users, setCurrentUserId } = useParkours();
  
  const [email, setEmail] = useState('tuteur@parkours.fr');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pour l'instant, on accepte ces identifiants par défaut pour le tuteur
    if (email === 'tuteur@parkours.fr' && password === 'password123') {
      const teacher = users.find(u => u.role === 'teacher');
      if (teacher) {
        setCurrentUserId(teacher.id);
      }
      onLogin();
    } else {
      setError('Identifiant ou mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex font-sans selection:bg-blue-100">
      
      {/* LEFT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col relative px-8 py-6 sm:px-16 lg:px-24">
        
        {/* Header Links */}
        <div className="flex items-center justify-between w-full text-xs font-semibold mb-12 sm:mb-24">
          <a href="#" className="flex items-center gap-1 text-black hover:text-slate-600 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour sur parkours.fr
          </a>
          <div className="text-slate-400">
            Pas encore de compte ? <a href="#" className="text-[#1E3A5F] hover:underline ml-1">S'inscrire</a>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col max-w-md w-full mx-auto justify-center -mt-20">
          <h2 className="text-4xl font-bold tracking-tight text-black mb-3">
            Connectez-<span className="text-[#1E3A5F]">vous</span> ✌️
          </h2>
          <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
            Vos informations sont stockées de manière<br/>
            sécurisée pour protéger votre confidentialité.
          </p>

          <form className="space-y-5" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-lg text-center mb-4">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="albus.dumbledore@parkours.fr"
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-md text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-md text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:border-[#1E3A5F] focus:ring-1 focus:ring-[#1E3A5F] transition-colors"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-[#1E3A5F] focus:ring-[#1E3A5F] cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-500">
                  Se souvenir de moi
                </span>
              </label>
              <a href="#" className="text-xs font-bold text-[#1E3A5F] hover:underline">
                Mot de passe oublié
              </a>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-[#FFD13B] hover:bg-[#F4C542] text-black font-semibold py-3 rounded-md transition-colors shadow-sm text-sm"
              >
                Se connecter
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-1.5 pt-2 text-slate-400">
              <Lock className="w-3 h-3" />
              <span className="text-[10px] font-medium">Vos informations sont sécurisées</span>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE - BLUE BANNER */}
      <div className="hidden lg:flex w-[55%] bg-[#1E3A5F] flex-col justify-center px-16 xl:px-24 text-white">
        <div className="max-w-xl">
          <h1 className="text-4xl xl:text-5xl font-bold leading-tight mb-6">
            Nous vous souhaitons un<br/>bon retour parmi nous 👋
          </h1>
          <p className="text-lg xl:text-xl text-blue-100 font-medium leading-relaxed opacity-90">
            En vous connectant, vous pourrez accéder à l'espace de suivi tuteurs !
          </p>
        </div>
      </div>

    </div>
  );
};
