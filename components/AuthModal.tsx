import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, signUp } from '../services/supabaseService';
import { Button, PremiumInput } from './ui/PremiumComponents';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        className="relative w-full max-w-md bg-[#141416] border border-[#27272A] rounded-2xl shadow-2xl p-8 overflow-hidden"
      >
        {/* Abstract bg element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#6366F1]/20 rounded-full blur-[50px]" />

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-text-muted" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none transition-all"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-text-muted" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0B] border border-[#27272A] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] outline-none transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  {isLogin ? 'Entrar na Plataforma' : 'Começar Avaliação'}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="ml-2 text-[#6366F1] hover:text-[#4F46E5] font-medium transition-colors"
              >
                {isLogin ? 'Cadastre-se' : 'Fazer Login'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};