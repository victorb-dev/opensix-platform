import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, CheckCircle, BrainCircuit, Target, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { PremiumInput, Button, PremiumCard, Badge } from './ui/PremiumComponents';
import { BusinessProfile, GamificationState, AIAnalysisResult, AppState } from '../types';
import { analyzeBusinessStep, generatePrediction } from '../services/geminiService';
import { saveBusinessProfile, saveDailyPrediction } from '../services/supabaseService';

interface OnboardingProps {
  setProfile: (profile: BusinessProfile) => void;
  setAppState: (state: AppState) => void;
  setPrediction: (data: any) => void;
}

const INITIAL_PROFILE: BusinessProfile = {
  niche: '',
  products: '',
  avgTicket: 0,
  monthlyRevenue: 0,
  socialUrl: '',
  targetAudience: '',
  competitors: '',
  adSpend: 0,
  conversionRate: 0,
  revenueGoal: 0,
  mainChallenge: ''
};

const STEPS = [
  { id: 1, title: 'Negócio Básico', icon: DollarSign, xp: 50 },
  { id: 2, title: 'Público-Alvo', icon: Users, xp: 75 },
  { id: 3, title: 'Concorrência', icon: Target, xp: 100 },
  { id: 4, title: 'Marketing', icon: TrendingUp, xp: 150 },
  { id: 5, title: 'Operação', icon: Activity, xp: 200 },
  { id: 6, title: 'Objetivos', icon: BrainCircuit, xp: 500 },
];

