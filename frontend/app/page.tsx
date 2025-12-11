"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setTranscription("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("audio/")) {
        setFile(droppedFile);
        setError(null);
        setTranscription("");
      } else {
        setError("Por favor, solte um arquivo de áudio válido.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Por favor, selecione um arquivo de áudio.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setTranscription("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Falha na transcrição. Verifique se o backend está rodando.");
      }

      const data = await response.json();
      setTranscription(data.text);
    } catch (err) {
      console.error(err);
      setError("Ocorreu um erro ao tentar transcrever o áudio. Verifique a conexão com o backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <h1 className="text-3xl font-bold text-center bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Whisper Transcription
          </h1>
          <p className="text-center text-zinc-500 dark:text-zinc-400 mt-2">
            Transforme seu áudio em texto com inteligência artificial
          </p>
        </div>

        <div className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Upload Area */}
            <div 
              className={`relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-xl border-2 border-dashed transition-all duration-200 ease-in-out
                ${file 
                  ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10" 
                  : "border-zinc-300 dark:border-zinc-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }
              `}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              <div className="flex flex-col items-center space-y-4 text-center p-4">
                <div className={`p-4 rounded-full transition-colors ${file ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}>
                  {file ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200">
                    {file ? file.name : "Clique para selecionar ou arraste um arquivo"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "MP3, WAV, M4A (Max 25MB)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={isLoading || !file}
              className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0
                ${isLoading || !file
                  ? "bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed shadow-none"
                  : "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/25"
                }
              `}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando Áudio...
                </span>
              ) : (
                "Iniciar Transcrição"
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Result Area */}
          {transcription && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"/></svg>
                  Transcrição Concluída
                </h2>
                <button 
                  onClick={() => navigator.clipboard.writeText(transcription)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  Copiar texto
                </button>
              </div>
              <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-inner">
                <p className="whitespace-pre-wrap leading-relaxed text-zinc-700 dark:text-zinc-300 text-base">
                  {transcription}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
