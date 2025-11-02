export interface Room {
  id: string;
  number: string;
  type: string;
  name: string;
  basePrice: number;
  baseGuests: number;
  maxGuests: number;
  additionalGuestPrice: number;
  roomSize: string;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  features: string[];
  amenities: string[];
  image: string;
  floor: number;
  lastCleaned?: string;
  lastMaintenance?: string;
}

export const rooms: Room[] = [
  // Floor 1 - Standard Rooms
  {
    id: '1',
    number: '101',
    type: 'Standard Room',
    name: 'Silid Payapa',
    basePrice: 2500,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 500,
    roomSize: '25 sqm',
    status: 'available',
    features: ['Queen bed', 'Air conditioning', 'Private bathroom', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    floor: 1,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    number: '102',
    type: 'Standard Room',
    name: 'Silid Payapa',
    basePrice: 2500,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 500,
    roomSize: '25 sqm',
    status: 'occupied',
    features: ['Queen bed', 'Air conditioning', 'Private bathroom', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    floor: 1,
    lastCleaned: '2024-01-18T14:00:00Z',
    lastMaintenance: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    number: '103',
    type: 'Standard Room',
    name: 'Silid Payapa',
    basePrice: 2500,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 500,
    roomSize: '25 sqm',
    status: 'cleaning',
    features: ['Queen bed', 'Air conditioning', 'Private bathroom', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker'],
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
    floor: 1,
    lastCleaned: '2024-01-19T16:00:00Z',
    lastMaintenance: '2024-01-15T10:00:00Z',
  },
  
  // Floor 2 - Deluxe Rooms
  {
    id: '4',
    number: '201',
    type: 'Deluxe Room',
    name: 'Silid Marahuyo',
    basePrice: 3800,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 750,
    roomSize: '35 sqm',
    status: 'occupied',
    features: ['King bed', 'Air conditioning', 'Private bathroom', 'Balcony', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500',
    floor: 2,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-12T10:00:00Z',
  },
  {
    id: '5',
    number: '202',
    type: 'Deluxe Room',
    name: 'Silid Marahuyo',
    basePrice: 3800,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 750,
    roomSize: '35 sqm',
    status: 'available',
    features: ['King bed', 'Air conditioning', 'Private bathroom', 'Balcony', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500',
    floor: 2,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-12T10:00:00Z',
  },
  {
    id: '6',
    number: '203',
    type: 'Deluxe Room',
    name: 'Silid Marahuyo',
    basePrice: 3800,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 750,
    roomSize: '35 sqm',
    status: 'maintenance',
    features: ['King bed', 'Air conditioning', 'Private bathroom', 'Balcony', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers'],
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500',
    floor: 2,
    lastCleaned: '2024-01-17T14:00:00Z',
    lastMaintenance: '2024-01-19T09:00:00Z',
  },

  // Floor 3 - Suite Rooms
  {
    id: '7',
    number: '301',
    type: 'Suite Room',
    name: 'Silid Ginhawa',
    basePrice: 5500,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 1000,
    roomSize: '50 sqm',
    status: 'available',
    features: ['King bed', 'Separate living area', 'Air conditioning', 'Private bathroom', 'Balcony', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers', 'Room service'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
    floor: 3,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-10T10:00:00Z',
  },
  {
    id: '8',
    number: '302',
    type: 'Suite Room',
    name: 'Silid Ginhawa',
    basePrice: 5500,
    baseGuests: 2,
    maxGuests: 4,
    additionalGuestPrice: 1000,
    roomSize: '50 sqm',
    status: 'available',
    features: ['King bed', 'Separate living area', 'Air conditioning', 'Private bathroom', 'Balcony', 'Work desk'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Mini fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers', 'Room service'],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500',
    floor: 3,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-10T10:00:00Z',
  },

  // Floor 4 - Family Suites
  {
    id: '9',
    number: '401',
    type: 'Family Suite',
    name: 'Silid Haraya',
    basePrice: 8000,
    baseGuests: 4,
    maxGuests: 8,
    additionalGuestPrice: 1200,
    roomSize: '75 sqm',
    status: 'occupied',
    features: ['2 Queen beds', 'Separate living area', 'Air conditioning', '2 Private bathrooms', 'Balcony', 'Work desk', 'Kitchenette'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Full fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers', 'Room service', 'Microwave'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
    floor: 4,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-08T10:00:00Z',
  },
  {
    id: '10',
    number: '402',
    type: 'Family Suite',
    name: 'Silid Haraya',
    basePrice: 8000,
    baseGuests: 4,
    maxGuests: 8,
    additionalGuestPrice: 1200,
    roomSize: '75 sqm',
    status: 'available',
    features: ['2 Queen beds', 'Separate living area', 'Air conditioning', '2 Private bathrooms', 'Balcony', 'Work desk', 'Kitchenette'],
    amenities: ['Free Wi-Fi', 'Cable TV', 'Full fridge', 'Coffee/tea maker', 'Bathrobe', 'Slippers', 'Room service', 'Microwave'],
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500',
    floor: 4,
    lastCleaned: '2024-01-19T14:00:00Z',
    lastMaintenance: '2024-01-08T10:00:00Z',
  },
];

export const getRoomsByStatus = (status: Room['status']) => {
  return rooms.filter(room => room.status === status);
};

export const getRoomsByType = (type: string) => {
  return rooms.filter(room => room.type === type);
};

export const getAvailableRoomsByType = (type: string) => {
  return rooms.filter(room => room.type === type && room.status === 'available');
};

export const getRoomById = (id: string) => {
  return rooms.find(room => room.id === id);
};

export const getRoomByNumber = (number: string) => {
  return rooms.find(room => room.number === number);
};
