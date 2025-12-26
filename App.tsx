import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AppState, BusinessProfile, PredictionResult } from './types';
import { getCurrentUser, signOut } from './services/supabaseService';
import { BrainCircuit, LogOut } from 'lucide-react';
import { Button } from './components/ui/PremiumComponents';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check auth on load
  useEffect(() => {
    const checkUser = async () => {
      const user = await getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        // Se usuário já existe, poderia carregar o perfil do banco aqui
        // Por simplificação do MVP, mandamos para Onboarding se não tiver perfil local carregado
        const localProfile = localStorage.getItem('opensix_profile');
        if (localProfile) {
          setProfile(JSON.parse(localProfile));
          // Tentar carregar ultima previsão
          const localPred = localStorage.getItem('opensix_last_prediction');
          if (localPred) {
            setPrediction(JSON.parse(localPred));
            setAppState(AppState.DASHBOARD);
          } else {
            setAppState(AppState.ONBOARDING);
          }
        } else {
            // Usuario logado mas sem perfil carregado na memoria
            setAppState(AppState.ONBOARDING);
        }
      }
    };
    checkUser();
  }, []);

  const handleStartFlow = () => {
    if (isAuthenticated) {
      setAppState(AppState.ONBOARDING);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setAppState(AppState.ONBOARDING);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsAuthenticated(false);
    setAppState(AppState.LANDING);
    setProfile(null);
    setPrediction(null);
  };

  // Render Logic
  if (appState === AppState.LANDING) {
    return (
      <>
        <LandingPage onStart={handleStartFlow} />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onSuccess={handleAuthSuccess} 
        />
      </>
    );
  }

  return (
    <div className="bg-background min-h-screen text-text-main font-sans selection:bg-[#6366F1] selection:text-white">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px]" />
      </div>

      {/* App Navigation */}
      <nav className="fixed top-0 w-full z-40 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState(AppState.DASHBOARD)}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center">
              <BrainCircuit className="text-white" size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">OpenSix</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-text-secondary">
             <button onClick={handleSignOut} className="flex items-center gap-2 hover:text-white transition-colors">
               <LogOut size={16} /> Sair
             </button>
             <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 border border-white/10" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {appState === AppState.ONBOARDING && (
          <Onboarding 
            setProfile={setProfile} 
            setAppState={setAppState}
            setPrediction={setPrediction}
          />
        )}
        
        {appState === AppState.DASHBOARD && profile && prediction && (
          <Dashboard prediction={prediction} profile={profile} />
        )}
      </main>
    </div>
  );
};

export default App;