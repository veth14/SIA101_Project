export interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  roomName: string;
  floor: number;
  maxGuests: number;
  bedType: string;
  size: string;
  basePrice: number;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  isActive: boolean;
  amenities: string[];
  features: string[];
  currentReservation: string | null;
  description: string;
}

export const ROOMS_DATA: Room[] = [
  // Silid Payapa (Standard Room) - 20 rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${101 + i}`,
    roomNumber: `${101 + i}`,
    roomType: "Standard Room",
    roomName: "Silid Payapa",
    floor: 1,
    maxGuests: 2,
    bedType: i % 3 === 2 ? "Twin Beds" : "Queen Bed",
    size: "25 sqm",
    basePrice: 2500,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Cable TV", "Private Bathroom", "Mini Refrigerator", "Work Desk"],
    features: [i % 2 === 0 ? "City View" : "Garden View", "Non-smoking", "Daily Housekeeping"],
    currentReservation: null,
    description: "Comfortable and cozy room perfect for couples or solo travelers seeking tranquility."
  })),
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${201 + i}`,
    roomNumber: `${201 + i}`,
    roomType: "Standard Room",
    roomName: "Silid Payapa",
    floor: 2,
    maxGuests: 2,
    bedType: i % 3 === 2 ? "Twin Beds" : "Queen Bed",
    size: "25 sqm",
    basePrice: 2500,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Cable TV", "Private Bathroom", "Mini Refrigerator", "Work Desk"],
    features: [i % 2 === 0 ? "City View" : "Garden View", "Non-smoking", "Daily Housekeeping"],
    currentReservation: null,
    description: "Comfortable and cozy room perfect for couples or solo travelers seeking tranquility."
  })),

  // Silid Marahuyo (Deluxe Room) - 15 rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${301 + i}`,
    roomNumber: `${301 + i}`,
    roomType: "Deluxe Room",
    roomName: "Silid Marahuyo",
    floor: 3,
    maxGuests: 3,
    bedType: i % 3 === 2 ? "King Bed + Sofa Bed" : "King Bed",
    size: "35 sqm",
    basePrice: 3800,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Cable TV", "Private Bathroom", "Mini Bar", "Work Desk", "Balcony", "Room Service"],
    features: [i % 3 === 0 ? "Ocean View" : i % 3 === 1 ? "City View" : "Garden View", "Non-smoking", "Daily Housekeeping", "Premium Linens"],
    currentReservation: null,
    description: "Spacious and elegant room with premium amenities and stunning views."
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${401 + i}`,
    roomNumber: `${401 + i}`,
    roomType: "Deluxe Room",
    roomName: "Silid Marahuyo",
    floor: 4,
    maxGuests: 3,
    bedType: i % 3 === 2 ? "King Bed + Sofa Bed" : "King Bed",
    size: "35 sqm",
    basePrice: 3800,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Cable TV", "Private Bathroom", "Mini Bar", "Work Desk", "Balcony", "Room Service"],
    features: [i % 3 === 0 ? "Ocean View" : i % 3 === 1 ? "City View" : "Garden View", "Non-smoking", "Daily Housekeeping", "Premium Linens"],
    currentReservation: null,
    description: "Spacious and elegant room with premium amenities and stunning views."
  })),

  // Silid Ginhawa (Suite Room) - 10 rooms
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `${501 + i}`,
    roomNumber: `${501 + i}`,
    roomType: "Suite Room",
    roomName: "Silid Ginhawa",
    floor: 5,
    maxGuests: 4,
    bedType: i % 3 === 2 ? "King Bed + Sofa Bed" : "King Bed + Living Area",
    size: "55 sqm",
    basePrice: 5500,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Smart TV", "Private Bathroom", "Mini Bar", "Work Desk", "Living Area", "Kitchenette", "Balcony", "Room Service", "Complimentary Breakfast"],
    features: [i % 3 === 0 ? "Panoramic Ocean View" : i % 3 === 1 ? "City Skyline View" : "Garden View", "Non-smoking", "Daily Housekeeping", "Premium Linens", "Separate Living Area"],
    currentReservation: null,
    description: "Luxurious suite with separate living area, kitchenette, and stunning views."
  })),

  // Silid Haraya (Premium Family Suite) - 5 rooms
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${601 + i}`,
    roomNumber: `${601 + i}`,
    roomType: "Premium Family Suite",
    roomName: "Silid Haraya",
    floor: 6,
    maxGuests: 6,
    bedType: i % 2 === 0 ? "King Bed + 2 Single Beds" : "King Bed + Queen Bed",
    size: "75 sqm",
    basePrice: 8000,
    status: "available" as const,
    isActive: true,
    amenities: ["Air Conditioning", "Free WiFi", "Smart TV", "Private Bathroom", "Mini Bar", "Work Desk", "Living Area", "Full Kitchen", "Dining Area", "Balcony", "Room Service", "Complimentary Breakfast", "Laundry Service"],
    features: [i % 3 === 0 ? "Panoramic Ocean View" : i % 3 === 1 ? "City Skyline View" : "Garden View", "Non-smoking", "Daily Housekeeping", "Premium Linens", "Separate Bedrooms", "Family Friendly"],
    currentReservation: null,
    description: "Spacious family suite with separate bedrooms, full kitchen, and stunning views."
  }))
];

// Helper functions
export const getRoomsByType = (roomType: string) => {
  return ROOMS_DATA.filter(room => room.roomType === roomType);
};

export const getAvailableRooms = () => {
  return ROOMS_DATA.filter(room => room.status === 'available');
};

export const getRoomById = (id: string) => {
  return ROOMS_DATA.find(room => room.id === id);
};

export const getRoomByNumber = (roomNumber: string) => {
  return ROOMS_DATA.find(room => room.roomNumber === roomNumber);
};

export const ROOM_TYPES = {
  STANDARD: "Standard Room",
  DELUXE: "Deluxe Room", 
  SUITE: "Suite Room",
  FAMILY: "Premium Family Suite"
};

export const ROOM_NAMES = {
  PAYAPA: "Silid Payapa",
  MARAHUYO: "Silid Marahuyo",
  GINHAWA: "Silid Ginhawa", 
  HARAYA: "Silid Haraya"
};
