import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BusinessProfile, PredictionResult } from '../types';

// Tenta pegar as chaves do ambiente.
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export let supabase: SupabaseClient | null = null;

if (SUPABASE_URL && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("OpenSix: Conectado ao Supabase.");
  } catch (e) {
    console.error("OpenSix: Falha ao inicializar Supabase client", e);
  }
} else {
  console.warn("OpenSix: Chaves do Supabase não encontradas. Rodando em Modo Demo (LocalStorage).");
}

/**
 * Autenticação
 */
export const signIn = async (email: string, password: string) => {
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string) => {
  if (!supabase) throw new Error("Supabase não configurado.");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
};

/**
 * Data Management
 */
export const saveBusinessProfile = async (profile: BusinessProfile) => {
  if (!supabase) {
    console.log("Salvando perfil localmente...");
    localStorage.setItem('opensix_profile', JSON.stringify(profile));
    return { id: 'local-demo-id', ...profile };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) throw new Error("Usuário não autenticado para salvar perfil.");

    const { data, error } = await supabase
      .from('business_profiles')
      .upsert({ 
        user_id: userId, 
        ...profile,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;

  } catch (error) {
    console.error("Erro ao salvar no Supabase:", error);
    localStorage.setItem('opensix_profile', JSON.stringify(profile));
    return { id: 'fallback-id', ...profile };
  }
};

export const saveDailyPrediction = async (prediction: PredictionResult, profileId?: string) => {
  if (!supabase) {
    localStorage.setItem('opensix_last_prediction', JSON.stringify(prediction));
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    const { error } = await supabase
      .from('daily_predictions')
      .insert({
        user_id: userId,
        business_profile_id: profileId,
        prediction_date: new Date().toISOString().split('T')[0],
        predicted_revenue: prediction.predictedRevenue,
        confidence_score: prediction.confidenceScore,
        factors: prediction.factors,
        explanation: prediction.explanation,
        generated_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error("Erro ao salvar previsão no Supabase:", error);
  }
};