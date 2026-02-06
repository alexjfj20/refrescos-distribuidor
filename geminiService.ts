import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiService {
  private static getAI() {
    let apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    
    // TEMPORAL: Fallback para desarrollo
    if (!apiKey && import.meta.env.DEV) {
      console.warn('⚠️ Usando API key de desarrollo temporal. Configura VITE_GEMINI_API_KEY en .env');
      apiKey = 'TU_API_KEY_AQUI';
    }
    
    if (!apiKey) {
      throw new Error('La API key de Gemini no está configurada.');
    }
    
    return new GoogleGenerativeAI(apiKey);
  }

  // SOLUCIÓN DIRECTA: Usar el endpoint que funciona con tu API key
  static async chatWithBusinessAI(message: string, history: any[] = []) {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
      
      if (!apiKey) {
        throw new Error('API key no configurada');
      }

      // Usar gemini-pro con v1beta (el que funciona con tu key)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: message
            }]
          }],
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error de API:', errorData);
        
        // Si falla, intentar con el modelo más básico
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: message
              }]
            }]
          })
        });

        if (!fallbackResponse.ok) {
          throw new Error('No se pudo conectar con la API de Gemini');
        }

        const fallbackData = await fallbackResponse.json();
        const fallbackText = fallbackData.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';
        
        return {
          text: fallbackText,
          sources: []
        };
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar una respuesta.';

      return {
        text: text,
        sources: []
      };
    } catch (error: any) {
      console.error('❌ Error en chatWithBusinessAI:', error);
      throw new Error('Error al conectar con la IA. Por favor, intenta de nuevo.');
    }
  }

  // Low Latency FAQ
  static async quickFaq(question: string) {
    return this.chatWithBusinessAI(question);
  }

  // Image Generation
  static async generateMarketingImage(prompt: string, size: '1K' | '2K' | '4K' = '1K') {
    throw new Error('La generación de imágenes requiere un modelo diferente');
  }

  // Image Analysis
  static async editProductImage(base64Image: string, prompt: string) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/png',
                data: base64Image.split(',')[1]
              }
            }
          ]
        }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo analizar la imagen.';
  }

  // Video Generation
  static async animatePoster(base64Image: string, prompt: string) {
    throw new Error('La generación de videos requiere Veo API');
  }

  // Map/Location search
  static async findNearbyDistributors(lat: number, lng: number) {
    const prompt = `Basándote en las coordenadas ${lat}, ${lng}, sugiere tipos de lugares donde podría encontrar distribuidores de bebidas mayoristas.`;
    return this.chatWithBusinessAI(prompt);
  }
}

// Audio Utils for Live API
export function decodeBase64Audio(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encodeAudio(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}