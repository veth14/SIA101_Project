/**
 * Backfill script for stats/dashboard
 * 
 * This script scans your Firestore collections (bookings, rooms, staff) and rebuilds
 * the aggregated stats/dashboard document with accurate counts.
 * 
 * Usage:
 *   node scripts/backfillStats.js [--emulator]
 * 
 * Options:
 *   --emulator   Use local emulator (default: production with service account)
 * 
 * Prerequisites for production:
 *   1. Download service account JSON from Firebase Console
 *   2. Set GOOGLE_APPLICATION_CREDENTIALS env var to the JSON path
 * 
 * Example (emulator):
 *   $env:FIRESTORE_EMULATOR_HOST="localhost:8080"; node scripts/backfillStats.js --emulator
 * 
 * Example (production):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="path/to/serviceAccountKey.json"; node scripts/backfillStats.js
 */

const admin = require('firebase-admin');

// Parse args
const useEmulator = process.argv.includes('--emulator');

// Initialize admin SDK
if (useEmulator) {
  console.log('🔧 Using Firestore Emulator');
  process.env.FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080';
  admin.initializeApp({
    projectId: 'demo-project',
  });
} else {
  console.log('🔐 Using Production Firestore (requires service account)');
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('❌ Error: GOOGLE_APPLICATION_CREDENTIALS environment variable not set.');
    console.error('   Set it to the path of your service account JSON file.');
    process.exit(1);
  }
  admin.initializeApp();
}

const db = admin.firestore();

function formatDateKey(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function backfillStats() {
  console.log('📊 Starting stats backfill...\n');

  const stats = {
    totalBookings: 0,
    totalRevenue: 0,
    monthly: {},
    arrivals: {},
    totalRooms: 0,
    availableRooms: 0,
    currentGuests: 0,
    totalStaff: 0,
    activeStaff: 0,
    lowStockItems: 0, // Inventory - to be computed if you have inventory collection
  };

  // 1. Scan bookings
  console.log('📋 Scanning bookings...');
  const bookingsSnap = await db.collection('bookings').get();
  console.log(`   Found ${bookingsSnap.size} bookings`);

  bookingsSnap.forEach((doc) => {
    const data = doc.data();
    stats.totalBookings += 1;

    const revenue = Number(data.totalAmount || data.amount || 0);
    stats.totalRevenue += revenue;

    // Monthly counter
    const checkIn = data.checkIn || data.checkInDate || data.arrivalDate;
    const dateKey = formatDateKey(checkIn);
    if (dateKey) {
      const monthKey = dateKey.slice(0, 7); // YYYY-MM
      stats.monthly[monthKey] = (stats.monthly[monthKey] || 0) + 1;

      // Daily arrivals
      stats.arrivals[dateKey] = (stats.arrivals[dateKey] || 0) + 1;
    }

    // Current guests (checked-in)
    if (data.status === 'checked-in') {
      stats.currentGuests += 1;
    }
  });

  console.log(`   ✅ Total bookings: ${stats.totalBookings}`);
  console.log(`   ✅ Total revenue: ₱${stats.totalRevenue.toLocaleString()}`);
  console.log(`   ✅ Current guests (checked-in): ${stats.currentGuests}`);
  console.log(`   ✅ Monthly breakdown: ${Object.keys(stats.monthly).length} months`);

  // 2. Scan rooms
  console.log('\n🏨 Scanning rooms...');
  const roomsSnap = await db.collection('rooms').get();
  console.log(`   Found ${roomsSnap.size} rooms`);

  roomsSnap.forEach((doc) => {
    const data = doc.data();
    stats.totalRooms += 1;
    if (data.status === 'available') {
      stats.availableRooms += 1;
    }
  });

  console.log(`   ✅ Total rooms: ${stats.totalRooms}`);
  console.log(`   ✅ Available rooms: ${stats.availableRooms}`);

  // 3. Scan staff
  console.log('\n👥 Scanning staff...');
  const staffSnap = await db.collection('staff').get();
  console.log(`   Found ${staffSnap.size} staff`);

  staffSnap.forEach((doc) => {
    const data = doc.data();
    stats.totalStaff += 1;

    // Check isActive (boolean) or status === 'active'
    const isActive = typeof data.isActive === 'boolean' ? data.isActive : (data.status === 'active');
    if (isActive) {
      stats.activeStaff += 1;
    }
  });

  console.log(`   ✅ Total staff: ${stats.totalStaff}`);
  console.log(`   ✅ Active staff: ${stats.activeStaff}`);

  // 4. Optionally scan inventory for lowStockItems
  try {
    console.log('\n📦 Scanning inventory...');
    const inventorySnap = await db.collection('inventory').get();
    console.log(`   Found ${inventorySnap.size} items`);

    inventorySnap.forEach((doc) => {
      const data = doc.data();
      const currentStock = Number(data.currentStock || 0);
      const reorderLevel = Number(data.reorderLevel || 0);
      if (reorderLevel > 0 && currentStock <= reorderLevel) {
        stats.lowStockItems += 1;
      }
    });

    console.log(`   ✅ Low stock items: ${stats.lowStockItems}`);
  } catch (err) {
    console.log('   ⚠️  Inventory collection not found or error reading it (skipping)');
  }

  // 5. Write to stats/dashboard
  console.log('\n💾 Writing aggregated stats to stats/dashboard...');
  await db.doc('stats/dashboard').set(stats, { merge: true });

  console.log('✅ Backfill complete!\n');
  console.log('📊 Final stats:');
  console.log(JSON.stringify(stats, null, 2));
}

backfillStats()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error during backfill:', err);
    process.exit(1);
  });
