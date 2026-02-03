
import React, { useState } from 'react';
import { GeminiService } from '../geminiService';

const AIChatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; sources?: any[] }[]>([
    { role: 'ai', text: 'Hola, soy tu consultor experto de Refrescos Santander. ¿En qué puedo ayudarte hoy con tu negocio?' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await GeminiService.chatWithBusinessAI(userMsg);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: response.text || 'Lo siento, hubo un error.',
        sources: response.sources
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Error al conectar con la IA.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl flex flex-col h-[450px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
            <i className="fas fa-robot text-white text-xs"></i>
          </div>
          <span className="font-bold">Asistente de Negocios AI</span>
        </div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Online</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white/10 text-sky-100 border border-white/5'
            }`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/10">
                  <p className="text-[10px] uppercase font-bold text-sky-400 mb-1">Fuentes de Google Search:</p>
                  <div className="flex flex-wrap gap-1">
                    {msg.sources.map((s: any, idx: number) => (
                      s.web && (
                        <a key={idx} href={s.web.uri} target="_blank" rel="noopener noreferrer" className="text-[10px] text-sky-300 hover:underline">
                          [{idx + 1}] {s.web.title}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-3 rounded-2xl animate-pulse text-sky-300 text-sm">
              Analizando tendencias...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Pregunta sobre stock, precios o mercado..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-sky-600 hover:bg-sky-500 p-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
