import React from 'react';
import { SpeakerType } from '../types';
import { Briefcase, Rocket } from 'lucide-react';

interface PersonaSwitchProps {
  speakerType: SpeakerType;
  onChange: (type: SpeakerType) => void;
  disabled: boolean;
}

const PersonaSwitch: React.FC<PersonaSwitchProps> = ({ speakerType, onChange, disabled }) => {
  return (
    <div className="w-full max-w-xs mx-auto mb-3 px-4">
      <div className="relative flex bg-slate-200 p-0.5 rounded-full shadow-inner border border-slate-300">
        <button
          onClick={() => onChange(SpeakerType.FOUNDER)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
            speakerType === SpeakerType.FOUNDER
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>创始人</span>
        </button>
        <button
          onClick={() => onChange(SpeakerType.INVESTOR)}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
            speakerType === SpeakerType.INVESTOR
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>投资人</span>
        </button>
      </div>
    </div>
  );
};

export default PersonaSwitch;