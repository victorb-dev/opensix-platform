import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, BarChart3, ChevronRight, Check, Star } from 'lucide-react';
import { Button } from './ui/PremiumComponents';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-[#6366F1] selection:text-white">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-[#6366F1] opacity-20 blur-[100px]"></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <BrainCircuit className="text-white" size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">OpenSix</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
            <button onClick={onStart} className="text-white hover:text-[#6366F1] transition-colors">Login</button>
            <Button onClick={onStart} className="!py-2 !px-5 !rounded-full !text-xs font-bold uppercase tracking-wider">Começar Agora</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#6366F1] shadow-lg backdrop-blur-md">
              <Star size={12} fill="currentColor" />
              <span>Plataforma #1 em Previsão de E-commerce</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
              O Futuro do seu
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              Estoque é Agora.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A primeira IA preditiva que conecta dados globais (Google Search) com a realidade do seu e-commerce para gerar previsões de receita precisas.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button onClick={onStart} className="!text-lg !px-10 !py-5 !rounded-full shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
              Iniciar Trial
              <ChevronRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </div>

        {/* Abstract Dashboard Visual */}
        <motion.div 
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
          className="mt-24 max-w-6xl mx-auto relative perspective-1000"
        >
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0B]/80 backdrop-blur-xl shadow-2xl overflow-hidden aspect-[16/10] group">
                {/* Glow behind */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-[#6366F1]/20 blur-[100px] rounded-full -z-10"></div>
                
                {/* Mockup Header */}
                <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                   <div className="flex gap-1.5">
                     <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                   </div>
                </div>

                {/* Mockup Content */}
                <div className="p-8 grid grid-cols-12 gap-6 h-full">
                   <div className="col-span-3 space-y-4">
                      <div className="h-24 rounded-xl bg-white/5 animate-pulse"></div>
                      <div className="h-24 rounded-xl bg-white/5 animate-pulse delay-75"></div>
                      <div className="h-40 rounded-xl bg-white/5 animate-pulse delay-150"></div>
                   </div>
                   <div className="col-span-9 space-y-6">
                      <div className="flex gap-4">
                         <div className="flex-1 h-32 rounded-xl bg-gradient-to-br from-[#6366F1]/20 to-transparent border border-[#6366F1]/30 flex flex-col justify-center p-6">
                            <div className="text-sm text-[#6366F1] font-mono mb-2">RECEITA PREVISTA</div>
                            <div className="text-4xl font-bold text-white">R$ 142.050</div>
                         </div>
                         <div className="flex-1 h-32 rounded-xl bg-white/5 border border-white/10 p-6">
                            <div className="text-sm text-gray-400 font-mono mb-2">CONFIANÇA</div>
                            <div className="text-4xl font-bold text-white">98.2%</div>
                         </div>
                      </div>
                      <div className="h-64 rounded-xl bg-white/5 border border-white/10 relative overflow-hidden">
                         <div className="absolute inset-0 flex items-end px-6 pb-6 gap-2">
                            {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                               <div key={i} className="flex-1 bg-[#6366F1]" style={{ height: `${h}%`, opacity: 0.5 + (i * 0.05) }}></div>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
            </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 p-10 rounded-3xl bg-[#0F0F11] border border-white/5 hover:border-[#6366F1]/30 transition-all group overflow-hidden relative">
               <div className="absolute top-0 right-0 p-10 opacity-20 group-hover:opacity-40 transition-opacity">
                  <BarChart3 size={120} className="text-[#6366F1]" />
               </div>
               <h3 className="text-3xl font-bold mb-4">Algoritmo Prophet + Live Data</h3>
               <p className="text-gray-400 max-w-md">Combinamos modelagem de séries temporais com dados em tempo real do Google Search para ajustar previsões baseadas em eventos do mundo real.</p>
            </motion.div>
            
            <motion.div whileHover={{ y: -5 }} className="p-10 rounded-3xl bg-[#0F0F11] border border-white/5 hover:border-[#6366F1]/30 transition-all">
               <BrainCircuit size={40} className="text-[#6366F1] mb-6" />
               <h3 className="text-xl font-bold mb-2">IA Generativa 3.0</h3>
               <p className="text-gray-400 text-sm">Não apenas números. Receba explicações estratégicas sobre o "porquê" das suas vendas.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="p-10 rounded-3xl bg-[#0F0F11] border border-white/5 hover:border-[#6366F1]/30 transition-all">
               <TrendingUp size={40} className="text-green-500 mb-6" />
               <h3 className="text-xl font-bold mb-2">Grounding Google</h3>
               <p className="text-gray-400 text-sm">Monitoramento de concorrentes e tendências de mercado atualizadas a cada minuto.</p>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="col-span-1 md:col-span-2 p-10 rounded-3xl bg-gradient-to-br from-[#6366F1] to-[#4F46E5] border border-transparent text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-3xl font-bold mb-4">Comece hoje. Cancele quando quiser.</h3>
                   <div className="flex items-center gap-6 mb-8">
                      <div className="text-5xl font-bold">R$ 49,90</div>
                      <div className="text-white/70">/mês<br/>Faturamento ilimitado</div>
                   </div>
                   <Button onClick={onStart} className="!bg-white !text-[#6366F1] !rounded-full !px-8 hover:!bg-gray-100">Garantir Preço</Button>
                </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <BrainCircuit size={18} />
            <span className="font-bold">OpenSix</span>
          </div>
          <p className="text-sm text-text-muted">© 2024 OpenSix Prediction. Design by Awwwards Standards.</p>
        </div>
      </footer>
    </div>
  );
};