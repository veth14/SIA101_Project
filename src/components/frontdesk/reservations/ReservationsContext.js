import { createContext, useContext } from 'react';
export const RoomsContext = createContext(null);
export const useRooms = () => {
    const context = useContext(RoomsContext);
    if (!context) {
        throw new Error('useRooms must be used within a RoomsContext.Provider');
    }
    return context;
};
