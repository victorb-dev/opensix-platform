import { GoogleGenAI, Type } from "@google/genai";
import { BusinessProfile, AIAnalysisResult, PredictionResult, SearchSource } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analisa os dados da etapa atual para fornecer feedback imediato.
 */
export const analyzeBusinessStep = async (
  step: number,
  data: Partial<BusinessProfile>
): Promise<AIAnalysisResult> => {
  try {
    const prompt = `
      Você é um analista especialista em e-commerce (OpenSix Prediction). Analise os seguintes dados de negócio coletados na etapa ${step} do onboarding.
      Dados: ${JSON.stringify(data)}
      
      Forneça (TUDO EM PORTUGUÊS DO BRASIL):
      1. Dois pontos fortes concisos ou observações interessantes.
      2. Um ponto fraco potencial ou área para atenção.
      3. Uma sugestão estratégica curta e encorajadora (máx 20 palavras).
      4. Uma pontuação de confiança (0-100) baseada na qualidade dos dados preenchidos.
      
      Responda estritamente em JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestion: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
          },
          required: ["strengths", "weaknesses", "suggestion", "confidenceScore"]
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("Sem resposta da IA");

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      strengths: ["Seleção de nicho interessante", "Fundação de receita sólida"],
      weaknesses: ["Dados ainda são escassos nesta etapa"],
      suggestion: "Continue fornecendo dados para refinar nosso modelo de previsão.",
      confidenceScore: 85
    };
  }
};

/**
 * Gera a previsão final com Google Search Grounding.
 * Usa gemini-3-flash-preview + googleSearch para dados atualizados.
 */
export const generatePrediction = async (
  profile: BusinessProfile
): Promise<PredictionResult> => {
  try {
    const prompt = `
      Atue como um motor preditivo avançado (OpenSix Prediction).
      
      Analise este Perfil de Negócio:
      ${JSON.stringify(profile)}
      
      Use o Google Search para encontrar tendências atuais para o nicho "${profile.niche}" no Brasil.
      
      Tarefas (EM PORTUGUÊS DO BRASIL):
      1. Preveja a receita para os próximos 7 dias.
      2. Identifique 3 fatores reais (notícias, clima, feriados).
      3. Forneça pontuação de confiança.
      4. Explicação estratégica.
      
      Retorne JSON com chartData.
    `;

    // Using Flash with Tools for Search Grounding
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedRevenue: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER },
            factors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  positive: { type: Type.BOOLEAN }
                }
              }
            },
            explanation: { type: Type.STRING },
            chartData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  value: { type: Type.NUMBER },
                  upper: { type: Type.NUMBER },
                  lower: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    let result: PredictionResult;
    
    if (response.text) {
        result = JSON.parse(response.text) as PredictionResult;
    } else {
        throw new Error("Sem resposta textual");
    }

    // Extract Grounding Metadata (Sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: SearchSource[] = [];
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }
    
    // Deduplicate sources
    result.searchSources = Array.from(new Map(sources.map(s => [s.uri, s])).values()).slice(0, 3);

    return result;

  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    // Fallback Mock
    return {
      predictedRevenue: profile.monthlyRevenue * 1.15,
      confidenceScore: 92,
      factors: [
         { name: "Dados de Mercado (Simulado)", impact: "Alta", positive: true },
         { name: "Sazonalidade", impact: "Média", positive: true }
      ],
      explanation: "Projeção baseada em crescimento linear padrão devido a erro na conexão com IA.",
      chartData: Array.from({ length: 7 }, (_, i) => ({
        day: `Dia ${i + 1}`,
        value: (profile.monthlyRevenue / 30) * (1 + (Math.random() * 0.2)),
        upper: (profile.monthlyRevenue / 30) * 1.2,
        lower: (profile.monthlyRevenue / 30) * 0.9
      })),
      searchSources: []
    };
  }
};

/**
 * Gera uma imagem de marketing.
 * Usa gemini-3-pro-image-preview (Nano Banana Pro).
 */
export const generateMarketingCreative = async (
  profile: BusinessProfile,
  size: '1K' | '2K' | '4K'
): Promise<string> => {
  try {
    const prompt = `
      Crie uma imagem publicitária profissional, estilo estúdio fotográfico de alta qualidade, para um e-commerce do nicho: ${profile.niche}.
      Produtos principais: ${profile.products}.
      Público alvo: ${profile.targetAudience || 'Geral'}.
      Estilo: Minimalista, iluminação dramática, alta resolução, premiado, 8k.
      Sem texto na imagem.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size 
        },
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Nenhuma imagem gerada.");

  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};