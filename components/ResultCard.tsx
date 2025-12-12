import React, { useRef, useCallback, useState } from 'react';
import { TranslationResult, SpeakerType } from '../types';
import { Loader2, Download } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ResultCardProps {
  result: TranslationResult;
  speakerType: SpeakerType;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, speakerType }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isFounder = speakerType === SpeakerType.FOUNDER;
  const isHighBS = result.bsScore > 60;

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: '#fffdf5',
        pixelRatio: 2,
        filter: (node) => {
          if (node.classList?.contains('download-btn')) return false;
          return (node.tagName !== 'LINK');
        }
      });
      const link = document.createElement('a');
      link.download = `融资黑话翻译-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsDownloading(false);
    }
  }, [cardRef]);

  return (
    <div className="w-full animate-fade-in-up">
      {/* The Card - 复古报刊风 */}
      <div
        ref={cardRef}
        className="bg-[#fffdf5] border border-stone-300 overflow-hidden relative"
        style={{ boxShadow: '4px 4px 0 #1a1a1a' }}
      >
        {/* 顶部装饰线 */}
        <div className="h-1 bg-[#1a1a1a]"></div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-stone-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#1a1a1a] font-black text-xs tracking-[0.2em] uppercase">融资黑话翻译局</p>
              <p className="text-stone-400 text-[10px] mt-0.5">{isFounder ? 'Founder Edition' : 'Investor Edition'}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-stone-400">可信指数</p>
              <p className="font-black text-lg text-[#1a1a1a]">{100 - result.bsScore}<span className="text-xs">%</span></p>
            </div>
          </div>
        </div>

        {/* 红章 - 高BS时显示 */}
        {isHighBS && (
          <div className="absolute top-20 right-4 w-16 h-16 rounded-full border-4 border-red-600 flex items-center justify-center rotate-[-15deg] opacity-80">
            <div className="text-center">
              <p className="text-red-600 font-black text-xs leading-none">慎</p>
              <p className="text-red-600 font-black text-xs leading-none">信</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Original */}
          <div>
            <p className="text-sm text-stone-800 mb-3 font-black tracking-wide uppercase">
              {isFounder ? '创始人说' : '投资人说'}
            </p>
            <p className="text-stone-600 text-[15px] leading-relaxed serif-font italic pl-3 border-l-2 border-stone-300">
              「{result.original}」
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 border-t border-dashed border-stone-300"></div>
            <span className="text-stone-400 text-[10px] font-bold tracking-widest">翻译</span>
            <div className="flex-1 border-t border-dashed border-stone-300"></div>
          </div>

          {/* Translation */}
          <div>
            <p className="text-sm text-stone-800 mb-3 font-black tracking-wide uppercase">实际意思</p>
            <p className="text-[#1a1a1a] text-xl font-black leading-relaxed serif-font pl-3 border-l-4 border-[#1a1a1a]">
              「{result.translation}」
            </p>
          </div>

          {/* 吐槽/点评 */}
          {result.wittyComment && (
            <div className="bg-stone-100 rounded p-3 mt-2">
              <p className="text-stone-500 text-xs italic">{result.wittyComment}</p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-300 flex items-center justify-between bg-stone-50">
          <div>
            <p className="text-[#1a1a1a] text-[10px] font-bold">融资黑话翻译局</p>
            <p className="text-stone-400 text-[9px]">扫码尝试</p>
          </div>
          <img
            src="/assets/wechat-qrcode.jpg"
            alt="QR"
            className="w-11 h-11 border border-stone-200"
          />
        </div>

        {/* 底部装饰线 */}
        <div className="h-1 bg-[#1a1a1a]"></div>
      </div>

      {/* Download Button */}
      <div className="mt-4 download-btn">
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold text-[#fffdf5] bg-[#1a1a1a] hover:bg-[#333] active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              生成中...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              保存图片分享
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
