# Stats Backfill Script

This script rebuilds the `stats/dashboard` aggregated document from your existing Firestore data.

## What it does

Scans your Firestore collections and computes:
- **Total bookings** (overall count)
- **Total revenue** (sum of all booking amounts)
- **Monthly bookings** (per-month counters: `monthly.YYYY-MM`)
- **Daily arrivals** (per-day counters: `arrivals.YYYY-MM-DD`)
- **Current guests** (count of checked-in bookings)
- **Total rooms** and **available rooms**
- **Total staff** and **active staff**
- **Low stock items** (from inventory collection, if present)

Then writes all these values to `stats/dashboard` in a single merge update.

## Prerequisites

### For emulator (recommended for testing):
- Firebase emulator running on `localhost:8080`
- No service account needed

### For production:
- Download your Firebase service account JSON key:
  1. Go to Firebase Console → Project Settings → Service Accounts
  2. Click "Generate New Private Key"
  3. Save the JSON file somewhere safe (e.g., `serviceAccountKey.json`)
- Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of your service account JSON

## Usage

### Run against emulator (safe for testing):

```powershell
# Start emulator first in another terminal
npx firebase emulators:start --only firestore

# Then run backfill (in PowerShell)
$env:FIRESTORE_EMULATOR_HOST="localhost:8080"
node scripts/backfillStats.js --emulator
```

### Run against production:

**⚠️ Warning**: This will write to your production Firestore and consume reads/writes.

```powershell
# Set service account path (replace with your actual path)
$env:GOOGLE_APPLICATION_CREDENTIALS="path\to\serviceAccountKey.json"
node scripts/backfillStats.js
```

## When to run this

- **Initial setup**: Run once to populate `stats/dashboard` from existing data
- **After data migration**: If you import historical bookings/rooms/staff
- **Emergency reconciliation**: If stats get out of sync (e.g., after a bug or manual DB edits)
- **Periodically** (optional): Run weekly/monthly as a safety net if you're concerned about drift

## Output

The script will print:
- Number of documents scanned in each collection
- Computed totals
- Final aggregated stats object (JSON)

Example output:
```
📊 Starting stats backfill...

📋 Scanning bookings...
   Found 28 bookings
   ✅ Total bookings: 28
   ✅ Total revenue: ₱1,115,576
   ✅ Current guests (checked-in): 7
   ✅ Monthly breakdown: 3 months

🏨 Scanning rooms...
   Found 50 rooms
   ✅ Total rooms: 50
   ✅ Available rooms: 43

👥 Scanning staff...
   Found 12 staff
   ✅ Total staff: 12
   ✅ Active staff: 8

💾 Writing aggregated stats to stats/dashboard...
✅ Backfill complete!
```

## Safety

- The script uses `{ merge: true }` so it won't overwrite other fields in `stats/dashboard`
- It's idempotent — you can run it multiple times safely
- It only reads your data and writes one document (`stats/dashboard`)

## Troubleshooting

**Error: "GOOGLE_APPLICATION_CREDENTIALS environment variable not set"**
- Make sure you set the env var before running the script (see production usage above)

**Error: "Permission denied"**
- Check that your service account has Firestore read/write permissions
- If using emulator, make sure `FIRESTORE_EMULATOR_HOST` is set correctly

**Stats look wrong**
- Verify your data schema matches expectations (e.g., bookings have `checkIn` field, rooms have `status`, etc.)
- Check the script output to see what it scanned

## Related

- Client-side stats helpers: `src/lib/statsHelpers.ts`
- Security rules: `firestore.rules` (stats/dashboard requires admin role to write)
