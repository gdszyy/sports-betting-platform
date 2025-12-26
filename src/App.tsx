import './App.css'
import { useWebSocket, WebSocketCommand, webSocketService } from './hooks/useWebSocket';
import { useEffect, useState } from 'react';

function App() {
  const [oddsChangeCount, setOddsChangeCount] = useState(0);
  const [lastOddsData, setLastOddsData] = useState<any>(null);
  const [lastAliveTime, setLastAliveTime] = useState<string>('N/A');
  const [isConnected, setIsConnected] = useState(webSocketService.isConnected);

  // 模拟一个状态，实际应用中需要更精细的状态管理
  useEffect(() => {
    // 这是一个简化的实现，真正的实现需要WebSocketService提供一个
    // 状态变化监听器。
    // 真正的连接状态应该通过WebSocketService的回调机制来更新，
    // 这里为了演示和快速修复，我们直接轮询公共属性。
    const interval = setInterval(() => {
        setIsConnected(webSocketService.isConnected);
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  // 订阅赔率变化消息 (10020)
  useWebSocket(WebSocketCommand.ODDS_CHANGE, (data: any) => {
    setOddsChangeCount(prev => prev + 1);
    setLastOddsData(data);
    console.log('Odds Change Received:', data);
  });

  // 订阅心跳消息 (10000)
  useWebSocket(WebSocketCommand.ALIVE, () => {
    setLastAliveTime(new Date().toLocaleTimeString());
    console.log('Alive Heartbeat Received');
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">
        VOI-69: WebSocket实时数据通信
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        实现WebSocket连接，处理实时数据推送，包括赔率变化和心跳检测。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 连接状态卡片 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4" style={{ borderColor: isConnected ? '#10B981' : '#EF4444' }}>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">连接状态</h2>
          <p className="text-xl font-bold" style={{ color: isConnected ? '#10B981' : '#EF4444' }}>
            {isConnected ? '已连接 (Connected)' : '断开/重连中 (Disconnected/Reconnecting)'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            WebSocket连接地址: <code>wss://xpbet-ws-api.helix.city/ws</code>
          </p>
        </div>

        {/* 心跳检测卡片 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-blue-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">心跳检测 (Alive: 10000)</h2>
          <p className="text-xl font-bold text-blue-600">
            最后心跳时间: {lastAliveTime}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            服务每30秒发送一次心跳，确保连接活跃。
          </p>
        </div>

        {/* 赔率变化卡片 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-yellow-500">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">赔率变化 (Odds Change: 10020)</h2>
          <p className="text-xl font-bold text-yellow-600">
            累计接收次数: {oddsChangeCount}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            实时更新赔率数据。
          </p>
        </div>

        {/* 调试信息卡片 */}
        <div className="bg-white shadow-lg rounded-xl p-6 border-t-4 border-purple-500 col-span-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">最新赔率数据 (10020)</h2>
          <pre className="bg-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
            {lastOddsData ? JSON.stringify(lastOddsData, null, 2) : '等待数据推送...'}
          </pre>
          <button 
            onClick={() => webSocketService.disconnect()}
            className="mt-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
          >
            手动断开连接 (测试重连)
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
