
import React, { useState, useRef } from 'react';
import { GeminiService } from '../geminiService';

const AIVisualizer: React.FC = () => {
  const [mode, setMode] = useState<'generate' | 'edit' | 'animate'>('generate');
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [resultVideo, setResultVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResultVideo(null);
    try {
      const img = await GeminiService.generateMarketingImage(prompt, imageSize);
      setResultImage(img);
    } catch (e) {
      alert("Error al generar imagen. Asegúrese de que su API Key sea válida para Imagen 3.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!resultImage) {
      alert("Por favor, selecciona o genera una imagen primero.");
      return;
    }
    setLoading(true);
    try {
      const img = await GeminiService.editProductImage(resultImage, prompt);
      if (img) setResultImage(img);
    } catch (e) {
      alert("Error al editar imagen.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnimate = async () => {
    if (!resultImage) {
      alert("Primero necesitas una imagen base.");
      return;
    }
    setLoading(true);
    try {
      const video = await GeminiService.animatePoster(resultImage, prompt);
      setResultVideo(video);
    } catch (e) {
      alert("Error en la animación de video (Veo).");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResultImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 h-full flex flex-col">
      <div className="flex gap-4 mb-8">
        {(['generate', 'edit', 'animate'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              mode === m ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'bg-white/10 text-sky-200 hover:bg-white/20'
            }`}
          >
            {m === 'generate' ? 'Crear' : m === 'edit' ? 'Editar' : 'Animar'}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-black/20 rounded-3xl mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
        {!resultImage && !resultVideo && !loading && (
          <div className="text-center p-8">
            <i className="fas fa-image text-4xl text-sky-800 mb-4"></i>
            <p className="text-sky-400">Genera o sube un banner publicitario</p>
          </div>
        )}
        
        {resultImage && !resultVideo && (
          <img src={resultImage} alt="Preview" className="w-full h-full object-contain" />
        )}
        
        {resultVideo && (
          <video src={resultVideo} controls autoPlay loop className="w-full h-full object-contain" />
        )}

        {loading && (
          <div className="absolute inset-0 bg-sky-900/60 flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sky-100 font-medium">Procesando con IA...</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {mode === 'generate' && (
          <select 
            value={imageSize} 
            onChange={(e) => setImageSize(e.target.value as any)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-sky-200 focus:outline-none"
          >
            <option value="1K">Calidad 1K (Estándar)</option>
            <option value="2K">Calidad 2K (HD)</option>
            <option value="4K">Calidad 4K (Ultra HD)</option>
          </select>
        )}

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={
            mode === 'generate' ? "Describe el anuncio de bebidas que deseas crear..." :
            mode === 'edit' ? "Indica qué cambios quieres hacer a la imagen (ej: 'añade un filtro retro')" :
            "Describe el movimiento (ej: 'burbujas refrescantes')"
          }
          className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-sky-100 focus:outline-none focus:ring-2 focus:ring-sky-500/50 resize-none"
        />

        <div className="grid grid-cols-2 gap-4">
          <input type="file" ref={fileInputRef} onChange={onFileChange} hidden accept="image/*" />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <i className="fas fa-upload"></i> Subir Base
          </button>
          <button 
            onClick={mode === 'generate' ? handleGenerate : mode === 'edit' ? handleEdit : handleAnimate}
            disabled={loading}
            className="py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-sky-900/40 disabled:opacity-50"
          >
            {mode === 'generate' ? 'Generar Imagen' : mode === 'edit' ? 'Aplicar Cambios' : 'Generar Video (Veo)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIVisualizer;
