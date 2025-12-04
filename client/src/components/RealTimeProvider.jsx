import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';

const RealTimeContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRealTime = () => useContext(RealTimeContext);

export const RealTimeProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastEvent, setLastEvent] = useState(null);

    useEffect(() => {
        function onConnect() {
            setIsConnected(true);
            console.log('Socket connected');
            // Join tenant room (mock)
            socket.emit('join_tenant', 'demo_tenant');
        }

        function onDisconnect() {
            setIsConnected(false);
            console.log('Socket disconnected');
        }

        function onUpdate(data) {
            setLastEvent(data);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('dashboard_update', onUpdate);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('dashboard_update', onUpdate);
        };
    }, []);

    return (
        <RealTimeContext.Provider value={{ isConnected, socket, lastEvent }}>
            {children}
        </RealTimeContext.Provider>
    );
};
