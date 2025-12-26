import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PredictionResult, BusinessProfile } from '../types';
import { PremiumCard, StatCard, Button } from './ui/PremiumComponents';
import { BrainCircuit, TrendingUp, AlertCircle, Sun, ExternalLink, Image as ImageIcon, Loader2, Download } from 'lucide-react';
import { generateMarketingCreative } from '../services/geminiService';

interface DashboardProps {
  prediction: PredictionResult;
  profile: BusinessProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ prediction, profile }) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const base64 = await generateMarketingCreative(profile, imageSize);
      setGeneratedImage(base64);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
           <div className="flex items-center gap-2 mb-2">
             <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#6366F1] text-white uppercase">Alpha Diário</span>
             <span className="text-text-muted text-sm">{new Date().toLocaleDateString('pt-BR')}</span>
           </div>
           <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
             Visão Geral: {profile.niche}
           </h1>
        </div>
        <div className="flex gap-4">
           <PremiumCard className="py-2 px-4 !bg-[#6366F1]/10 !border-[#6366F1]/20 flex items-center gap-2">
              <BrainCircuit className="text-[#6366F1]" size={18} />
              <span className="text-sm font-medium text-[#6366F1]">Confiança IA: {prediction.confidenceScore}%</span>
           </PremiumCard>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
         <StatCard 
            label="Receita Prevista (7d)" 
            value={`R$ ${prediction.predictedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
            trend="12.5%" 
            trendPositive={true} 
         />
         <StatCard label="Pedidos Previstos" value="142" trend="8.2%" trendPositive={true} />
         <StatCard label="Ticket Médio" value={`R$ ${profile.avgTicket}`} />
         <StatCard label="Sentimento Mercado" value="Otimista" trend="IA Search" trendPositive={true} />
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Chart & Image Gen */}
        <div className="lg:col-span-8 space-y-8">
          <PremiumCard className="h-[400px]">
            <h3 className="text-lg font-semibold mb-6">Trajetória de Receita (Prophet + Live Data)</h3>
            <ResponsiveContainer width="100%" height="85%">
              <AreaChart data={prediction.chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272A" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717A', fontSize: 12}} tickFormatter={(v) => `R$${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141416', borderColor: '#27272A', borderRadius: '12px' }}
                  itemStyle={{ color: '#FAFAFA' }}
                  formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </PremiumCard>

          {/* New: Image Generation Section */}
          <PremiumCard>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                 <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                   <ImageIcon size={20} className="text-[#6366F1]" />
                   Estúdio Criativo (IA)
                 </h3>
                 <p className="text-sm text-text-secondary mb-6">
                   Gere criativos de alta conversão para seus anúncios baseados no seu perfil de produto.
                 </p>
                 
                 <div className="mb-6">
                   <label className="text-xs font-semibold text-text-secondary uppercase mb-2 block">Resolução</label>
                   <div className="flex gap-2">
                     {(['1K', '2K', '4K'] as const).map((size) => (
                       <button
                        key={size}
                        onClick={() => setImageSize(size)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          imageSize === size 
                          ? 'bg-[#6366F1] border-[#6366F1] text-white' 
                          : 'bg-[#0A0A0B] border-[#27272A] text-text-secondary hover:border-white/20'
                        }`}
                       >
                         {size}
                       </button>
                     ))}
                   </div>
                 </div>

                 <Button 
                    onClick={handleGenerateImage} 
                    disabled={isGeneratingImage}
                    className="w-full md:w-auto"
                 >
                    {isGeneratingImage ? <Loader2 className="animate-spin mr-2" /> : <BrainCircuit className="mr-2" size={18} />}
                    {isGeneratingImage ? 'Criando Arte...' : 'Gerar Criativo'}
                 </Button>
              </div>

              {/* Image Preview Area */}
              <div className="w-full md:w-[300px] aspect-square rounded-xl bg-[#0A0A0B] border border-[#27272A] flex items-center justify-center overflow-hidden relative group">
                  {generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Criativo IA" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={generatedImage} download="criativo-opensix.png" className="p-3 bg-white rounded-full text-black hover:scale-110 transition-transform">
                          <Download size={20} />
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-text-secondary p-4">
                      {isGeneratingImage ? (
                        <Loader2 className="animate-spin mx-auto mb-2 text-[#6366F1]" size={32} />
                      ) : (
                        <ImageIcon className="mx-auto mb-2 opacity-20" size={48} />
                      )}
                      <p className="text-xs">{isGeneratingImage ? 'A IA está desenhando...' : 'Visualização do Criativo'}</p>
                    </div>
                  )}
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Right Column: Factors & Sources */}
        <div className="lg:col-span-4 space-y-6">
           <PremiumCard>
             <h3 className="text-lg font-semibold mb-6">Fatores de Influência</h3>
             <div className="space-y-4">
                {prediction.factors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0B] border border-border">
                     <div className="flex items-center gap-3">
                        {factor.name.toLowerCase().includes('clima') ? <Sun size={18} className="text-yellow-500" /> : 
                         factor.positive ? <TrendingUp size={18} className="text-green-500" /> : 
                         <AlertCircle size={18} className="text-red-500" />}
                        <span className="text-sm font-medium">{factor.name}</span>
                     </div>
                     <span className={`text-xs px-2 py-1 rounded border ${
                       factor.impact === 'Alta' || factor.impact === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                       'bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20'
                     }`}>
                       {factor.impact}
                     </span>
                  </div>
                ))}
             </div>
           </PremiumCard>

           {/* Google Search Sources */}
           {prediction.searchSources && prediction.searchSources.length > 0 && (
             <PremiumCard>
               <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <BrainCircuit size={18} className="text-[#6366F1]" />
                 Fontes Conectadas
               </h3>
               <div className="space-y-3">
                 {prediction.searchSources.map((source, i) => (
                   <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-[#0A0A0B] border border-border hover:border-[#6366F1]/50 transition-colors group"
                   >
                     <div className="flex justify-between items-start">
                       <p className="text-xs font-medium text-white line-clamp-2">{source.title}</p>
                       <ExternalLink size={12} className="text-text-muted group-hover:text-[#6366F1] shrink-0 ml-2" />
                     </div>
                     <p className="text-[10px] text-text-muted mt-1 truncate">{new URL(source.uri).hostname}</p>
                   </a>
                 ))}
               </div>
             </PremiumCard>
           )}

           <div className="p-6 rounded-2xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white">
              <h3 className="font-bold text-lg mb-2">Plano Pro Ativo</h3>
              <p className="text-sm text-white/80 mb-4">Você tem acesso total às ferramentas de geração e previsão.</p>
           </div>
        </div>
      </div>
    </div>
  );
};