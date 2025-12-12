import React, { useState, useEffect } from 'react';
import ResultCard from './components/ResultCard';
import { SpeakerType, TranslationResult } from './types';
import { translateBullshit } from './services/geminiService';
import { DEFAULT_PROMPTS } from './constants';
import { ArrowRight, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';

// 检测是否在微信内置浏览器中
const isWeChatBrowser = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

const App: React.FC = () => {
  const [speakerType, setSpeakerType] = useState<SpeakerType>(SpeakerType.FOUNDER);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [showWeChatTip, setShowWeChatTip] = useState(false);
  const [visiblePrompts, setVisiblePrompts] = useState<string[]>(() => {
    const all = DEFAULT_PROMPTS[SpeakerType.FOUNDER];
    return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
  });

  useEffect(() => {
    if (isWeChatBrowser()) {
      setShowWeChatTip(true);
    }
  }, []);

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

  // 微信提示遮罩
  const WeChatTipModal = () => (
    <div
      className="fixed inset-0 bg-black/80 z-50"
      onClick={() => setShowWeChatTip(false)}
    >
      {/* 右上角箭头和提示 */}
      <div className="absolute top-4 right-4 text-white text-right">
        {/* 箭头指向右上角 */}
        <svg
          className="w-16 h-16 ml-auto mr-2 animate-bounce"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        >
          <path d="M20 80 L80 20" strokeLinecap="round" />
          <path d="M45 20 L80 20 L80 55" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="mt-2 mr-2">
          <p className="text-lg font-bold">点击右上角「 ··· 」</p>
          <p className="text-lg font-bold mt-1">选择「在浏览器中打开」</p>
        </div>
      </div>
      {/* 底部点击关闭提示 */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-white/60 text-sm">
        点击任意位置关闭
      </div>
    </div>
  );

  // 结果页
  if (result) {
    return (
      <div className="min-h-screen bg-stone-200">
        {showWeChatTip && <WeChatTipModal />}
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

  // 输入页 - 复古报刊风格
  return (
    <div className="min-h-screen bg-stone-200">
      {showWeChatTip && <WeChatTipModal />}
      <div className="max-w-lg mx-auto px-4 py-4">

        {/* Main Card */}
        <div
          className="bg-[#fffdf5] border border-stone-300 overflow-hidden"
          style={{ boxShadow: '4px 4px 0 #1a1a1a' }}
        >
          {/* 顶部装饰线 */}
          <div className="h-1 bg-[#1a1a1a]"></div>

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-stone-300 text-center">
            <p className="text-[#1a1a1a] font-black text-lg tracking-[0.15em] uppercase">融资黑话翻译局</p>
            <p className="text-stone-400 text-xs mt-1">看穿 VC 和创始人的真实想法</p>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">

            {/* Role Toggle */}
            <div>
              <p className="text-xs text-stone-500 mb-2 font-bold tracking-wide">选择说话人</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSpeakerChange(SpeakerType.FOUNDER)}
                  className={`flex-1 py-2.5 text-sm font-bold transition-all border-2 ${
                    isFounder
                      ? 'bg-[#1a1a1a] text-[#fffdf5] border-[#1a1a1a]'
                      : 'bg-transparent text-stone-600 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  创始人
                </button>
                <button
                  onClick={() => handleSpeakerChange(SpeakerType.INVESTOR)}
                  className={`flex-1 py-2.5 text-sm font-bold transition-all border-2 ${
                    !isFounder
                      ? 'bg-[#1a1a1a] text-[#fffdf5] border-[#1a1a1a]'
                      : 'bg-transparent text-stone-600 border-stone-300 hover:border-stone-400'
                  }`}
                >
                  投资人
                </button>
              </div>
            </div>

            {/* Input */}
            <div>
              <p className="text-xs text-stone-500 mb-2 font-bold tracking-wide">输入原话</p>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isFounder ? "创始人说了什么..." : "投资人说了什么..."}
                className="w-full p-4 bg-white border-2 border-stone-300 text-[15px] outline-none resize-none placeholder-stone-400 min-h-[100px] focus:border-[#1a1a1a] transition-colors serif-font"
              />
            </div>

            {/* Quick Prompts */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-stone-500 font-bold tracking-wide">试试这些</p>
                <button
                  onClick={shufflePrompts}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  换一批
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {visiblePrompts.map((text, i) => (
                  <button
                    key={`${text}-${i}`}
                    onClick={() => setInputText(text)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-xs text-stone-600 transition-colors border border-stone-200"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className="w-full py-3.5 font-bold text-[#fffdf5] bg-[#1a1a1a] hover:bg-[#333] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
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

          {/* 底部装饰线 */}
          <div className="h-1 bg-[#1a1a1a]"></div>
        </div>

      </div>
    </div>
  );
};

export default App;