export const Onboarding: React.FC<OnboardingProps> = ({ setProfile, setAppState, setPrediction }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessProfile>(INITIAL_PROFILE);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<AIAnalysisResult | null>(null);
  
  const [gamification, setGamification] = useState<GamificationState>({
    xp: 0,
    level: 1,
    badges: [],
    streak: 1,
    progress: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseFloat(value) : value
    }));
  };

  const calculateProgress = () => {
    return Math.round(((currentStep - 1) / STEPS.length) * 100);
  };

  const handleNext = async () => {
    // 1. Animação de Análise IA
    setIsAnalyzing(true);

    try {
      // 2. Chamada ao Gemini (Motor de Inteligência)
      // Usando modelo Flash para feedback rápido (equivalente GPT-4o-mini)
      const feedback = await analyzeBusinessStep(currentStep, formData);
      setAiFeedback(feedback);
      
      // Delay artificial para UX (sensação de "pensando")
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsAnalyzing(false);
      setShowFeedback(true);
      
      // Atualiza Gamification
      const stepXp = STEPS[currentStep - 1].xp;
      setGamification(prev => ({
        ...prev,
        xp: prev.xp + stepXp,
        progress: calculateProgress() + (100 / STEPS.length)
      }));

    } catch (error) {
      console.error("Erro na análise", error);
      setIsAnalyzing(false);
      proceedToNextStep();
    }
  };

  const proceedToNextStep = async () => {
    setShowFeedback(false);
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // --- SUBMISSÃO FINAL ---
      setIsAnalyzing(true); // Loading final
      
      try {
        // 1. Salvar Perfil (Supabase ou Local)
        const savedProfile = await saveBusinessProfile(formData);
        setProfile(formData);

        // 2. Gerar Previsão (Gemini Pro - Raciocínio Avançado)
        const prediction = await generatePrediction(formData);
        
        // 3. Salvar Previsão
        await saveDailyPrediction(prediction, savedProfile?.id);

        setPrediction(prediction);
        setAppState(AppState.DASHBOARD);
      } catch (error) {
        console.error("Erro no fluxo final:", error);
        // Fallback para garantir que o cliente veja o dashboard
        const prediction = await generatePrediction(formData);
        setProfile(formData);
        setPrediction(prediction);
        setAppState(AppState.DASHBOARD);
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold mb-6">Negócio Básico</h2>
            <PremiumInput 
              name="niche" 
              label="Qual seu setor ou nicho?" 
              placeholder="ex: Moda Fitness, Dropshipping, SaaS..." 
              value={formData.niche}
              onChange={handleInputChange}
              tooltip="Ajuda a IA a comparar com padrões da indústria"
            />
            <PremiumInput 
              name="products" 
              label="Principais Produtos" 
              placeholder="ex: Leggings, Tapetes, Bloquinhos" 
              value={formData.products}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumInput 
                name="avgTicket" 
                label="Ticket Médio (R$)" 
                type="number"
                placeholder="0.00" 
                value={formData.avgTicket || ''}
                onChange={handleInputChange}
              />
              <PremiumInput 
                name="monthlyRevenue" 
                label="Faturamento Mês Passado (R$)" 
                type="number"
                placeholder="0.00" 
                value={formData.monthlyRevenue || ''}
                onChange={handleInputChange}
              />
            </div>
            <PremiumInput 
              name="socialUrl" 
              label="Instagram ou Site" 
              placeholder="https://..." 
              value={formData.socialUrl}
              onChange={handleInputChange}
            />
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <h2 className="text-2xl font-bold mb-6">Objetivos Estratégicos</h2>
             <PremiumInput 
              name="revenueGoal" 
              label="Meta de Faturamento Próximo Mês (R$)" 
              type="number"
              value={formData.revenueGoal || ''}
              onChange={handleInputChange}
            />
             <PremiumInput 
              name="mainChallenge" 
              label="Maior Desafio Atualmente" 
              placeholder="ex: CAC Alto, Retenção Baixa..." 
              value={formData.mainChallenge}
              onChange={handleInputChange}
            />
          </motion.div>
        );
      default:
        // Generic View for Steps 2-5
        return (
           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <h2 className="text-2xl font-bold mb-6">{STEPS[currentStep-1].title}</h2>
             <p className="text-text-secondary">Simulação de inputs para a seção de {STEPS[currentStep-1].title}.</p>
             <PremiumInput 
              name="genericInput" 
              label={`Métrica chave para ${STEPS[currentStep-1].title}`}
              placeholder="Digite os detalhes..." 
              onChange={() => {}}
            />
           </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-4xl mx-auto">
      {/* Sticky Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-[#6366F1]">Etapa {currentStep}/6</span>
            <div className="w-32 h-2 bg-surface rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] transition-all duration-500"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-text-secondary">XP Atual</span>
                <span className="text-sm font-bold text-white">{gamification.xp} XP</span>
             </div>
             <Badge icon={BrainCircuit} label="IA Ativa" />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isAnalyzing ? (
          <motion.div 
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-[50vh] text-center"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-[#6366F1]/20 rounded-full animate-pulse-slow"></div>
              <div className="absolute inset-0 border-t-4 border-[#6366F1] rounded-full animate-spin"></div>
              <BrainCircuit className="absolute inset-0 m-auto text-[#6366F1]" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Processando Dados...</h3>
            <p className="text-text-secondary">Conectando pontos entre mercado e seu negócio.</p>
          </motion.div>
        ) : showFeedback && aiFeedback ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-8"
          >
            <PremiumCard className="max-w-xl mx-auto border-[#6366F1]/30">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 bg-[#6366F1]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-[#6366F1]" />
                </div>
                <h3 className="text-xl font-bold">Análise Preliminar</h3>
                <div className="mt-2 flex gap-2">
                   <span className="text-xs px-2 py-1 bg-green-500/10 text-green-500 rounded border border-green-500/20">
                     Confiança: {aiFeedback.confidenceScore}%
                   </span>
                   <span className="text-xs px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] rounded border border-[#6366F1]/20">
                     +{STEPS[currentStep-1].xp} XP
                   </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {aiFeedback.strengths.map((str, i) => (
                   <div key={i} className="flex items-start gap-3 p-3 bg-surface/50 rounded-lg">
                      <TrendingUp size={16} className="text-green-500 mt-1" />
                      <p className="text-sm text-gray-300">{str}</p>
                   </div>
                ))}
                 <div className="flex items-start gap-3 p-3 bg-surface/50 rounded-lg border border-[#6366F1]/20">
                    <BrainCircuit size={16} className="text-[#6366F1] mt-1" />
                    <p className="text-sm text-gray-300 italic">"{aiFeedback.suggestion}"</p>
                 </div>
              </div>

              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => setShowFeedback(false)} className="flex-1">
                   Ajustar
                </Button>
                <Button onClick={proceedToNextStep} className="flex-1">
                   Continuar <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </PremiumCard>
          </motion.div>
        ) : (
          <motion.div key="form" className="py-8">
            <PremiumCard>
               {renderStepContent()}
               <div className="mt-8 flex justify-end">
                 <Button onClick={handleNext} disabled={!formData.niche && currentStep === 1}>
                   {currentStep === 6 ? 'Gerar Previsão Final' : 'Analisar e Avançar'}
                 </Button>
               </div>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};