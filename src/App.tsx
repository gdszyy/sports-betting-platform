// src/App.tsx
import React from 'react';
import MatchList from './components/MatchList';
import './index.css'; // 假设项目使用 TailwindCSS

const App: React.FC = () => {
  return (
    <div className="App">
      <MatchList />
    </div>
  );
};

export default App;
