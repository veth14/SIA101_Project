import React from 'react';
interface Room {
    id: number;
    name: string;
    description: string;
    image: string;
    price: string;
}
interface RoomCarouselProps {
    rooms: Room[];
    currentRoom: number;
}
export declare const RoomCarousel: React.FC<RoomCarouselProps>;
export {};
