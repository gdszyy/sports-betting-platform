import { useBetSlipStore } from './components/BetSlip/useBetSlipStore'
import BetSlip from './components/BetSlip'
import './App.css'

function App() {
  const { addSelection } = useBetSlipStore()

  const mockSelections = [
    {
      id: '1',
      matchId: 'm1',
      matchName: '皇家马德里 vs 巴塞罗那',
      marketId: 'mk1',
      marketName: '全场胜平负',
      outcomeId: 'o1',
      outcomeName: '皇家马德里',
      odds: 2.10,
    },
    {
      id: '2',
      matchId: 'm2',
      matchName: '曼城 vs 利物浦',
      marketId: 'mk2',
      marketName: '总进球数',
      outcomeId: 'o2',
      outcomeName: '大于 2.5',
      odds: 1.85,
    },
    {
      id: '3',
      matchId: 'm3',
      matchName: '湖人 vs 勇士',
      marketId: 'mk3',
      marketName: '让分盘',
      outcomeId: 'o3',
      outcomeName: '湖人 -5.5',
      odds: 1.90,
      specifiers: 'hcp=-5.5'
    }
  ]

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Main Content */}
      <div className="flex-grow p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">体育博彩平台</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {mockSelections.map(s => (
            <div key={s.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-white">
              <div className="text-xs text-gray-400 mb-2">{s.matchName}</div>
              <div className="font-bold mb-3 text-sm">{s.marketName}</div>
              <button 
                onClick={() => addSelection(s)}
                className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded font-bold flex justify-between px-4 transition-colors"
              >
                <span className="text-sm">{s.outcomeName}</span>
                <span className="text-sm">{s.odds.toFixed(2)}</span>
              </button>
            </div>
          ))}
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 text-white">
          <h2 className="text-xl font-bold mb-4">投注单功能测试</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400 text-sm">
            <li>点击上方模拟赔率按钮添加/移除投注项</li>
            <li>支持单关 (Single) 和 串关 (Parlay) 模式切换</li>
            <li>单关模式下，每个选项独立输入金额</li>
            <li>串关模式下，所有选项共享一个全局金额</li>
            <li>实时计算预计返还金额</li>
          </ul>
        </div>
      </div>

      {/* Right Bet Slip */}
      <div className="w-96 flex-shrink-0 p-4 border-l border-gray-800 bg-gray-900">
        <BetSlip />
      </div>
    </div>
  )
}

export default App
