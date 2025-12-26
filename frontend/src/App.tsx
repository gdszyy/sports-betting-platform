// src/App.tsx
import React, { useState } from 'react';
import MatchList from './components/MatchList';
import { MarketDemo } from './components/MarketDemo';
import { MatchDetail } from './components/MatchDetail';
import './index.css';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'demo' | 'detail'>('demo');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('sr:match:demo');

  return (
    <div className="App">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 py-3">
            <button
              onClick={() => setCurrentView('demo')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentView === 'demo'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              盘口演示
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentView === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              比赛列表
            </button>
            <button
              onClick={() => setCurrentView('detail')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                currentView === 'detail'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              比赛详情
            </button>
          </div>
        </div>
      </nav>

      {/* 内容区域 */}
      {currentView === 'demo' && <MarketDemo />}
      {currentView === 'list' && <MatchList />}
      {currentView === 'detail' && <MatchDetail matchId={selectedMatchId} />}
    </div>
  );
};

export default App;
