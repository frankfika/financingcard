import React, { useState } from 'react';
import ResultCard from './components/ResultCard';
import { SpeakerType, TranslationResult } from './types';
import { translateBullshit } from './services/geminiService';
import { DEFAULT_PROMPTS } from './constants';
import { ArrowRight, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [speakerType, setSpeakerType] = useState<SpeakerType>(SpeakerType.FOUNDER);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [visiblePrompts, setVisiblePrompts] = useState<string[]>(() => {
    const all = DEFAULT_PROMPTS[SpeakerType.FOUNDER];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  });

  const isFounder = speakerType === SpeakerType.FOUNDER;

  const shufflePrompts = () => {
    const allPrompts = DEFAULT_PROMPTS[speakerType];
    const shuffled = [...allPrompts].sort(() => Math.random() - 0.5);
    setVisiblePrompts(shuffled.slice(0, 3));
  };

  const handleSpeakerChange = (type: SpeakerType) => {
    setSpeakerType(type);
    const allPrompts = DEFAULT_PROMPTS[type];
    setVisiblePrompts([...allPrompts].sort(() => Math.random() - 0.5).slice(0, 3));
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const data = await translateBullshit(inputText, speakerType);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setResult(null);
  };

  // 结果页
  if (result) {
    return (
      <div className="min-h-screen bg-stone-200">
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-stone-500 hover:text-stone-700 mb-4 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            再翻译一条
          </button>

          {/* Result Card */}
          <ResultCard result={result} speakerType={speakerType} />
        </div>
      </div>
    );
  }

  // 输入页
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-lg mx-auto px-5 py-6">

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-black text-slate-900">融资黑话翻译器</h1>
          <p className="text-slate-400 text-sm mt-1">看穿 VC 和创始人的真实想法</p>
        </div>

        {/* Role Toggle */}
        <div className="flex gap-2 mb-5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => handleSpeakerChange(SpeakerType.FOUNDER)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isFounder
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            🚀 创始人说
          </button>
          <button
            onClick={() => handleSpeakerChange(SpeakerType.INVESTOR)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              !isFounder
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            💼 投资人说
          </button>
        </div>

        {/* Input */}
        <div className="mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isFounder ? "输入创始人说的话..." : "输入投资人说的话..."}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-base outline-none resize-none placeholder-slate-400 min-h-[120px] focus:border-slate-300 focus:bg-white transition-all"
          />
        </div>

        {/* Quick Prompts */}
        <div className="flex items-center gap-2 flex-wrap mb-5">
          {visiblePrompts.map((text, i) => (
            <button
              key={`${text}-${i}`}
              onClick={() => setInputText(text)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-xs text-slate-600 transition-colors"
            >
              {text}
            </button>
          ))}
          <button
            onClick={shufflePrompts}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleTranslate}
          disabled={isLoading || !inputText.trim()}
          className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              翻译中...
            </>
          ) : (
            <>
              开始翻译
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default App;
