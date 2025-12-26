// src/services/WebSocketService.ts

/**
 * 定义WebSocket消息类型
 * 消息类型参考 docs/.knowledge/HANDOVER_DOCUMENT.md
 */
export enum WebSocketCommand {
  ALIVE = 10000, // 心跳
  FIXTURE_CHANGE = 10010, // 赛程变更
  ODDS_CHANGE = 10020, // 赔率变化
  BET_STOP = 10030, // 停止投注
  MATCH_STATUS = 10060, // 比赛状态
}

/**
 * 定义WebSocket消息结构
 */
export interface WebSocketMessage<T = any> {
  cmd: WebSocketCommand;
  data: T;
  timestamp: number;
}

// WebSocket连接地址
const WS_URL = 'wss://xpbet-ws-api.helix.city/ws';

// 心跳间隔（毫秒）
const HEARTBEAT_INTERVAL = 30000; 
// 断线重连间隔（毫秒）
const RECONNECT_INTERVAL = 5000;

/**
 * WebSocketService 类
 * 负责管理WebSocket连接、心跳、断线重连和消息分发
 */
export class WebSocketService {
  private ws: WebSocket | null = null;
  public isConnected: boolean = false;
  private messageHandlers: Map<WebSocketCommand, Function[]> = new Map();
  private heartbeatTimer: number | null = null;
  private reconnectTimer: number | null = null;
  private shouldReconnect: boolean = true; // 控制是否应该尝试重连

  constructor() {
    this.connect();
  }

  /**
   * 建立WebSocket连接
   */
  private connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      console.log('WebSocket is already connected or connecting.');
      return;
    }

    console.log(`Attempting to connect to ${WS_URL}...`);
    this.ws = new WebSocket(WS_URL);
    this.isConnected = false;
    this.clearReconnectTimer();
    
    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.onMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  /**
   * 连接成功处理
   */
  private onOpen(): void {
    console.log('WebSocket connected successfully.');
    this.isConnected = true;
    this.startHeartbeat();
    // 成功连接后，停止重连尝试
    this.clearReconnectTimer();
  }

  /**
   * 接收消息处理
   */
  private onMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      
      // 1. 处理心跳消息
      if (message.cmd === WebSocketCommand.ALIVE) {
        // 收到心跳响应，可以重置心跳计时器，确保连接活跃
        console.log('Received ALIVE heartbeat response.');
        // 收到心跳后，不需要额外的处理，心跳计时器会在下一个周期自动发送
      }

      // 2. 分发业务消息
      const handlers = this.messageHandlers.get(message.cmd);
      if (handlers) {
        handlers.forEach(handler => handler(message.data));
      } else {
        console.warn(`No handler registered for command: ${message.cmd}`);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error, event.data);
    }
  }

  /**
   * 连接关闭处理
   */
  private onClose(event: CloseEvent): void {
    this.isConnected = false;
    this.stopHeartbeat();
    console.warn(`WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
    
    // 只有在 shouldReconnect 为 true 时才尝试重连
    if (this.shouldReconnect) {
      this.reconnect();
    }
  }

  /**
   * 连接错误处理
   */
  private onError(event: Event): void {
    console.error('WebSocket error:', event);
    // 错误发生时，通常也会触发 onClose，所以重连逻辑放在 onClose 中处理
    this.ws?.close(); // 主动关闭连接以触发 onClose
  }

  /**
   * 启动心跳机制
   */
  private startHeartbeat(): void {
    this.stopHeartbeat(); // 先清除旧的计时器
    
    const sendHeartbeat = () => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const heartbeatMessage = JSON.stringify({
          cmd: WebSocketCommand.ALIVE,
          timestamp: Date.now(),
          data: {}
        });
        this.ws.send(heartbeatMessage);
        console.log('Sent ALIVE heartbeat.');
      }
    };

    // 立即发送一次心跳，然后每隔 HEARTBEAT_INTERVAL 发送一次
    sendHeartbeat();
    this.heartbeatTimer = window.setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
  }

  /**
   * 停止心跳机制
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * 断线重连机制
   */
  private reconnect(): void {
    this.clearReconnectTimer();
    console.log(`Attempting to reconnect in ${RECONNECT_INTERVAL / 1000} seconds...`);
    
    this.reconnectTimer = window.setTimeout(() => {
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  /**
   * 清除重连计时器
   */
  private clearReconnectTimer(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 注册消息处理器
   * @param cmd 消息命令类型
   * @param handler 消息处理函数
   * @returns 取消订阅函数
   */
  public on<T>(cmd: WebSocketCommand, handler: (data: T) => void): () => void {
    if (!this.messageHandlers.has(cmd)) {
      this.messageHandlers.set(cmd, []);
    }
    const handlers = this.messageHandlers.get(cmd)!;
    handlers.push(handler as Function);

    // 返回一个取消订阅函数
    return () => {
      const index = handlers.indexOf(handler as Function);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  /**
   * 手动断开连接，并阻止重连
   */
  public disconnect(): void {
    this.shouldReconnect = false;
    this.stopHeartbeat();
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close(1000, 'Client requested disconnect');
      this.ws = null;
    }
    console.log('WebSocket manually disconnected.');
  }
}

// 导出单例服务
export const webSocketService = new WebSocketService();
