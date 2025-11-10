Cloud Functions (local-only reference)# Cloud Functions for Dashboard Statistics



This folder contains Firebase Cloud Functions source code that maintain an aggregatedThis directory contains Firebase Cloud Functions that maintain real-time aggregated statistics for the admin dashboard, avoiding the need to read thousands of booking documents on every dashboard load.

`stats/dashboard` document. IMPORTANT: do not deploy these functions to a live project

unless you understand billing implications. Some Google Cloud APIs (e.g., Cloud Build,## Overview

Artifact Registry) may require enabling billing / Blaze plan for your Firebase project.

The Cloud Functions automatically update a centralized `stats/dashboard` document whenever bookings are created, updated, or deleted. This approach:

Recommended workflow (safe):

- **Reduces Firestore reads**: Dashboard reads 1 document instead of 100+ bookings

1. Test and run functions locally with the Firebase Emulator (no billing required):- **Provides real-time updates**: Stats update automatically when bookings change

- **Stays within quotas**: Keeps read operations well under Firebase's 50k/day free tier limit

   cd functions- **Scales efficiently**: Uses atomic increments without reading entire collections

   npm install

   npm run serve## Architecture



2. If you must deploy to a real Firebase project, DO NOT deploy unless you have### Stats Document Structure

   explicitly enabled the required Google Cloud APIs and are prepared to accept

   any billing costs. Remove the `functions` entry from the root `firebase.json`The `stats/dashboard` document contains:

   to prevent accidental deployment.

```typescript

Notes:{

- The root project does not reference functions by default to avoid accidental deploys.  totalBookings: number,        // Total count of all bookings

- If you want periodic reconciliation without deploying functions, use a local  totalRevenue: number,          // Sum of all booking revenues

  migration/reconcile script instead (run with a service account and DO NOT commit  arrivals: {                    // Arrivals grouped by date

  credentials to git).    "2025-11-10": 23,

    "2025-11-11": 17,

Functionality provided:    // ... more dates

- `onBookingWrite`: updates `stats/dashboard.totalBookings`, `stats/dashboard.totalRevenue`,  },

  and `stats/dashboard.arrivals.{YYYY-MM-DD}` using atomic increments.  updatedAt: Timestamp,

- `onRoomWrite`: updates `stats/dashboard.totalRooms` and `stats/dashboard.availableRooms`.  migratedAt: Timestamp          // Set during initial migration

}
```

### Cloud Function Trigger

The `onBookingWrite` function runs automatically on every:
- Booking creation → increments counts
- Booking update → adjusts revenue/arrival date if changed
- Booking deletion → decrements counts

It uses `FieldValue.increment()` for atomic updates without reading the stats document first.

## Setup & Deployment

### Prerequisites

1. **Firebase CLI installed**
   ```powershell
   npm install -g firebase-tools
   ```

2. **Firebase project initialized**
   ```powershell
   firebase login
   firebase init functions  # If not already done
   ```

### Installation

1. **Install dependencies**
   ```powershell
   cd functions
   npm install
   ```

2. **Build TypeScript**
   ```powershell
   npm run build
   ```

### Deployment

Deploy the Cloud Function to Firebase:

```powershell
firebase deploy --only functions
```

Or deploy specific functions:
```powershell
firebase deploy --only functions:onBookingWrite
```

### Initial Migration

After deploying the function, run the one-time migration script to compute initial statistics from existing bookings.

#### Option 1: Using Google Cloud Shell (Recommended)

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Activate Cloud Shell
3. Clone your repository or upload the migration script
4. Run:
   ```bash
   cd SIA101_Project
   npm install firebase-admin
   node tools/migrate-compute-stats.js
   ```

#### Option 2: Using Service Account Key (Local)

1. Download service account key:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key"
   - Save as `service-account.json` (DO NOT commit to git)

2. Set environment variable and run:
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS = "path\to\service-account.json"
   cd e:\Downloads\Gelo\SIA101_Project
   npm install firebase-admin
   node tools/migrate-compute-stats.js
   ```

**Important**: Add `service-account.json` to `.gitignore` to avoid committing credentials.

## Monitoring & Maintenance

REMOVED: Cloud Functions and deploy procedures

Per project owner request, the Cloud Functions that previously maintained `stats/dashboard` have been disabled/neutralized and the functions directory is left only for historical reference. Deploy and emulator instructions that previously required enabling Google Cloud APIs or billing have been intentionally removed from active guidance.

What changed:
- The functions source is now inert (no exported triggers).
- The `functions/package.json` has been neutralized to remove deploy/serve scripts.
- The root `firebase.json` no longer references a `functions` codebase.

If you later want to re-enable server-side aggregation you can restore the original implementation from a backup branch or recreate a `functions/` directory and follow Firebase's official docs for deploying Cloud Functions (note: some projects require Blaze/billing to enable necessary Google Cloud APIs).
- **Before**: Dashboard load = ~200 reads (100 bookings + rooms + inventory + staff)
- **After**: Dashboard load = ~51 reads (1 stats + 50 recent bookings for chart + rooms + inventory + staff)
- **Savings**: ~75% reduction in reads per dashboard load

### Function Costs
- Cloud Functions free tier: 2M invocations/month
- Each booking write = 1 function invocation + 1 Firestore write
- Well within free tier for typical hotel operations

### Firebase Spark Plan (Free Tier)
- 50k reads/day
- 20k writes/day
- With new approach: supports ~1000 dashboard loads/day comfortably

## Code Customization

### Adjusting Field Names

If your booking schema uses different field names, edit `functions/src/index.ts`:

```typescript
// Current field mapping
const getRevenue = (doc: any) => Number(doc?.totalAmount ?? doc?.amount ?? 0);
const getArrival = (doc: any) => formatDateKey(doc?.arrivalDate ?? doc?.checkInDate);

// Customize as needed
const getRevenue = (doc: any) => Number(doc?.price ?? 0);
const getArrival = (doc: any) => formatDateKey(doc?.checkin);
```

### Handling Booking Status

To exclude cancelled bookings from totals, add status filtering:

```typescript
if (!before && after) {
  // Only count if status is confirmed
  if (after.status === 'confirmed' || after.status === 'active') {
    bookingsDelta = 1;
    revenueDelta = getRevenue(after);
  }
}
```

## Support

For issues or questions:
1. Check Firebase Console → Functions → Logs
2. Review Firestore rules (ensure Cloud Functions can write to `stats/`)
3. Verify service account permissions
4. Check this README's troubleshooting section

## Next Steps

After successful deployment:
1. ✅ Deploy Cloud Function
2. ✅ Run migration script
3. ✅ Verify stats/dashboard document exists
4. ✅ Dashboard should now show accurate real-time statistics
5. Consider adding reconciliation function for production
6. Monitor Cloud Function logs for first few days
