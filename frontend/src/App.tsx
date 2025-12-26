import { } from 'react'
import './App.css'
import MatchNavigation from './components/MatchNavigation'

function App() {
  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-64 flex-shrink-0">
        <MatchNavigation />
      </div>
      <div className="flex-grow p-4 text-white">
        <h1 className="text-3xl font-bold mb-4">比赛列表区域</h1>
        <p>请在左侧导航栏选择联赛以加载比赛列表。</p>
      </div>
    </div>
  )
}

export default App
