
import React from 'react';
import clarusLogo from '../../clarus_logo_max.png';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src={clarusLogo} alt="Clarus Logo" className="w-8 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Clarus</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
