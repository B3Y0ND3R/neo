import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.isConnected = true;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
        this.isConnected = false;
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinAdminRoom() {
    if (this.socket) {
      this.socket.emit('join_admin_room');
    }
  }

  leaveAdminRoom() {
    if (this.socket) {
      this.socket.emit('leave_admin_room');
    }
  }

  onStockUpdate(callback) {
    if (this.socket) {
      this.socket.on('stock_updated', callback);
    }
  }

  offStockUpdate() {
    if (this.socket) {
      this.socket.off('stock_updated');
    }
  }

  getSocket() {
    return this.socket;
  }
}

// Create a singleton instance
const socketManager = new SocketManager();

export default socketManager; 