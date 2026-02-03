
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { encodeAudio, decodeBase64Audio, decodeAudioData } from '../geminiService';

const LiveAgent: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleConnection = async () => {
    if (isConnected) {
      sessionRef.current?.close();
      setIsConnected(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            console.log('Voice session opened');
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
              
              const pcmBlob = {
                data: encodeAudio(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000'
              };
              
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message) => {
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              setIsSpeaking(true);
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decodeBase64Audio(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => console.error(e),
          onclose: () => setIsConnected(false)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
          systemInstruction: 'Eres el Asistente de Voz de Refrescos Santander. Habla de forma clara y ayuda con pedidos mayoristas.'
        }
      });

      sessionRef.current = await sessionPromise;
      setIsConnected(true);
    } catch (err) {
      alert("Error al iniciar audio. Asegúrate de dar permisos de micrófono.");
      console.error(err);
    }
  };

  return (
    <div className="bg-sky-500/10 border border-sky-500/20 rounded-3xl p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
          isConnected ? (isSpeaking ? 'bg-green-500 animate-pulse' : 'bg-green-600') : 'bg-sky-600'
        }`}>
          <i className={`fas ${isConnected ? 'fa-microphone' : 'fa-microphone-slash'} text-white text-xl`}></i>
        </div>
        <div>
          <h4 className="font-bold text-sky-100">Agente de Voz en Vivo</h4>
          <p className="text-xs text-sky-400">{isConnected ? 'Conectado - Puedes hablar' : 'Haz clic para hablar con un agente AI'}</p>
        </div>
      </div>
      <button 
        onClick={toggleConnection}
        className={`px-6 py-2 rounded-xl font-bold transition-all ${
          isConnected ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-sky-600 text-white hover:bg-sky-500'
        }`}
      >
        {isConnected ? 'Finalizar' : 'Iniciar'}
      </button>
    </div>
  );
};

export default LiveAgent;
