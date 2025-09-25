/**
 * Sample Data for Lost & Found System
 * 
 * This file contains sample lost and found items for testing and demonstration
 * purposes. In a real application, this data would come from a database.
 */

import type { LostFoundItem } from './types';

/**
 * Sample lost and found items data
 */
export const sampleLostFoundItems: LostFoundItem[] = [
  {
    id: 'LF001',
    itemName: 'iPhone 14 Pro',
    description: 'Black iPhone with cracked screen protector, Apple logo case',
    category: 'electronics',
    location: 'Room 205 - Bathroom',
    dateFound: '2024-09-20',
    foundBy: 'Maria Santos (Housekeeping)',
    status: 'unclaimed'
  },
  {
    id: 'LF002',
    itemName: 'Gold Wedding Ring',
    description: 'Gold band with small diamond, engraved "Forever & Always"',
    category: 'jewelry',
    location: 'Pool Area - Lounge Chair #12',
    dateFound: '2024-09-18',
    foundBy: 'Carlos Rivera (Pool Attendant)',
    status: 'claimed',
    guestInfo: {
      name: 'Sarah Johnson',
      room: '312',
      contact: '+63 917 123 4567'
    },
    claimedDate: '2024-09-19',
    claimedBy: 'Sarah Johnson'
  },
  {
    id: 'LF003',
    itemName: 'Blue Denim Jacket',
    description: 'Medium size, Levi\'s brand with leather patches',
    category: 'clothing',
    location: 'Restaurant - Table 8',
    dateFound: '2024-09-15',
    foundBy: 'Ana Cruz (Server)',
    status: 'unclaimed'
  },
  {
    id: 'LF004',
    itemName: 'US Passport',
    description: 'US Passport belonging to John Smith, expires 2028',
    category: 'documents',
    location: 'Lobby - Reception Desk',
    dateFound: '2024-09-22',
    foundBy: 'Reception Staff',
    status: 'claimed',
    claimedDate: '2024-09-22',
    claimedBy: 'John Smith'
  },
  {
    id: 'LF005',
    itemName: 'Ray-Ban Sunglasses',
    description: 'Ray-Ban Aviators with brown case and cleaning cloth',
    category: 'personal',
    location: 'Beach Area - Umbrella Section',
    dateFound: '2024-09-10',
    foundBy: 'Beach Staff',
    status: 'disposed'
  },
  {
    id: 'LF006',
    itemName: 'MacBook Air',
    description: 'Silver MacBook Air 13-inch with stickers on the back',
    category: 'electronics',
    location: 'Business Center',
    dateFound: '2024-09-21',
    foundBy: 'IT Support Staff',
    status: 'unclaimed'
  },
  {
    id: 'LF007',
    itemName: 'Diamond Earrings',
    description: 'Pair of diamond stud earrings in white gold setting',
    category: 'jewelry',
    location: 'Spa - Changing Room',
    dateFound: '2024-09-19',
    foundBy: 'Spa Attendant',
    status: 'unclaimed'
  },
  {
    id: 'LF008',
    itemName: 'Child\'s Teddy Bear',
    description: 'Brown teddy bear with red bow tie, well-loved',
    category: 'personal',
    location: 'Kids Play Area',
    dateFound: '2024-09-17',
    foundBy: 'Activity Coordinator',
    status: 'claimed',
    claimedDate: '2024-09-18',
    claimedBy: 'Emma Wilson (Parent)'
  }
];

/**
 * Category options for filtering
 */
export const categoryOptions = [
  { value: 'all', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'documents', label: 'Documents' },
  { value: 'personal', label: 'Personal Items' },
  { value: 'other', label: 'Other' }
];

/**
 * Status options for filtering
 */
export const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'unclaimed', label: 'Unclaimed' },
  { value: 'claimed', label: 'Claimed' },
  { value: 'disposed', label: 'Disposed' }
];
