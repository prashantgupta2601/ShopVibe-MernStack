import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

const useSocket = () => {
  const { user } = useSelector(state => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');

      // Join user's personal room
      socketRef.current.emit('join', user._id);

      // Join admin room if user is admin
      if (user.role === 'admin') {
        socketRef.current.emit('joinAdmin');
      }

      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [user]);

  // Return socket instance and helper functions
  return {
    socket: socketRef.current,
    emit: (event, data) => {
      if (socketRef.current) {
        socketRef.current.emit(event, data);
      }
    },
    on: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.on(event, callback);
      }
    },
    off: (event, callback) => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    }
  };
};

export default useSocket;
