import React from 'react';
import { APP_TITLE, APP_SUBTITLE } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-3 md:pt-6 pb-2 md:pb-4 px-4 text-center">
      <h1 className="text-xl md:text-4xl font-black text-slate-900 serif-font tracking-tight uppercase">
        {APP_TITLE}
      </h1>
      <p className="text-slate-400 text-[9px] md:text-xs font-medium tracking-wider mt-0.5">
        {APP_SUBTITLE}
      </p>
    </header>
  );
};

export default Header;
