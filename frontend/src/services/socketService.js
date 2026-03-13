import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(userId, isAdmin = false) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

    // Join user room
    if (userId) {
      this.socket.emit('join', userId);
    }

    // Join admin room if admin
    if (isAdmin) {
      this.socket.emit('joinAdmin');
    }

    // Set up event listeners
    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('orderStatusUpdate', (data) => {
      this.emit('orderStatusUpdate', data);
    });

    this.socket.on('paymentSuccess', (data) => {
      this.emit('paymentSuccess', data);
    });

    this.socket.on('lowStockAlert', (data) => {
      this.emit('lowStockAlert', data);
    });

    this.socket.on('newOrder', (data) => {
      this.emit('newOrder', data);
    });

    this.socket.on('inventoryUpdate', (data) => {
      this.emit('inventoryUpdate', data);
    });
  }

  // Event management
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        callback(data);
      });
    }
  }

  // Send events to server
  send(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  // Check if connected
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
